import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "./http.js";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchJson", () => {
  it("parses json body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hello: "world" }),
    });
    vi.stubGlobal("fetch", mockFetch);
    const result = await fetchJson<{ hello: string }>("https://example.com/x");
    expect(result.hello).toBe("world");
  });
});
