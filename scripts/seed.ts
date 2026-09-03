import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users, businessSettings, clients, invoices, invoiceItems } from "../src/db/schema";
import crypto from "crypto";

async function runSeed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL environment variable is required to run seed script.");
    process.exit(1);
  }

  console.log("🌱 Starting BillFlow seed process...");
  const sql = neon(dbUrl);
  const db = drizzle(sql);

  const demoEmail = "demo@billflow.app";
  const rawPassword = "Demo@12345";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  // 1. Create or retrieve Demo User
  let existingUsers = await db.select().from(users).where(eq(users.email, demoEmail));
  let demoUser = existingUsers[0];

  if (!demoUser) {
    const [inserted] = await db
      .insert(users)
      .values({
        name: "Demo Manager",
        email: demoEmail,
        passwordHash,
      })
      .returning();
    demoUser = inserted;
    console.log(`✅ Demo user created: ${demoEmail}`);
  } else {
    // Update password hash to ensure credentials match Demo@12345
    await db
      .update(users)
      .set({ passwordHash, name: "Demo Manager" })
      .where(eq(users.id, demoUser.id));
    console.log(`✅ Demo user updated: ${demoEmail}`);
  }

  const userId = demoUser.id;

  // 2. Create or Update Business Settings
  let existingSettings = await db.select().from(businessSettings).where(eq(businessSettings.userId, userId));
  if (!existingSettings[0]) {
    await db.insert(businessSettings).values({
      userId,
      businessName: "BillFlow Studio",
      logoUrl: "/logo.png",
      currency: "INR",
      invoicePrefix: "INV-",
    });
    console.log("✅ Business Settings initialized (BillFlow Studio, /logo.png, INR, INV-)");
  } else {
    await db
      .update(businessSettings)
      .set({
        businessName: "BillFlow Studio",
        logoUrl: "/logo.png",
        currency: "INR",
        invoicePrefix: "INV-",
      })
      .where(eq(businessSettings.userId, userId));
    console.log("✅ Business Settings updated");
  }

  // 3. Create Demo Clients
  const clientData = [
    { name: "Acme Corporation", email: "billing@acme.com", company: "Acme Inc.", phone: "+1 (555) 123-4567", address: "100 Business Pkwy, Suite 400, San Jose, CA" },
    { name: "Globex Studios", email: "contact@globex.io", company: "Globex Media", phone: "+1 (555) 987-6543", address: "42 Creative St, Austin, TX" },
    { name: "Stark Tech Solutions", email: "invoices@stark.com", company: "Stark Industries", phone: "+1 (555) 777-8888", address: "10880 Wilshire Blvd, Los Angeles, CA" },
  ];

  const createdClients = [];
  for (const c of clientData) {
    let existing = await db.select().from(clients).where(eq(clients.email, c.email));
    if (!existing[0]) {
      const [inserted] = await db
        .insert(clients)
        .values({
          userId,
          name: c.name,
          email: c.email,
          company: c.company,
          phone: c.phone,
          address: c.address,
        })
        .returning();
      createdClients.push(inserted);
    } else {
      createdClients.push(existing[0]);
    }
  }
  console.log(`✅ ${createdClients.length} Demo clients verified`);

  // 4. Create Demo Invoices (1 Paid, 1 Sent, 1 Overdue, 1 Draft)
  const now = new Date();
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const past15Days = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const future14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const demoInvoices = [
    {
      invoiceNumber: "INV-0001",
      clientId: createdClients[0].id,
      status: "paid" as const,
      issueDate: past30Days,
      dueDate: past15Days,
      subtotal: "75000.00",
      taxRate: "18.00",
      taxAmount: "13500.00",
      discount: "1000.00",
      total: "87500.00",
      notes: "Paid via bank transfer. Thank you for your business!",
      items: [
        { description: "Full-Stack Web Application Development", quantity: "1", rate: "60000.00", amount: "60000.00" },
        { description: "UI/UX System Design & Prototyping", quantity: "1", rate: "15000.00", amount: "15000.00" },
      ],
    },
    {
      invoiceNumber: "INV-0002",
      clientId: createdClients[1].id,
      status: "sent" as const,
      issueDate: now,
      dueDate: future14Days,
      subtotal: "45000.00",
      taxRate: "18.00",
      taxAmount: "8100.00",
      discount: "0.00",
      total: "53100.00",
      notes: "Payment due within 14 business days.",
      items: [
        { description: "Brand Identity Design & Guidelines", quantity: "1", rate: "30000.00", amount: "30000.00" },
        { description: "Social Media Banner Assets", quantity: "3", rate: "5000.00", amount: "15000.00" },
      ],
    },
    {
      invoiceNumber: "INV-0003",
      clientId: createdClients[2].id,
      status: "sent" as const, // Backend overdue resolution evaluates due date < now
      issueDate: past30Days,
      dueDate: past15Days,
      subtotal: "120000.00",
      taxRate: "18.00",
      taxAmount: "21600.00",
      discount: "5000.00",
      total: "136600.00",
      notes: "OVERDUE PAYMENT REMINDER: Please settle balance as soon as possible.",
      items: [
        { description: "Enterprise Cloud Infrastructure Setup", quantity: "1", rate: "80000.00", amount: "80000.00" },
        { description: "DevOps & CI/CD Pipeline Migration", quantity: "1", rate: "40000.00", amount: "40000.00" },
      ],
    },
    {
      invoiceNumber: "INV-0004",
      clientId: createdClients[0].id,
      status: "draft" as const,
      issueDate: now,
      dueDate: future14Days,
      subtotal: "25000.00",
      taxRate: "0.00",
      taxAmount: "0.00",
      discount: "0.00",
      total: "25000.00",
      notes: "Draft proposal - pending client scope confirmation.",
      items: [
        { description: "API Integration Maintenance Support", quantity: "10", rate: "2500.00", amount: "25000.00" },
      ],
    },
  ];

  for (const inv of demoInvoices) {
    const existing = await db
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceNumber, inv.invoiceNumber));

    let invoiceId: string;

    if (!existing[0]) {
      const publicToken = crypto.randomBytes(16).toString("hex");
      const [inserted] = await db
        .insert(invoices)
        .values({
          userId,
          clientId: inv.clientId,
          invoiceNumber: inv.invoiceNumber,
          status: inv.status,
          issueDate: inv.issueDate,
          dueDate: inv.dueDate,
          subtotal: inv.subtotal,
          taxRate: inv.taxRate,
          taxAmount: inv.taxAmount,
          discount: inv.discount,
          total: inv.total,
          notes: inv.notes,
          publicToken,
        })
        .returning();
      invoiceId = inserted.id;

      for (const item of inv.items) {
        await db.insert(invoiceItems).values({
          invoiceId,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        });
      }
      console.log(`✅ Created Invoice ${inv.invoiceNumber} (${inv.status})`);
    } else {
      console.log(`ℹ️ Invoice ${inv.invoiceNumber} already exists.`);
    }
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("==========================================");
  console.log("Demo Email:    demo@billflow.app");
  console.log("Demo Password: Demo@12345");
  console.log("==========================================\n");
}

runSeed().catch((err) => {
  console.error("❌ Error running seed:", err);
  process.exit(1);
});
