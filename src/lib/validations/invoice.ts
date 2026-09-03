import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, { message: "Item description is required" })
    .max(500, { message: "Item description must be 500 characters or less" }),
  quantity: z
    .number()
    .gt(0, { message: "Quantity must be greater than 0" }),
  rate: z
    .number()
    .gte(0, { message: "Rate must be greater than or equal to 0" }),
});

export const createInvoiceSchema = z.object({
  clientId: z
    .string()
    .uuid({ message: "Invalid client ID format" }),
  issueDate: z
    .string()
    .min(1, { message: "Issue date is required" }),
  dueDate: z
    .string()
    .min(1, { message: "Due date is required" }),
  tax: z
    .number()
    .gte(0, { message: "Tax percentage must be greater than or equal to 0" })
    .optional()
    .default(0),
  discount: z
    .number()
    .gte(0, { message: "Discount must be greater than or equal to 0" })
    .optional()
    .default(0),
  status: z
    .enum(["draft", "sent", "paid", "overdue"])
    .optional()
    .default("draft"),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be 1000 characters or less" })
    .optional()
    .nullable(),
  items: z
    .array(invoiceItemSchema)
    .min(1, { message: "Invoice must contain at least one line item" }),
});

export const updateInvoiceSchema = z.object({
  clientId: z.string().uuid().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  tax: z.number().gte(0).optional(),
  discount: z.number().gte(0).optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).optional(),
  notes: z.string().trim().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
