import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BillFlow — Modern Invoicing & Billing Software",
  description:
    "Effortless freelance and studio invoicing software. Create invoices, track income, and get paid faster.",
  icons: {
    icon: [
      { url: "/logo-v4.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/logo-v4.png",
    apple: "/logo-v4.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo-v4.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo-v4.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-v4.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
