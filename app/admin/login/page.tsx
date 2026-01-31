"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Lock, Mail, Home, Shield } from "lucide-react";


export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      let local = false;
      if (typeof window !== "undefined" && localStorage.getItem("adminauth") === "true") {
        local = true;
      }
      // Check server session
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsSignedIn(local && data.authenticated === true);
      setCheckingSession(false);
    }
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Set adminauth in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("adminauth", "true");
        }
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="glass-strong p-8">
          {!isSignedIn && (
            <>
              <h1 className="font-playfair text-4xl font-bold text-[#D4AF37] mb-2 text-center">
                Admin Portal
              </h1>
              <p className="text-center text-[#f5f5f5]/60 mb-8">
                Sign in to manage the gala
              </p>
            </>
          )}

          {isSignedIn ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Shield size={64} className="mb-4" color="#D4AF37" fill="#D4AF37" />
              <div className="text-center text-lg font-semibold text-[#D4AF37] mb-6">
                You are signed in as admin.
              </div>
              <Button
                type="button"
                className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#bfa134] font-semibold px-6 py-2 rounded-lg shadow"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("adminauth");
                    setIsSignedIn(false);
                  }
                }}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f5f5f5]/40" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="gala@teachfornepal.org"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f5f5f5]/40" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f5f5f5]/60 hover:text-[#D4AF37] focus:outline-none"
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 002.121-5.121m-3.644.598A3 3 0 0112 9a3 3 0 013 3c0 .795-.312 1.518-.818 2.05M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.2-.9M3.6 7.2A9.77 9.77 0 003 12c0 4.418 4.03 8 9 8 1.61 0 3.13-.38 4.4-1.06" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          )}
        </Card>      
            
        {/* Home Button below the form */}
        <div className="flex justify-center mt-8">
          <a
            href="/"
            className="flex items-center gap-2 bg-white/90 text-gray-900 hover:bg-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#bfa134] transition-colors"
            style={{ textDecoration: 'none', letterSpacing: 0.5 }}
          >
            <Home size={20} />
            Home
          </a>
        </div>
      </motion.div>
    </main>
  );
}
