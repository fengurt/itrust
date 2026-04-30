#!/usr/bin/env node
import {
  appendUploadManifestRecord,
  getUploadRecordById,
  searchAcademicCombined,
  searchRealWorldCombined,
  searchUploads,
} from "@itrust/connectors";
import {
  evidenceRecordSchema,
  synthesizeInputSchema,
  type EvidenceRecord,
} from "@itrust/shared";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import path from "node:path";
import { z } from "zod";

const dataDir = path.resolve(
  process.env.ITRUST_DATA_DIR ?? path.join(process.cwd(), "data", "uploads"),
);

const evidenceMemory = new Map<string, EvidenceRecord>();

function rememberEvidence(records: EvidenceRecord[]): void {
  for (const record of records) {
    evidenceMemory.set(record.id, record);
  }
}

function textResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
  };
}

const server = new McpServer({
  name: "itrust-research",
  version: "0.1.0",
});

server.registerTool(
  "search_academic",
  {
    title: "Search academic sources",
    description:
      "Queries OpenAlex, Crossref, and arXiv; returns normalized evidence records.",
    inputSchema: {
      query: z.string().min(1).max(500),
      limit: z.number().int().min(1).max(25).optional(),
    },
  },
  async (args) => {
    const limit = args.limit ?? 10;
    const records = await searchAcademicCombined(args.query, limit);
    const parsed = records.map((record) => evidenceRecordSchema.parse(record));
    rememberEvidence(parsed);
    return textResult({ records: parsed });
  },
);

server.registerTool(
  "search_realworld",
  {
    title: "Search real-world sources",
    description:
      "Queries World Bank indicators and Hacker News stories; returns evidence records.",
    inputSchema: {
      query: z.string().min(1).max(500),
      limit: z.number().int().min(1).max(25).optional(),
      region: z.string().max(64).optional(),
    },
  },
  async (args) => {
    const limit = args.limit ?? 10;
    const records = await searchRealWorldCombined(args.query, limit);
    const parsed = records.map((record) => evidenceRecordSchema.parse(record));
    rememberEvidence(parsed);
    return textResult({ records: parsed, region: args.region ?? null });
  },
);

server.registerTool(
  "search_uploads",
  {
    title: "Search uploaded documents",
    description: "Full-text style match over manifest-backed uploads.",
    inputSchema: {
      query: z.string().min(1).max(500),
      limit: z.number().int().min(1).max(25).optional(),
    },
  },
  async (args) => {
    const limit = args.limit ?? 10;
    const records = await searchUploads(args.query, limit, dataDir);
    const parsed = records.map((record) => evidenceRecordSchema.parse(record));
    rememberEvidence(parsed);
    return textResult({ records: parsed });
  },
);

server.registerTool(
  "fetch_document",
  {
    title: "Fetch document body",
    description: "Returns stored text for uploads; otherwise returns cached evidence.",
    inputSchema: {
      id: z.string().min(1),
    },
  },
  async (args) => {
    if (args.id.startsWith("upload:")) {
      const uploadId = args.id.replace(/^upload:/, "");
      const record = await getUploadRecordById(dataDir, uploadId);
      if (!record) {
        return textResult({ error: "upload_not_found", id: args.id });
      }
      return textResult({
        id: args.id,
        title: record.title,
        text: record.text,
      });
    }
    const cached = evidenceMemory.get(args.id);
    if (cached) {
      return textResult({ evidence: cached });
    }
    return textResult({ error: "not_in_session_cache", id: args.id });
  },
);

server.registerTool(
  "synthesize_evidence",
  {
    title: "Synthesize answer from evidence",
    description:
      "Deterministic merge of snippets (no external LLM). For richer prose, wrap with your model client.",
    inputSchema: {
      question: z.string().min(1).max(2000),
      evidenceIds: z.array(z.string()).min(1).max(50),
    },
  },
  async (args) => {
    const input = synthesizeInputSchema.parse(args);
    const selected: EvidenceRecord[] = [];
    for (const evidenceId of input.evidenceIds) {
      const record = evidenceMemory.get(evidenceId);
      if (record) {
        selected.push(record);
      }
    }
    const lines = selected.map(
      (record, index) =>
        `[${index + 1}] ${record.title} — ${record.claimSnippet} (${record.sourceType})`,
    );
    const draft = `Question: ${input.question}\n\nKey points from sources:\n${lines.join("\n")}`;
    return textResult({
      draft,
      usedEvidenceCount: selected.length,
      missingIds: input.evidenceIds.filter((id) => !evidenceMemory.has(id)),
    });
  },
);

server.registerTool(
  "list_citations",
  {
    title: "List citations",
    description: "Returns structured citation objects for the given evidence ids.",
    inputSchema: {
      ids: z.array(z.string()).min(1).max(100),
    },
  },
  async (args) => {
    const citations = args.ids
      .map((id) => evidenceMemory.get(id))
      .filter((record): record is EvidenceRecord => Boolean(record))
      .map((record) => ({
        id: record.id,
        title: record.title,
        url: record.citationUrl,
        publisher: record.publisher,
        publishedAt: record.publishedAt,
      }));
    return textResult({ citations });
  },
);

server.registerTool(
  "ingest_upload",
  {
    title: "Register upload text",
    description: "Append a text upload to the manifest for later search.",
    inputSchema: {
      id: z.string().min(1).max(128),
      title: z.string().min(1).max(256),
      text: z.string().min(1).max(500_000),
    },
  },
  async (args) => {
    await appendUploadManifestRecord(dataDir, {
      id: args.id,
      title: args.title,
      text: args.text,
    });
    return textResult({ ok: true, id: args.id });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
