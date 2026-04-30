import { describe, expect, it } from "vitest";
import { ResponseCache } from "./index.js";

describe("ResponseCache", () => {
  it("stores and retrieves", () => {
    const cache = new ResponseCache<string>({ maxEntries: 10, defaultTtlMs: 60_000 });
    cache.set("k", "v");
    expect(cache.get("k")).toBe("v");
  });
});
