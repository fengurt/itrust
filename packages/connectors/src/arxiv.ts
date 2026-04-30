import type { EvidenceRecord } from "@itrust/shared";

type ArxivEntry = {
  id: string[];
  title: string[];
  summary: string[];
  published: string[];
  author?: { name: string[] }[];
};

function parseArxivAtom(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  const entryBlocks = xml.split("<entry>");
  for (let i = 1; i < entryBlocks.length; i += 1) {
    const block = entryBlocks[i] ?? "";
    const idMatch = block.match(/<id>([^<]+)<\/id>/);
    const titleMatch = block.match(/<title>([^<]*)<\/title>/);
    const summaryMatch = block.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = block.match(/<published>([^<]+)<\/published>/);
    if (!idMatch || !titleMatch || !summaryMatch || !publishedMatch) {
      continue;
    }
    entries.push({
      id: [idMatch[1].trim()],
      title: [titleMatch[1].trim().replace(/\s+/g, " ")],
      summary: [summaryMatch[1].trim().replace(/\s+/g, " ")],
      published: [publishedMatch[1].trim()],
    });
  }
  return entries;
}

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.15, 1 - index / Math.max(limit, 1));
}

export async function searchArxiv(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://export.arxiv.org/api/query?search_query=all:${encoded}&start=0&max_results=${limit}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "iTRUST-Research-Platform/0.1 (research)",
      },
    });
    if (!response.ok) {
      throw new Error(`arXiv HTTP ${response.status}`);
    }
    const xml = await response.text();
    const entries = parseArxivAtom(xml).slice(0, limit);
    return entries.map((entry, index) => {
      const arxivId = entry.id[0] ?? "";
      const title = entry.title[0] ?? arxivId;
      const summary = entry.summary[0] ?? "";
      const publishedAt = entry.published[0];
      return {
        id: `arxiv:${arxivId}`,
        sourceType: "academic_arxiv",
        title,
        claimSnippet: summary.slice(0, 400),
        citationUrl: arxivId,
        publisher: "arXiv",
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        relevanceScore: scoreFromIndex(index, limit),
        trustSignals: { officialPublisher: true, peerReviewed: false },
      };
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
