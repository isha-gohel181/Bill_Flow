import {
  User,
  Client,
  Invoice,
  DashboardData,
  BusinessSettings,
  PaginationMeta,
} from "@/types/frontend";

async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; pagination?: PaginationMeta; [key: string]: any }> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: body.error || `HTTP ${res.status} error`,
        details: body.details,
      };
    }

    return body;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network request failed",
    };
  }
}

// Authentication API
export const authApi = {
  async signup(data: { name: string; email: string; password: string }) {
    return fetcher<{ user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getMe() {
    return fetcher<{ user: User }>("/api/auth/me");
  },
};

// Clients API
export const clientsApi = {
  async getClients() {
    return fetcher<{ clients: Client[] }>("/api/clients");
  },
  async getClient(id: string) {
    return fetcher<{ client: Client }>(`/api/clients/${id}`);
  },
  async createClient(data: Partial<Client>) {
    return fetcher<{ client: Client }>("/api/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateClient(id: string, data: Partial<Client>) {
    return fetcher<{ client: Client }>(`/api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteClient(id: string) {
    return fetcher<{ message: string }>(`/api/clients/${id}`, {
      method: "DELETE",
    });
  },
};

// Invoices API
export const invoicesApi = {
  async getInvoices(params?: {
    search?: string;
    status?: string;
    clientId?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.clientId) query.set("clientId", params.clientId);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const url = `/api/invoices${query.toString() ? `?${query.toString()}` : ""}`;
    return fetcher<{ invoices: Invoice[]; pagination: PaginationMeta }>(url);
  },
  async getInvoice(id: string) {
    return fetcher<{ invoice: Invoice }>(`/api/invoices/${id}`);
  },
  async createInvoice(data: any) {
    return fetcher<{ invoice: Invoice }>("/api/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateInvoice(id: string, data: any) {
    return fetcher<{ invoice: Invoice }>(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteInvoice(id: string) {
    return fetcher<{ message: string }>(`/api/invoices/${id}`, {
      method: "DELETE",
    });
  },
  async shareInvoice(id: string) {
    return fetcher<{ url: string; publicToken: string }>(`/api/invoices/${id}/share`, {
      method: "POST",
    });
  },
};

// Public Invoices API
export const publicInvoicesApi = {
  async getPublicInvoice(token: string) {
    return fetcher<{ invoice: Invoice }>(`/api/public/invoices/${token}`);
  },
  async payPublicInvoice(token: string) {
    return fetcher<{ message: string; invoice: Partial<Invoice> }>(
      `/api/public/invoices/${token}/pay`,
      { method: "POST" }
    );
  },
};

// Dashboard API
export const dashboardApi = {
  async getDashboard() {
    return fetcher<DashboardData>("/api/dashboard");
  },
};

// Settings API
export const settingsApi = {
  async getSettings() {
    return fetcher<{ settings: BusinessSettings }>("/api/settings");
  },
  async updateSettings(data: Partial<BusinessSettings>) {
    return fetcher<{ settings: BusinessSettings }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append("logo", file);

    const res = await fetch("/api/settings/logo", {
      method: "POST",
      body: formData,
    });

    return res.json();
  },
  async removeLogo() {
    return fetcher<{ message: string }>("/api/settings/logo", {
      method: "DELETE",
    });
  },
};
