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
      logoUrl: "/logo-v4.png",
      currency: "INR",
      invoicePrefix: "INV-",
    });
    console.log("✅ Business Settings initialized (BillFlow Studio, /logo-v4.png, INR, INV-)");
  } else {
    await db
      .update(businessSettings)
      .set({
        businessName: "BillFlow Studio",
        logoUrl: "/logo-v4.png",
        currency: "INR",
        invoicePrefix: "INV-",
      })
      .where(eq(businessSettings.userId, userId));
    console.log("✅ Business Settings updated");
  }

  // 3. Create Expanded Demo Clients
  const clientData = [
    { name: "Acme Corporation", email: "billing@acme.com", company: "Acme Inc.", phone: "+1 (555) 123-4567", address: "100 Business Pkwy, Suite 400, San Jose, CA" },
    { name: "Globex Studios", email: "contact@globex.io", company: "Globex Media", phone: "+1 (555) 987-6543", address: "42 Creative St, Austin, TX" },
    { name: "Stark Tech Solutions", email: "invoices@stark.com", company: "Stark Industries", phone: "+1 (555) 777-8888", address: "10880 Wilshire Blvd, Los Angeles, CA" },
    { name: "Cyberdyne Systems", email: "accounts@cyberdyne.io", company: "Cyberdyne Inc.", phone: "+1 (555) 432-1098", address: "1814 Omega Way, Sunnyvale, CA" },
    { name: "Nexus AI Design", email: "finance@nexusai.design", company: "Nexus AI Labs", phone: "+1 (555) 888-2345", address: "75 Innovation Blvd, Seattle, WA" },
    { name: "Wayne Enterprises", email: "billing@wayne.com", company: "Wayne Corp", phone: "+1 (555) 999-0000", address: "100 Gotham Plaza, Gotham City, NY" },
  ];

  const createdClients: any[] = [];
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

  // 4. Create Invoices for April, May, June, July, August, September 2026
  const monthlyInvoices = [
    // --- APRIL 2026 ---
    {
      invoiceNumber: "INV-2026-041",
      clientId: createdClients[0].id,
      status: "paid" as const,
      issueDate: new Date("2026-04-05T10:00:00Z"),
      dueDate: new Date("2026-04-20T10:00:00Z"),
      subtotal: "60000.00",
      taxRate: "18.00",
      taxAmount: "10800.00",
      discount: "0.00",
      total: "70800.00",
      notes: "April Web Development Services - Paid in Full",
      items: [
        { description: "April Full-Stack Engineering Sprints", quantity: "1", rate: "60000.00", amount: "60000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-042",
      clientId: createdClients[1].id,
      status: "paid" as const,
      issueDate: new Date("2026-04-18T10:00:00Z"),
      dueDate: new Date("2026-04-30T10:00:00Z"),
      subtotal: "45000.00",
      taxRate: "18.00",
      taxAmount: "8100.00",
      discount: "0.00",
      total: "53100.00",
      notes: "April Brand Strategy & Visual Design",
      items: [
        { description: "Brand Identity Design Package", quantity: "1", rate: "45000.00", amount: "45000.00" },
      ],
    },

    // --- MAY 2026 ---
    {
      invoiceNumber: "INV-2026-051",
      clientId: createdClients[2].id,
      status: "paid" as const,
      issueDate: new Date("2026-05-08T10:00:00Z"),
      dueDate: new Date("2026-05-22T10:00:00Z"),
      subtotal: "80000.00",
      taxRate: "18.00",
      taxAmount: "14400.00",
      discount: "0.00",
      total: "94400.00",
      notes: "May Infrastructure Deployment & DevOps",
      items: [
        { description: "AWS Cloud Infrastructure Setup & Migration", quantity: "1", rate: "80000.00", amount: "80000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-052",
      clientId: createdClients[3].id,
      status: "paid" as const,
      issueDate: new Date("2026-05-20T10:00:00Z"),
      dueDate: new Date("2026-05-31T10:00:00Z"),
      subtotal: "35000.00",
      taxRate: "18.00",
      taxAmount: "6300.00",
      discount: "1000.00",
      total: "40300.00",
      notes: "May AI Model Fine-tuning",
      items: [
        { description: "AI NLP Model Fine-tuning", quantity: "1", rate: "35000.00", amount: "35000.00" },
      ],
    },

    // --- JUNE 2026 ---
    {
      invoiceNumber: "INV-2026-061",
      clientId: createdClients[4].id,
      status: "paid" as const,
      issueDate: new Date("2026-06-04T10:00:00Z"),
      dueDate: new Date("2026-06-18T10:00:00Z"),
      subtotal: "95000.00",
      taxRate: "18.00",
      taxAmount: "17100.00",
      discount: "2000.00",
      total: "110100.00",
      notes: "June Mobile App UI/UX Redesign",
      items: [
        { description: "iOS & Android Cross-Platform Design System", quantity: "1", rate: "95000.00", amount: "95000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-062",
      clientId: createdClients[5].id,
      status: "paid" as const,
      issueDate: new Date("2026-06-22T10:00:00Z"),
      dueDate: new Date("2026-06-30T10:00:00Z"),
      subtotal: "50000.00",
      taxRate: "18.00",
      taxAmount: "9000.00",
      discount: "0.00",
      total: "59000.00",
      notes: "June Custom ERP Integration",
      items: [
        { description: "Enterprise API Connector Module", quantity: "1", rate: "50000.00", amount: "50000.00" },
      ],
    },

    // --- JULY 2026 ---
    {
      invoiceNumber: "INV-2026-071",
      clientId: createdClients[0].id,
      status: "paid" as const,
      issueDate: new Date("2026-07-07T10:00:00Z"),
      dueDate: new Date("2026-07-21T10:00:00Z"),
      subtotal: "110000.00",
      taxRate: "18.00",
      taxAmount: "19800.00",
      discount: "3000.00",
      total: "126800.00",
      notes: "July E-commerce Platform Architecture",
      items: [
        { description: "Next.js E-Commerce Engine & Stripe Gateway", quantity: "1", rate: "110000.00", amount: "110000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-072",
      clientId: createdClients[1].id,
      status: "paid" as const,
      issueDate: new Date("2026-07-19T10:00:00Z"),
      dueDate: new Date("2026-07-31T10:00:00Z"),
      subtotal: "40000.00",
      taxRate: "18.00",
      taxAmount: "7200.00",
      discount: "0.00",
      total: "47200.00",
      notes: "July Motion Graphics & Video Editing",
      items: [
        { description: "Product Showcase Video Animation", quantity: "2", rate: "20000.00", amount: "40000.00" },
      ],
    },

    // --- AUGUST 2026 ---
    {
      invoiceNumber: "INV-2026-081",
      clientId: createdClients[2].id,
      status: "paid" as const,
      issueDate: new Date("2026-08-02T10:00:00Z"),
      dueDate: new Date("2026-08-16T10:00:00Z"),
      subtotal: "125000.00",
      taxRate: "18.00",
      taxAmount: "22500.00",
      discount: "5000.00",
      total: "142500.00",
      notes: "August Cybersecurity & Penetration Testing",
      items: [
        { description: "System Security Audit & Remediation", quantity: "1", rate: "125000.00", amount: "125000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-082",
      clientId: createdClients[3].id,
      status: "sent" as const, // Overdue because dueDate 2026-08-28 < current date 2026-09-04
      issueDate: new Date("2026-08-14T10:00:00Z"),
      dueDate: new Date("2026-08-28T10:00:00Z"),
      subtotal: "65000.00",
      taxRate: "18.00",
      taxAmount: "11700.00",
      discount: "0.00",
      total: "76700.00",
      notes: "OVERDUE: August Machine Learning Pipeline Support",
      items: [
        { description: "Data Ingestion & Feature Engineering Pipeline", quantity: "1", rate: "65000.00", amount: "65000.00" },
      ],
    },

    // --- SEPTEMBER 2026 ---
    {
      invoiceNumber: "INV-2026-091",
      clientId: createdClients[4].id,
      status: "sent" as const,
      issueDate: new Date("2026-09-01T10:00:00Z"),
      dueDate: new Date("2026-09-15T10:00:00Z"),
      subtotal: "75000.00",
      taxRate: "18.00",
      taxAmount: "13500.00",
      discount: "0.00",
      total: "88500.00",
      notes: "September UI/UX Design Monthly Retainer",
      items: [
        { description: "Design Systems & Component Maintenance", quantity: "1", rate: "75000.00", amount: "75000.00" },
      ],
    },
    {
      invoiceNumber: "INV-2026-092",
      clientId: createdClients[5].id,
      status: "draft" as const,
      issueDate: new Date("2026-09-04T10:00:00Z"),
      dueDate: new Date("2026-09-18T10:00:00Z"),
      subtotal: "35000.00",
      taxRate: "0.00",
      taxAmount: "0.00",
      discount: "0.00",
      total: "35000.00",
      notes: "Draft proposal for Autumn Marketing Assets",
      items: [
        { description: "Autumn Marketing Collateral & Banners", quantity: "1", rate: "35000.00", amount: "35000.00" },
      ],
    },
  ];

  for (const inv of monthlyInvoices) {
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
      console.log(`✅ Created Invoice ${inv.invoiceNumber} (${inv.status} - ${inv.issueDate.toISOString().slice(0, 7)})`);
    } else {
      // Update existing record with updated monthly date & amounts
      await db
        .update(invoices)
        .set({
          status: inv.status,
          issueDate: inv.issueDate,
          dueDate: inv.dueDate,
          subtotal: inv.subtotal,
          taxRate: inv.taxRate,
          taxAmount: inv.taxAmount,
          discount: inv.discount,
          total: inv.total,
          notes: inv.notes,
        })
        .where(eq(invoices.id, existing[0].id));
      console.log(`🔄 Updated Invoice ${inv.invoiceNumber} (${inv.status} - ${inv.issueDate.toISOString().slice(0, 7)})`);
    }
  }

  console.log("\n🎉 Monthly Seed completed successfully!");
  console.log("==========================================");
  console.log("Covered Months: April, May, June, July, August, September 2026");
  console.log("Demo Email:    demo@billflow.app");
  console.log("Demo Password: Demo@12345");
  console.log("==========================================\n");
}

runSeed().catch((err) => {
  console.error("❌ Error running seed:", err);
  process.exit(1);
});
