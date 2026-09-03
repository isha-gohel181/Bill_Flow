"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceItem } from "@/types/frontend";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItemsEditorProps {
  items: InvoiceItem[];
  onChangeItems: (items: InvoiceItem[]) => void;
  currency?: string;
  disabled?: boolean;
  errors?: Record<string, string>;
}

export const InvoiceItemsEditor: React.FC<InvoiceItemsEditorProps> = ({
  items,
  onChangeItems,
  currency = "INR",
  disabled = false,
  errors = {},
}) => {
  const handleAddItem = () => {
    onChangeItems([
      ...items,
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    onChangeItems(newItems);
  };

  const handleFieldChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === "description") {
      item.description = value;
    } else if (field === "quantity") {
      const q = parseFloat(value);
      item.quantity = isNaN(q) ? "" : q;
    } else if (field === "rate") {
      const r = parseFloat(value);
      item.rate = isNaN(r) ? "" : r;
    }

    // Calculate line preview amount
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    const rate = typeof item.rate === "number" ? item.rate : 0;
    item.amount = Math.max(0, qty * rate);

    updated[index] = item;
    onChangeItems(updated);
  };

  return (
    <div className="space-y-3">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto border border-[#DDE2EC] rounded-md bg-white">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-[#DDE2EC] text-[#666666] font-semibold">
            <tr>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 w-28 text-center">Qty</th>
              <th className="py-2.5 px-3 w-36 text-right">Rate</th>
              <th className="py-2.5 px-3 w-36 text-right">Amount</th>
              <th className="py-2.5 px-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EC]/60">
            {items.map((item, idx) => {
              const qty = typeof item.quantity === "number" ? item.quantity : 0;
              const rate = typeof item.rate === "number" ? item.rate : 0;
              const amount = qty * rate;

              return (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="p-2.5">
                    <Input
                      placeholder="Line item description (e.g. Web Development)"
                      value={item.description}
                      onChange={(e) =>
                        handleFieldChange(idx, "description", e.target.value)
                      }
                      disabled={disabled}
                      className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                    />
                    {errors[`item_${idx}_desc`] && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">
                        {errors[`item_${idx}_desc`]}
                      </p>
                    )}
                  </td>
                  <td className="p-2.5">
                    <Input
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleFieldChange(idx, "quantity", e.target.value)
                      }
                      disabled={disabled}
                      className="text-xs text-center bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                    />
                  </td>
                  <td className="p-2.5">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={item.rate}
                      onChange={(e) =>
                        handleFieldChange(idx, "rate", e.target.value)
                      }
                      disabled={disabled}
                      className="text-xs text-right bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                    />
                  </td>
                  <td className="p-2.5 text-right font-semibold text-[#212529] align-middle">
                    <CurrencyDisplay amount={amount} currency={currency} />
                  </td>
                  <td className="p-2.5 text-center align-middle">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={disabled || items.length <= 1}
                      className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden space-y-3">
        {items.map((item, idx) => {
          const qty = typeof item.quantity === "number" ? item.quantity : 0;
          const rate = typeof item.rate === "number" ? item.rate : 0;
          const amount = qty * rate;

          return (
            <div
              key={idx}
              className="p-3 border border-[#DDE2EC] rounded-md bg-white space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#666666]">Item #{idx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(idx)}
                  disabled={disabled || items.length <= 1}
                  className="h-7 w-7 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div>
                <Input
                  placeholder="Item description..."
                  value={item.description}
                  onChange={(e) =>
                    handleFieldChange(idx, "description", e.target.value)
                  }
                  disabled={disabled}
                  className="text-xs bg-white border-[#DDE2EC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#666666]">Quantity</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      handleFieldChange(idx, "quantity", e.target.value)
                    }
                    disabled={disabled}
                    className="text-xs bg-white border-[#DDE2EC]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#666666]">Rate</label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={item.rate}
                    onChange={(e) =>
                      handleFieldChange(idx, "rate", e.target.value)
                    }
                    disabled={disabled}
                    className="text-xs bg-white border-[#DDE2EC]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-[#DDE2EC]/60">
                <span className="text-[#666666] font-medium">Line Total:</span>
                <span className="font-bold text-[#212529]">
                  <CurrencyDisplay amount={amount} currency={currency} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Action Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
        disabled={disabled}
        className="text-xs border-[#DDE2EC] text-[#017E84] hover:bg-teal-50 hover:text-[#01686D] font-medium"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Line Item
      </Button>
    </div>
  );
};
