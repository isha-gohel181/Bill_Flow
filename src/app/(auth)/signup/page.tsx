"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.signup({ name, email, password });

      if (!res.success) {
        setError(res.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Automatically sign in user after successful signup
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFD] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <Card className="border-[#DDE2EC] bg-white text-[#212529] shadow-xs">
          <CardHeader className="text-center pt-6 pb-2 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/logo-v4.png"
                alt="BillFlow Logo"
                className="h-14 w-14 object-contain"
              />
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-[#714B67]">Bill</span>
                <span className="text-[#017E84]">Flow</span>
              </span>
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#212529]">Get Started with BillFlow</CardTitle>
              <CardDescription className="text-xs text-[#666666] mt-0.5">
                Start creating professional invoices in minutes
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-[#212529]">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Isha Gohel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#212529]">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-[#212529]">
                  Password <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#017E84] hover:bg-[#01686D] text-white font-medium text-xs h-10 mt-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-[#666666]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#017E84] hover:underline font-semibold">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
