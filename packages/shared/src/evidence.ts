import { z } from "zod";

export const evidenceSourceTypeSchema = z.enum([
  "academic_openalex",
  "academic_crossref",
  "academic_arxiv",
  "realworld_news",
  "realworld_public_data",
  "upload",
  "internal",
]);

export type EvidenceSourceType = z.infer<typeof evidenceSourceTypeSchema>;

export const trustSignalsSchema = z
  .object({
    peerReviewed: z.boolean().optional(),
    officialPublisher: z.boolean().optional(),
    recencyDays: z.number().int().nonnegative().optional(),
  })
  .strict();

export type TrustSignals = z.infer<typeof trustSignalsSchema>;

export const evidenceRecordSchema = z
  .object({
    id: z.string().min(1),
    sourceType: evidenceSourceTypeSchema,
    title: z.string(),
    claimSnippet: z.string(),
    citationUrl: z.string().min(1).optional(),
    publisher: z.string().optional(),
    publishedAt: z.string().min(4).optional(),
    relevanceScore: z.number().min(0).max(1),
    trustSignals: trustSignalsSchema.optional(),
    rawRef: z.record(z.unknown()).optional(),
  })
  .strict();

export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>;

export const academicSearchInputSchema = z
  .object({
    query: z.string().min(1).max(500),
    limit: z.number().int().min(1).max(25).default(10),
  })
  .strict();

export const realWorldSearchInputSchema = z
  .object({
    query: z.string().min(1).max(500),
    limit: z.number().int().min(1).max(25).default(10),
    region: z.string().max(64).optional(),
  })
  .strict();

export const uploadSearchInputSchema = z
  .object({
    query: z.string().min(1).max(500),
    limit: z.number().int().min(1).max(25).default(10),
  })
  .strict();

export const synthesizeInputSchema = z
  .object({
    question: z.string().min(1).max(2000),
    evidenceIds: z.array(z.string()).min(1).max(50),
  })
  .strict();

export type SynthesizeInput = z.infer<typeof synthesizeInputSchema>;

export const researchStreamChunkSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("evidence"),
      records: z.array(evidenceRecordSchema),
    })
    .strict(),
  z
    .object({
      type: z.literal("token"),
      text: z.string(),
    })
    .strict(),
  z
    .object({
      type: z.literal("meta"),
      step: z.string(),
    })
    .strict(),
  z
    .object({
      type: z.literal("done"),
      citationIds: z.array(z.string()),
    })
    .strict(),
  z
    .object({
      type: z.literal("error"),
      message: z.string(),
    })
    .strict(),
]);

export type ResearchStreamChunk = z.infer<typeof researchStreamChunkSchema>;
