import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/lib/settings-utils";

export const updateSettingsSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, { message: "Business name is required" })
    .max(100, { message: "Business name must be 100 characters or less" }),
  currency: z.enum(SUPPORTED_CURRENCIES),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, { message: "Invoice prefix is required" })
    .max(20, { message: "Invoice prefix must be 20 characters or less" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: "Invoice prefix can only contain letters, numbers, hyphens, and underscores",
    }),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
