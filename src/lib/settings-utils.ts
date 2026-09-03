import { db } from "@/db";
import { businessSettings, BusinessSetting } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export async function getOrCreateUserSettings(
  userId: string
): Promise<BusinessSetting> {
  const [existing] = await db
    .select()
    .from(businessSettings)
    .where(eq(businessSettings.userId, userId))
    .limit(1);

  if (existing) {
    return existing;
  }

  // Create default business settings lazily
  const [created] = await db
    .insert(businessSettings)
    .values({
      userId,
      businessName: "My Business",
      currency: "INR",
      invoicePrefix: "INV-",
      logoUrl: null,
    })
    .returning();

  return created;
}
