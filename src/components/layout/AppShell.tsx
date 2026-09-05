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
    <div className="min-h-screen bg-[#F9FBFD] text-[#212529] flex relative overflow-x-hidden">
      {/* Subtle Ambient Dashboard Background Watermark B1.png */}
      <div className="fixed right-[-60px] bottom-[-60px] w-96 h-96 opacity-[0.07] pointer-events-none z-0 select-none overflow-hidden hidden sm:block">
        <img src="/B1.png" alt="" className="w-full h-full object-contain" />
      </div>

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
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 z-10 relative">
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
};
