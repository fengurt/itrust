import { describe, expect, it } from "vitest";
import { evidenceRecordSchema } from "./evidence.js";

describe("evidenceRecordSchema", () => {
  it("parses minimal valid record", () => {
    const parsed = evidenceRecordSchema.parse({
      id: "e1",
      sourceType: "internal",
      title: "T",
      claimSnippet: "S",
      relevanceScore: 0.5,
    });
    expect(parsed.id).toBe("e1");
  });
});
