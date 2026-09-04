"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { settingsApi } from "@/lib/api";
import { BusinessSettings } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { BusinessProfileForm } from "@/components/settings/BusinessProfileForm";
import { InvoiceSettingsForm } from "@/components/settings/InvoiceSettingsForm";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [initialSettings, setInitialSettings] = useState<BusinessSettings | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await settingsApi.getSettings();
      if (!res.success || !res.settings) {
        setError(res.error || "Failed to load business settings");
        return;
      }

      const s = res.settings;
      setInitialSettings(s);
      setBusinessName(s.businessName || "");
      setCurrency(s.currency || "INR");
      setInvoicePrefix(s.invoicePrefix || "INV-");
      setLogoUrl(s.logoUrl || null);
    } catch (err: any) {
      console.error("Fetch settings error:", err);
      setError("An unexpected error occurred while loading settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Check if form has unsaved changes
  const isDirty = useMemo(() => {
    if (!initialSettings) return false;
    return (
      businessName.trim() !== (initialSettings.businessName || "").trim() ||
      currency !== (initialSettings.currency || "INR") ||
      invoicePrefix.trim() !== (initialSettings.invoicePrefix || "INV-").trim()
    );
  }, [initialSettings, businessName, currency, invoicePrefix]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!businessName.trim()) {
      errs.businessName = "Business name is required.";
    }
    if (!invoicePrefix.trim()) {
      errs.invoicePrefix = "Invoice prefix is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        businessName: businessName.trim(),
        currency,
        invoicePrefix: invoicePrefix.trim(),
      };

      const res = await settingsApi.updateSettings(payload);
      if (!res.success) {
        toast.error(res.error || "Failed to save settings");
        setSaving(false);
        return;
      }

      toast.success("Settings saved successfully");
      await fetchSettings();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
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
          title="Unable to load settings"
          description={error}
          onRetry={fetchSettings}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
            Settings
          </h1>
          <p className="text-sm text-[#666666]">
            Manage your business profile, currency, and invoice numbering prefix.
          </p>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium rounded-md text-sm px-4 py-2 shadow-xs self-start sm:self-auto disabled:opacity-40"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Main Settings Form Panels */}
      <div className="max-w-4xl space-y-6">
        <BusinessProfileForm
          businessName={businessName}
          onBusinessNameChange={setBusinessName}
          logoUrl={logoUrl}
          onLogoChange={fetchSettings}
          disabled={saving}
          errors={errors}
        />

        <InvoiceSettingsForm
          currency={currency}
          onCurrencyChange={setCurrency}
          invoicePrefix={invoicePrefix}
          onInvoicePrefixChange={setInvoicePrefix}
          disabled={saving}
          errors={errors}
        />
      </div>
    </form>
  );
}
