import type { EvidenceRecord, ResearchStreamChunk } from "@itrust/shared";

export type StreamCallbacks = {
  onEvidence?: (records: EvidenceRecord[]) => void;
  onToken?: (text: string) => void;
  onMeta?: (step: string) => void;
  onDone?: (citationIds: string[]) => void;
  onError?: (message: string) => void;
};

export async function consumeResearchSse(
  response: Response,
  callbacks: StreamCallbacks,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError?.("No response body");
    return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part
        .split("\n")
        .find((candidate) => candidate.startsWith("data:"));
      if (!line) {
        continue;
      }
      const jsonText = line.replace(/^data:\s*/, "").trim();
      if (!jsonText) {
        continue;
      }
      let chunk: ResearchStreamChunk;
      try {
        chunk = JSON.parse(jsonText) as ResearchStreamChunk;
      } catch {
        callbacks.onError?.("Invalid SSE payload");
        continue;
      }
      if (chunk.type === "evidence") {
        callbacks.onEvidence?.(chunk.records);
      } else if (chunk.type === "token") {
        callbacks.onToken?.(chunk.text);
      } else if (chunk.type === "meta") {
        callbacks.onMeta?.(chunk.step);
      } else if (chunk.type === "done") {
        callbacks.onDone?.(chunk.citationIds);
      } else if (chunk.type === "error") {
        callbacks.onError?.(chunk.message);
      }
    }
  }
}
