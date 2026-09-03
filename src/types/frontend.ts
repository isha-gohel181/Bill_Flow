export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number | string;
  rate: number | string;
  amount?: number | string;
}

export interface BusinessSettings {
  businessName: string;
  logoUrl?: string | null;
  currency: string;
  invoicePrefix: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  isPayable?: boolean;
  issueDate: string;
  dueDate: string;
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  discount: string;
  total: string;
  notes?: string | null;
  publicToken?: string | null;
  client: Client;
  items?: InvoiceItem[];
  business?: BusinessSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummary {
  totalEarned: string;
  outstanding: string;
  overdue: string;
}

export interface IncomePoint {
  month: string;
  label: string;
  amount: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentInvoices: Invoice[];
  incomeOverTime: IncomePoint[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  details?: Record<string, unknown>;
  message?: string;
  data?: T;
}
