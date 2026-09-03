import React from "react";

interface DateDisplayProps {
  date: string | Date;
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  className = "",
}) => {
  if (!date) return <span className={className}>-</span>;

  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className={className}>-</span>;

  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);

  return <span className={`text-slate-600 dark:text-slate-400 ${className}`}>{formatted}</span>;
};
