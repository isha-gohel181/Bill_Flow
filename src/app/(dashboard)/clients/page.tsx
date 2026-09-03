import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Clients
          </h1>
          <p className="text-sm text-slate-500">
            Manage your client contacts, billing addresses, and information.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No clients added yet"
        description="Add your first client to start creating invoices and managing billing details."
        actionLabel="Add Client"
      />
    </div>
  );
}
