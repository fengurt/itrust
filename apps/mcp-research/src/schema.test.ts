import { describe, expect, it } from "vitest";
import { academicSearchInputSchema } from "@itrust/shared";

describe("academicSearchInputSchema", () => {
  it("applies default limit", () => {
    const parsed = academicSearchInputSchema.parse({ query: "test" });
    expect(parsed.limit).toBe(10);
  });
});
