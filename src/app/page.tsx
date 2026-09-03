import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Globe, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FBFD] text-[#212529] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#DDE2EC] bg-white sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-12 w-12 shrink-0 flex items-center justify-center">
              <img
                src="/logo-v4.png"
                alt="BillFlow Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              <span className="text-[#714B67]">Bill</span>
              <span className="text-[#017E84]">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-xs font-medium text-[#666666] hover:text-[#212529] hover:bg-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4 shadow-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-[#017E84] text-xs font-semibold uppercase tracking-wider">
            <span>Simple Invoicing for Freelancers & Studios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#212529] tracking-tight leading-tight">
            Professional Invoicing & Payment Tracking Made Simple
          </h1>

          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Create custom invoices, manage clients, track income analytics, share direct payment links, and get paid faster with BillFlow.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="bg-[#017E84] hover:bg-[#01686D] text-white px-6 h-11 text-xs font-medium shadow-xs">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-[#DDE2EC] text-[#212529] bg-white hover:bg-slate-50 h-11 px-6 text-xs font-medium">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 bg-white border-t border-[#DDE2EC] px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-[#212529]">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xs text-[#666666]">
              A complete invoicing system built for clarity, speed, and accounting compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-md bg-[#F9FBFD] border border-[#DDE2EC] space-y-3">
              <div className="h-10 w-10 rounded-md bg-teal-50 text-[#017E84] flex items-center justify-center border border-teal-100">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#212529]">Automatic Financial Calculations</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Automatic line-item totals, subtotal, tax rate calculations, and discount deductions calculated authoritatively on the backend.
              </p>
            </div>

            <div className="p-6 rounded-md bg-[#F9FBFD] border border-[#DDE2EC] space-y-3">
              <div className="h-10 w-10 rounded-md bg-purple-50 text-[#714B67] flex items-center justify-center border border-purple-100">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#212529]">Public Invoice Links & Payments</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Share direct public invoice links with clients so they can view and pay instantly without creating an account.
              </p>
            </div>

            <div className="p-6 rounded-md bg-[#F9FBFD] border border-[#DDE2EC] space-y-3">
              <div className="h-10 w-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#212529]">Real-Time Dashboard Analytics</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Track total earned income, outstanding balances, overdue items, recent invoices, and 6-month revenue charts in one view.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-12 bg-[#F9FBFD] border-t border-[#DDE2EC] px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Multi-Currency Support (INR, USD, EUR, GBP, AUD, CAD)</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Customizable Business Logo & Invoice Prefixes</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Browser Print & PDF Document Export</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Paid Invoice Protection & Dynamic Overdue Resolution</span>
          </div>
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="py-12 bg-white border-t border-[#DDE2EC] px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-[#212529]">Ready to Streamline Your Billing?</h2>
          <p className="text-xs text-[#666666]">
            Join BillFlow today and manage your clients and invoices effortlessly.
          </p>
          <Link href="/signup">
            <Button className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-6 py-2 shadow-xs">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DDE2EC] bg-[#F9FBFD] py-6 px-4 text-center text-xs text-[#666666]">
        <p>© {new Date().getFullYear()} BillFlow Invoicing System. All rights reserved.</p>
      </footer>
    </div>
  );
}
