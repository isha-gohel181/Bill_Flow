"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";

interface AppShellProps {
  children: React.ReactNode;
  user?: { name?: string; email?: string } | null;
  onLogout?: () => void;
  title?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  user,
  onLogout,
  title,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FBFD] text-[#212529] flex">
      {/* Desktop Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          user={user}
          onLogout={onLogout}
          title={title}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
