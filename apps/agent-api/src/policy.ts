import type { EvidenceRecord } from "@itrust/shared";

export type CitationPolicyResult = {
  ok: boolean;
  independentFamilies: number;
  message?: string;
};

function sourceFamily(record: EvidenceRecord): string {
  if (record.sourceType.startsWith("academic_")) {
    return "academic";
  }
  if (record.sourceType.startsWith("realworld_")) {
    return "realworld";
  }
  if (record.sourceType === "upload") {
    return "upload";
  }
  return "other";
}

export function evaluateCitationPolicy(
  records: EvidenceRecord[],
): CitationPolicyResult {
  const families = new Set(records.map(sourceFamily));
  const independentFamilies = families.size;
  if (independentFamilies < 2) {
    return {
      ok: false,
      independentFamilies,
      message:
        "Insufficient independent source families for a high-confidence synthesis (need ≥2 among academic / realworld / upload).",
    };
  }
  return { ok: true, independentFamilies };
}
