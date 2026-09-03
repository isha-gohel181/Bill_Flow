import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { clients } from "./clients";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "overdue",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 })
      .default("0.00")
      .notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    status: invoiceStatusEnum("status").default("draft").notNull(),
    notes: text("notes"),
    publicToken: text("public_token").unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("invoices_user_id_idx").on(table.userId),
    index("invoices_client_id_idx").on(table.clientId),
    index("invoices_due_date_idx").on(table.dueDate),
    index("invoices_status_idx").on(table.status),
    index("invoices_created_at_idx").on(table.createdAt),
    unique("invoices_user_id_invoice_number_unique").on(
      table.userId,
      table.invoiceNumber
    ),
  ]
);

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
