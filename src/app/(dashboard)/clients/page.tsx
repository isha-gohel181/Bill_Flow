"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { clientsApi } from "@/lib/api";
import { Client } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientTable } from "@/components/clients/ClientTable";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { ClientViewDialog } from "@/components/clients/ClientViewDialog";
import { ClientDeleteDialog } from "@/components/clients/ClientDeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { toast } from "sonner";
import { Plus, Search, Users, X } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientsApi.getClients();
      if (!res.success) {
        setError(res.error || "Failed to load clients");
        setClients([]);
        return;
      }
      setClients(res.clients || []);
    } catch (err: any) {
      console.error("Fetch clients error:", err);
      setError("An unexpected error occurred while loading clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Client-side search filtering by name, email, company
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const term = search.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.company && c.company.toLowerCase().includes(term))
    );
  }, [clients, search]);

  // Handle Create or Update Client submit
  const handleSaveClient = async (data: Partial<Client>): Promise<boolean> => {
    try {
      if (selectedClient) {
        // Edit mode
        const res = await clientsApi.updateClient(selectedClient.id, data);
        if (!res.success) {
          toast.error(res.error || "Failed to update client");
          return false;
        }
        toast.success("Client updated successfully");
      } else {
        // Create mode
        const res = await clientsApi.createClient(data);
        if (!res.success) {
          toast.error(res.error || "Failed to create client");
          return false;
        }
        toast.success("Client created successfully");
      }

      await fetchClients();
      return true;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      return false;
    }
  };

  // Handle Delete Client confirm
  const handleDeleteClient = async (id: string): Promise<boolean> => {
    try {
      const res = await clientsApi.deleteClient(id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete client");
        return false;
      }
      toast.success("Client deleted successfully");
      await fetchClients();
      return true;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      return false;
    }
  };

  const handleOpenCreate = () => {
    setSelectedClient(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setFormOpen(true);
  };

  const handleOpenView = (client: Client) => {
    setSelectedClient(client);
    setViewOpen(true);
  };

  const handleOpenDelete = (client: Client) => {
    setSelectedClient(client);
    setDeleteOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState
          title="Unable to load clients"
          description={error}
          onRetry={fetchClients}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
            Clients
          </h1>
          <p className="text-sm text-[#666666]">
            Manage your customers and billing contacts.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium rounded-md text-sm px-4 py-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Client
        </Button>
      </div>

      {/* Filter / Search Bar (shown when user has clients) */}
      {clients.length > 0 && (
        <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-[#DDE2EC] shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#666666]" />
            <Input
              placeholder="Search clients by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84] h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {search && (
            <span className="text-xs text-[#666666] hidden sm:inline">
              Found {filteredClients.length} of {clients.length} clients
            </span>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {clients.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6 text-[#714B67]" />}
          title="No clients yet"
          description="Add your first client to start creating invoices and managing billing details."
          actionLabel="Create Client"
          onAction={handleOpenCreate}
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6 text-amber-500" />}
          title="No clients found"
          description={`No clients match "${search}". Try adjusting your search query.`}
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
        />
      ) : (
        <ClientTable
          clients={filteredClients}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Dialogs */}
      <ClientFormDialog
        isOpen={formOpen}
        onOpenChange={setFormOpen}
        clientToEdit={selectedClient}
        onSubmit={handleSaveClient}
      />

      <ClientViewDialog
        isOpen={viewOpen}
        onOpenChange={setViewOpen}
        client={selectedClient}
        onEdit={(client) => {
          setSelectedClient(client);
          setFormOpen(true);
        }}
      />

      <ClientDeleteDialog
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        client={selectedClient}
        onConfirmDelete={handleDeleteClient}
      />
    </div>
  );
}
