import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const businessSettings = pgTable(
  "business_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    businessName: text("business_name").default("My Business").notNull(),
    logoUrl: text("logo_url"),
    currency: text("currency").default("INR").notNull(),
    invoicePrefix: text("invoice_prefix").default("INV-").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  }
);

export type BusinessSetting = typeof businessSettings.$inferSelect;
export type NewBusinessSetting = typeof businessSettings.$inferInsert;
