# BillFlow — Professional Invoicing & Payment Tracking System

BillFlow is a full-stack SaaS invoicing application designed for freelancers, agencies, and small studios. Built with an Odoo-inspired UI design system, BillFlow provides automated financial calculations, client contact management, server-side invoice filtering, browser print and downloadable PDF generation, public shareable links, and simulated client test payments.

---

## 🌟 Key Features

* **Authentication & User Isolation**: Secure email/password login using Auth.js with bcrypt hashing and complete user-level data isolation.
* **Client Management (CRUD)**: Create, view, edit, and search client records with instant dashboard linking.
* **Invoice Lifecycle Management**: Complete draft, sent, paid, and overdue invoice workflows.
* **Authoritative Financial Engine**: Automatic line item calculations, subtotal, tax rate, discount deduction, and total calculations handled strictly on the backend.
* **Server-Side Filtering & Pagination**: High-performance invoice search, multi-field filtering (status, client), and page controls executed directly via PostgreSQL queries.
* **Financial Dashboard & Analytics**: Interactive revenue metrics (Total Earned, Outstanding Balances, Overdue Alerts), recent invoice list, and 6-month revenue visualization chart (powered by Recharts).
* **Public Share Links & Online Payments**: Instant shareable public links (`/invoice/[token]`) allowing unauthenticated clients to view invoices and process test/demo payments.
* **Document Printing & PDF Export**: Instant browser print styles (`@media print`) and downloadable PDF document generation powered by `html2pdf.js`.
* **Custom Business Settings**: Business profile management, customizable logo image upload (Vercel Blob storage), currency configuration (INR, USD, EUR, GBP, AUD, CAD), and custom invoice prefixing (`INV-`).

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons, Recharts, Sonner toasts.
* **Backend**: Next.js Route Handlers, Auth.js (NextAuth v5 beta), Zod validation, bcrypt password hashing.
* **Database & ORM**: Neon PostgreSQL, Drizzle ORM, Drizzle Kit.
* **Storage & Utilities**: Vercel Blob (for business logo uploads), `html2pdf.js` (for client PDF downloads).

---

## 🔑 Demo Credentials

For quick evaluation and testing of the assessment environment:

* **Email**: `demo@billflow.app`
* **Password**: `Demo@12345`

*Note: You can seed demo data into your PostgreSQL database using `npm run db:seed`.*

---

## ⚙️ Local Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/isha-gohel181/Bill_Flow.git
cd Bill_Flow/billflow
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required environment variables in `.env.local`:

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@ep-sample-host.neon.tech/neondb?sslmode=require"

# Auth.js Encryption Secret
AUTH_SECRET="your_generated_auth_secret_here"

# App Public Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel Blob Token (Required for logo uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_here"
```

### 3. Database Migration & Seeding

Run Drizzle migrations to set up PostgreSQL database tables and enums:

```bash
npm run db:push
# OR
npm run db:migrate
```

Seed initial demo account, business settings, clients, and sample invoices:

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Package Scripts Overview

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start Next.js local development server |
| `npm run build` | Build production bundle for Vercel deployment |
| `npm run start` | Run Next.js production build locally |
| `npm run lint` | Run ESLint static analysis |
| `npm run db:push` | Push Drizzle schema directly to Neon PostgreSQL |
| `npm run db:migrate` | Execute SQL migration scripts from `./drizzle` |
| `npm run db:seed` | Run TypeScript seed script (`scripts/seed.ts`) |

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Import project into Vercel.
3. Configure Environment Variables in Vercel settings (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `BLOB_READ_WRITE_TOKEN`).
4. Trigger deployment. The production build (`npm run build`) will execute automatically.

---

## 🔒 Security & Data Protection

* **Secrets**: All local environment secrets (`.env.local`) are ignored by `.gitignore`.
* **Authentication**: Passwords are saved strictly using salted `bcrypt` hashes.
* **Authoritative Calculations**: Financial monetary totals (`subtotal`, `taxAmount`, `total`) are computed server-side to prevent client tamper vulnerabilities.
* **Public Invoice Protection**: Public tokens use cryptographically random hex strings. Paid invoices reject repeated payment submissions on the backend.
