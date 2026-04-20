import * as z from "zod";

export const codeFormSchema = z.object({
  category: z
    .object({
      categoryId: z.number(),
      category: z.string(),
    })
    .nullable(),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  tomrexName: z
    .string()
    .max(100, "TOMREX name must be less than 100 characters")
    .optional(),
  active: z.boolean().default(true),
  cannotModify: z.boolean().default(false),
});

codeFormSchema.refine((data) => data.category, {
  path: ["category"],
  message: "Category is required",
});

export type CodeFormSchema = z.infer<typeof codeFormSchema>;
