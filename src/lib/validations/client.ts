import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  company: z
    .string()
    .trim()
    .max(100, { message: "Company name must be 100 characters or less" })
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(500, { message: "Address must be 500 characters or less" })
    .optional()
    .nullable(),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Phone number must be 30 characters or less" })
    .optional()
    .nullable(),
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
