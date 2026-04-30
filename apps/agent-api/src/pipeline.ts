import {
  searchAcademicCombined,
  searchRealWorldCombined,
  searchUploads,
} from "@itrust/connectors";
import {
  evidenceRecordSchema,
  type EvidenceRecord,
  type ResearchStreamChunk,
} from "@itrust/shared";
import path from "node:path";
import { evaluateCitationPolicy } from "./policy.js";

const dataDir = path.resolve(
  process.env.ITRUST_DATA_DIR ?? path.join(process.cwd(), "data", "uploads"),
);

function synthesizeDraft(question: string, records: EvidenceRecord[]): string {
  const lines = records.map(
    (record, index) =>
      `[${index + 1}] ${record.title} — ${record.claimSnippet} (${record.sourceType})`,
  );
  return `Question: ${question}\n\nKey points from sources:\n${lines.join("\n")}`;
}

export async function* runResearchPipeline(
  question: string,
  options: { academicLimit: number; realLimit: number; uploadLimit: number },
): AsyncGenerator<ResearchStreamChunk> {
  yield { type: "meta", step: "plan" };
  yield { type: "meta", step: "retrieve_academic" };
  const academic = await searchAcademicCombined(question, options.academicLimit).then(
    (records) => records.map((record) => evidenceRecordSchema.parse(record)),
  );
  yield { type: "evidence", records: academic };

  yield { type: "meta", step: "retrieve_realworld" };
  const real = await searchRealWorldCombined(question, options.realLimit).then(
    (records) => records.map((record) => evidenceRecordSchema.parse(record)),
  );
  yield { type: "evidence", records: real };

  yield { type: "meta", step: "retrieve_uploads" };
  const uploads = await searchUploads(question, options.uploadLimit, dataDir).then(
    (records) => records.map((record) => evidenceRecordSchema.parse(record)),
  );
  yield { type: "evidence", records: uploads };

  const merged = [...academic, ...real, ...uploads].sort(
    (a, b) => b.relevanceScore - a.relevanceScore,
  );
  const policy = evaluateCitationPolicy(merged);
  if (!policy.ok && policy.message) {
    yield { type: "meta", step: `policy_warning:${policy.message}` };
  }

  yield { type: "meta", step: "synthesize" };
  const draft = synthesizeDraft(question, merged.slice(0, 20));
  const chunkSize = 120;
  for (let index = 0; index < draft.length; index += chunkSize) {
    yield { type: "token", text: draft.slice(index, index + chunkSize) };
  }

  const citationIds = merged.map((record) => record.id);
  yield { type: "done", citationIds };
}
