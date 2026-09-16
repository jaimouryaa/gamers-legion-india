import { z } from "zod";

export const bundleFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required"),
    description: z.string().trim().min(10, "Add a short description (10+ characters)"),
    bannerImage: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
    gameIds: z.array(z.string()).min(2, "Pick at least 2 games for the bundle"),
    originalPrice: z.coerce.number().min(0, "Must be 0 or more"),
    bundlePrice: z.coerce.number().min(0, "Must be 0 or more"),
    rating: z.coerce.number().min(0).max(5).optional(),
    featured: z.boolean(),
    status: z.enum(["active", "draft", "archived", "expired"]),
    expiresAt: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.bundlePrice <= data.originalPrice, {
    message: "Bundle price must be less than or equal to the original price",
    path: ["bundlePrice"],
  });

export type BundleFormValues = z.infer<typeof bundleFormSchema>;
