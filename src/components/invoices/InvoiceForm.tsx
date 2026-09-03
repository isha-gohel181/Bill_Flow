"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, InvoiceItem, Invoice } from "@/types/frontend";
import { InvoiceClientSelector } from "./InvoiceClientSelector";
import { InvoiceItemsEditor } from "./InvoiceItemsEditor";
import { InvoiceSummary } from "./InvoiceSummary";
import { Calendar, FileText, User } from "lucide-react";

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  clients: Client[];
  currency?: string;
  disabled?: boolean;
  onSubmit: (formData: any) => Promise<boolean>;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  clients,
  currency = "INR",
  disabled = false,
  onSubmit,
}) => {
  // Format dates to YYYY-MM-DD for standard date input
  const formatDateForInput = (d?: string | Date) => {
    if (!d) return new Date().toISOString().split("T")[0];
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return new Date().toISOString().split("T")[0];
    return dateObj.toISOString().split("T")[0];
  };

  const formatFutureDateForInput = (d?: string | Date) => {
    if (d) return formatDateForInput(d);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 14); // Default due date = 14 days in future
    return dateObj.toISOString().split("T")[0];
  };

  const [clientId, setClientId] = useState<string>(
    initialData?.client?.id || (clients.length > 0 ? clients[0].id : "")
  );
  const [issueDate, setIssueDate] = useState<string>(
    formatDateForInput(initialData?.issueDate)
  );
  const [dueDate, setDueDate] = useState<string>(
    formatFutureDateForInput(initialData?.dueDate)
  );

  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [{ description: "", quantity: 1, rate: 0, amount: 0 }]
  );

  const [taxRate, setTaxRate] = useState<number | string>(
    initialData?.taxRate ? parseFloat(initialData.taxRate) : 0
  );
  const [discount, setDiscount] = useState<number | string>(
    initialData?.discount ? parseFloat(initialData.discount) : 0
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!clientId) {
      errs.clientId = "Please select a client contact.";
    }

    if (!issueDate) {
      errs.issueDate = "Issue date is required.";
    }

    if (!dueDate) {
      errs.dueDate = "Due date is required.";
    } else if (new Date(dueDate) < new Date(issueDate)) {
      errs.dueDate = "Due date cannot be earlier than issue date.";
    }

    // Validate Items
    if (!items || items.length === 0) {
      errs.items = "At least one line item is required.";
    } else {
      items.forEach((item, idx) => {
        if (!item.description.trim()) {
          errs[`item_${idx}_desc`] = "Description is required.";
        }
      });
    }

    // Validate Tax & Discount
    const numTax = typeof taxRate === "number" ? taxRate : parseFloat(taxRate as string) || 0;
    if (numTax < 0 || numTax > 100) {
      errs.taxRate = "Tax rate must be between 0% and 100%.";
    }

    const subtotal = items.reduce((sum, item) => {
      const q = typeof item.quantity === "number" ? item.quantity : parseFloat(item.quantity as string) || 0;
      const r = typeof item.rate === "number" ? item.rate : parseFloat(item.rate as string) || 0;
      return sum + Math.max(0, q * r);
    }, 0);

    const numDisc = typeof discount === "number" ? discount : parseFloat(discount as string) || 0;
    if (numDisc < 0) {
      errs.discount = "Discount cannot be negative.";
    } else if (numDisc > subtotal && subtotal > 0) {
      errs.discount = "Discount cannot exceed subtotal.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      clientId,
      issueDate,
      dueDate,
      tax: typeof taxRate === "number" ? taxRate : parseFloat(taxRate as string) || 0,
      discount: typeof discount === "number" ? discount : parseFloat(discount as string) || 0,
      notes: notes.trim() || undefined,
      items: items.map((it) => ({
        description: it.description.trim(),
        quantity: typeof it.quantity === "number" ? it.quantity : parseFloat(it.quantity as string) || 1,
        rate: typeof it.rate === "number" ? it.rate : parseFloat(it.rate as string) || 0,
      })),
    };

    onSubmit(payload);
  };

  return (
    <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (70%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing & Client Information */}
          <Card className="bg-white border-[#DDE2EC] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DDE2EC]/60">
              <CardTitle className="text-sm font-semibold text-[#212529] flex items-center gap-2">
                <User className="h-4 w-4 text-[#017E84]" />
                Billing & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#212529]">
                  Select Client <span className="text-rose-500">*</span>
                </Label>
                <InvoiceClientSelector
                  clients={clients}
                  selectedClientId={clientId}
                  onSelectClient={setClientId}
                  disabled={disabled}
                  error={errors.clientId}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="issue-date" className="text-xs font-semibold text-[#212529]">
                    Issue Date <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="issue-date"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      disabled={disabled}
                      className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                    />
                  </div>
                  {errors.issueDate && (
                    <p className="text-xs text-rose-500 font-medium">{errors.issueDate}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="due-date" className="text-xs font-semibold text-[#212529]">
                    Due Date <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={disabled}
                      className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="text-xs text-rose-500 font-medium">{errors.dueDate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Editor */}
          <Card className="bg-white border-[#DDE2EC] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DDE2EC]/60">
              <CardTitle className="text-sm font-semibold text-[#212529] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#017E84]" />
                Line Items <span className="text-rose-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <InvoiceItemsEditor
                items={items}
                onChangeItems={setItems}
                currency={currency}
                disabled={disabled}
                errors={errors}
              />
              {errors.items && (
                <p className="text-xs text-rose-500 font-medium mt-2">{errors.items}</p>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="bg-white border-[#DDE2EC] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DDE2EC]/60">
              <CardTitle className="text-sm font-semibold text-[#212529]">
                Notes & Terms (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="Add payment terms, banking details, or notes for your client..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={disabled}
                rows={3}
                className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Right Column (30%) */}
        <div className="space-y-6">
          <InvoiceSummary
            items={items}
            taxRate={taxRate}
            onTaxRateChange={setTaxRate}
            discount={discount}
            onDiscountChange={setDiscount}
            currency={currency}
            disabled={disabled}
            errors={errors}
          />
        </div>
      </div>
    </form>
  );
};
