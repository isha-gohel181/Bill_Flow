"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceItem } from "@/types/frontend";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";

interface InvoiceSummaryProps {
  items: InvoiceItem[];
  taxRate: number | string;
  onTaxRateChange: (val: number | string) => void;
  discount: number | string;
  onDiscountChange: (val: number | string) => void;
  currency?: string;
  disabled?: boolean;
  errors?: Record<string, string>;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  items,
  taxRate,
  onTaxRateChange,
  discount,
  onDiscountChange,
  currency = "INR",
  disabled = false,
  errors = {},
}) => {
  // Live calculation preview
  const subtotal = items.reduce((sum, item) => {
    const qty = typeof item.quantity === "number" ? item.quantity : parseFloat(item.quantity as string) || 0;
    const rate = typeof item.rate === "number" ? item.rate : parseFloat(item.rate as string) || 0;
    return sum + Math.max(0, qty * rate);
  }, 0);

  const numTaxRate = typeof taxRate === "number" ? taxRate : parseFloat(taxRate as string) || 0;
  const numDiscount = typeof discount === "number" ? discount : parseFloat(discount as string) || 0;

  const taxAmount = (subtotal * Math.max(0, numTaxRate)) / 100;
  const total = Math.max(0, subtotal + taxAmount - Math.max(0, numDiscount));

  return (
    <div className="bg-white border border-[#DDE2EC] rounded-md p-4 space-y-4 shadow-xs">
      <h3 className="text-xs font-semibold text-[#666666] uppercase tracking-wider border-b border-[#DDE2EC] pb-2">
        Payment & Summary
      </h3>

      {/* Tax & Discount Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="tax-rate" className="text-xs font-semibold text-[#212529]">
            Tax Rate (%)
          </Label>
          <Input
            id="tax-rate"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="0"
            value={taxRate}
            onChange={(e) => onTaxRateChange(e.target.value)}
            disabled={disabled}
            className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
          />
          {errors.taxRate && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.taxRate}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="discount-val" className="text-xs font-semibold text-[#212529]">
            Discount Amount
          </Label>
          <Input
            id="discount-val"
            type="number"
            min="0"
            step="any"
            placeholder="0.00"
            value={discount}
            onChange={(e) => onDiscountChange(e.target.value)}
            disabled={disabled}
            className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
          />
          {errors.discount && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.discount}</p>
          )}
        </div>
      </div>

      {/* Summary Breakdown */}
      <div className="space-y-2 pt-2 text-xs border-t border-[#DDE2EC]/60">
        <div className="flex justify-between items-center text-[#666666]">
          <span>Subtotal</span>
          <span className="font-medium text-[#212529]">
            <CurrencyDisplay amount={subtotal} currency={currency} />
          </span>
        </div>

        {numTaxRate > 0 && (
          <div className="flex justify-between items-center text-[#666666]">
            <span>Tax ({numTaxRate}%)</span>
            <span className="font-medium text-[#212529]">
              +<CurrencyDisplay amount={taxAmount} currency={currency} />
            </span>
          </div>
        )}

        {numDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span>Discount</span>
            <span className="font-medium">
              -<CurrencyDisplay amount={numDiscount} currency={currency} />
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-[#DDE2EC] text-sm font-bold text-[#212529]">
          <span>Total Amount</span>
          <span className="text-[#017E84] text-base">
            <CurrencyDisplay amount={total} currency={currency} />
          </span>
        </div>
      </div>
    </div>
  );
};
