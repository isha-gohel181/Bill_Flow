import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ClientAvatarProps {
  name: string;
  className?: string;
}

export const ClientAvatar: React.FC<ClientAvatarProps> = ({
  name,
  className = "",
}) => {
  const getInitials = (n: string) => {
    if (!n) return "CL";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={`h-8 w-8 border border-slate-200 dark:border-slate-800 ${className}`}>
      <AvatarFallback className="bg-teal-50 text-[#017E84] dark:bg-teal-950 dark:text-teal-300 font-semibold text-xs">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
