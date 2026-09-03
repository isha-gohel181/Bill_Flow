import { z } from "zod";

export const invoiceQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z
    .enum(["draft", "sent", "paid", "overdue"])
    .optional(),
  clientId: z
    .string()
    .uuid({ message: "Invalid client ID format" })
    .optional(),
  sortBy: z
    .enum(["createdAt", "issueDate", "dueDate", "invoiceNumber", "total", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc"),
  page: z
    .coerce
    .number()
    .int()
    .min(1, { message: "Page must be an integer greater than or equal to 1" })
    .optional()
    .default(1),
  limit: z
    .coerce
    .number()
    .int()
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit cannot exceed 100" })
    .optional()
    .default(20),
});

export type InvoiceQueryInput = z.infer<typeof invoiceQuerySchema>;
