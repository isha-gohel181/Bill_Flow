import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Invoices
          </h1>
          <p className="text-sm text-slate-500">
            Create, manage, filter, and track all your invoices.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="No invoices created yet"
        description="Create your first invoice to start billing clients and tracking payments."
        actionLabel="Create Invoice"
      />
    </div>
  );
}
