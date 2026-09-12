import { z } from "zod";

export const gameFormSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required"),
    description: z.string().trim().min(10, "Add a short description (10+ characters)"),
    shortDescription: z.string().trim().max(160).optional().or(z.literal("")),
    coverImage: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
    bannerImage: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
    genre: z.array(z.string()).min(1, "Pick at least one genre"),
    platforms: z.array(z.string()).min(1, "Pick at least one platform"),
    originalPrice: z.coerce.number().min(0, "Must be 0 or more"),
    salePrice: z.coerce.number().min(0, "Must be 0 or more"),
    rating: z.coerce.number().min(0).max(5).optional(),
    reviewCount: z.coerce.number().min(0).optional(),
    releaseDate: z.string().optional().or(z.literal("")),
    dealExpiry: z.string().optional().or(z.literal("")),
    featured: z.boolean(),
    status: z.enum(["active", "draft", "archived", "expired"]),
    tags: z.array(z.string()).optional(),
  })
  .refine((data) => data.salePrice <= data.originalPrice, {
    message: "Sale price must be less than or equal to the original price",
    path: ["salePrice"],
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;
