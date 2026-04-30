import { describe, expect, it } from "vitest";
import { evaluateCitationPolicy } from "./policy.js";
import type { EvidenceRecord } from "@itrust/shared";

const academic: EvidenceRecord = {
  id: "a1",
  sourceType: "academic_openalex",
  title: "A",
  claimSnippet: "x",
  relevanceScore: 0.9,
};

const realworld: EvidenceRecord = {
  id: "r1",
  sourceType: "realworld_news",
  title: "R",
  claimSnippet: "y",
  relevanceScore: 0.8,
};

describe("evaluateCitationPolicy", () => {
  it("fails with single family", () => {
    const result = evaluateCitationPolicy([academic, { ...academic, id: "a2" }]);
    expect(result.ok).toBe(false);
  });

  it("passes with academic + realworld", () => {
    const result = evaluateCitationPolicy([academic, realworld]);
    expect(result.ok).toBe(true);
  });
});
