import React from "react";

interface CurrencyDisplayProps {
  amount: number | string;
  currency?: string;
  className?: string;
}

const currencySymbolMap: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
};

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = "INR",
  className = "",
}) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const symbol = currencySymbolMap[currency.toUpperCase()] || `${currency} `;

  const formattedNumber = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);

  return (
    <span className={`font-mono ${className}`}>
      {symbol}
      {formattedNumber}
    </span>
  );
};
