import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getPublicInvoiceUrl(publicToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/invoice/${publicToken}`;
}
