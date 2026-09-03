import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface InputItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface CalculatedItem {
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

export function calculateInvoiceTotals(
  items: InputItem[],
  taxRatePercent: number = 0,
  discountAmount: number = 0
) {
  const calculatedItems: CalculatedItem[] = items.map((item) => {
    const qty = Number(item.quantity);
    const rate = Number(item.rate);
    // Precise cent rounding
    const amountCents = Math.round(qty * rate * 100);
    const amount = (amountCents / 100).toFixed(2);
    return {
      description: item.description.trim(),
      quantity: qty.toFixed(2),
      rate: rate.toFixed(2),
      amount,
    };
  });

  const subtotalCents = calculatedItems.reduce(
    (sum, item) => sum + Math.round(Number(item.amount) * 100),
    0
  );
  const subtotal = (subtotalCents / 100).toFixed(2);

  const taxRate = Math.max(0, Number(taxRatePercent));
  const taxAmountCents = Math.round((subtotalCents * taxRate) / 100);
  const taxAmount = (taxAmountCents / 100).toFixed(2);

  const rawDiscount = Math.max(0, Number(discountAmount));
  const maxAllowedDiscountCents = subtotalCents + taxAmountCents;
  const discountCents = Math.min(
    Math.round(rawDiscount * 100),
    maxAllowedDiscountCents
  );
  const discount = (discountCents / 100).toFixed(2);

  const totalCents = Math.max(0, subtotalCents + taxAmountCents - discountCents);
  const total = (totalCents / 100).toFixed(2);

  return {
    subtotal,
    taxRate: taxRate.toFixed(2),
    taxAmount,
    discount,
    total,
    calculatedItems,
  };
}

export async function generateInvoiceNumber(userId: string): Promise<string> {
  const { getOrCreateUserSettings } = await import("@/lib/settings-utils");
  const settings = await getOrCreateUserSettings(userId);
  const prefix = (settings.invoicePrefix || "INV-").trim();

  const userInvoices = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.userId, userId));

  let maxNum = 0;
  const regex = /(\d+)$/;

  for (const inv of userInvoices) {
    const match = inv.invoiceNumber.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(4, "0");
  return `${prefix}${padded}`;
}

export function calculateEffectiveStatus(
  status: "draft" | "sent" | "paid" | "overdue",
  dueDate: Date | string
): "draft" | "sent" | "paid" | "overdue" {
  if (status === "paid") {
    return "paid";
  }
  if (status === "draft") {
    return "draft";
  }

  const now = new Date();
  const due = new Date(dueDate);
  // Strip time for exact date comparison
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (now > due) {
    return "overdue";
  }

  return status;
}
