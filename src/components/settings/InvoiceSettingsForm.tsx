"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Coins } from "lucide-react";

interface InvoiceSettingsFormProps {
  currency: string;
  onCurrencyChange: (val: string) => void;
  invoicePrefix: string;
  onInvoicePrefixChange: (val: string) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

const CURRENCIES = [
  { code: "INR", name: "INR — Indian Rupee (₹)" },
  { code: "USD", name: "USD — US Dollar ($)" },
  { code: "EUR", name: "EUR — Euro (€)" },
  { code: "GBP", name: "GBP — British Pound (£)" },
  { code: "AUD", name: "AUD — Australian Dollar ($)" },
  { code: "CAD", name: "CAD — Canadian Dollar ($)" },
];

export const InvoiceSettingsForm: React.FC<InvoiceSettingsFormProps> = ({
  currency,
  onCurrencyChange,
  invoicePrefix,
  onInvoicePrefixChange,
  disabled = false,
  errors = {},
}) => {
  return (
    <Card className="bg-white border-[#DDE2EC] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#DDE2EC]/60">
        <CardTitle className="text-sm font-semibold text-[#212529] flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#017E84]" />
          Invoice Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Currency Select */}
        <div className="space-y-1.5">
          <Label htmlFor="currency-select" className="text-xs font-semibold text-[#212529]">
            Default Currency <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={currency}
            onValueChange={(val) => onCurrencyChange(val || "INR")}
            disabled={disabled}
          >
            <SelectTrigger id="currency-select" className="w-full text-xs border-[#DDE2EC] bg-white">
              <div className="flex items-center gap-2 truncate">
                <Coins className="h-4 w-4 text-[#666666] shrink-0" />
                <SelectValue placeholder="Select currency..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.currency && (
            <p className="text-xs text-rose-500 font-medium">{errors.currency}</p>
          )}
        </div>

        {/* Invoice Prefix Field */}
        <div className="space-y-1.5">
          <Label htmlFor="invoice-prefix" className="text-xs font-semibold text-[#212529]">
            Invoice Number Prefix <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="invoice-prefix"
            placeholder="INV- or ACME-"
            value={invoicePrefix}
            onChange={(e) => onInvoicePrefixChange(e.target.value)}
            disabled={disabled}
            className="text-xs font-mono bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
          />
          {errors.invoicePrefix ? (
            <p className="text-xs text-rose-500 font-medium">{errors.invoicePrefix}</p>
          ) : (
            <p className="text-[11px] text-[#666666]">
              This prefix is used for newly generated invoice numbers. Existing invoice numbers will remain unchanged.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
