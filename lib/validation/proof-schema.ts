import { z } from "zod";

export const proofFormSchema = z.object({
  imageUrl: z.string().trim().url("Upload a screenshot first"),
  caption: z.string().trim().max(200, "Keep it under 200 characters").optional().or(z.literal("")),
  gameId: z.string().uuid().optional().or(z.literal("")),
  published: z.boolean(),
});

export type ProofFormValues = z.infer<typeof proofFormSchema>;
