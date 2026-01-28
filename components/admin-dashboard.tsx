"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeatingAdmin } from "@/components/admin/seating-admin";
import { RegistrationList } from "@/components/admin/registration-list";
import { AuctionAdmin } from "@/components/admin/auction-admin";
import { EventAdmin } from "@/components/admin/event-admin";
import { SheetsSync } from "@/components/admin/sheets-sync";
import { LogOut, Users, Gavel, Calendar, RefreshCw, Home } from "lucide-react";
import toast from "react-hot-toast";
import styles from '../styles/admin-dashboard.module.css';

type Tab = "seating" | "auction" | "event" | "sheets";

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("seating");

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const tabs = [
    { id: "seating" as Tab, label: "Seating", icon: Users },
    { id: "auction" as Tab, label: "Auction", icon: Gavel },
    { id: "event" as Tab, label: "Event", icon: Calendar },
    { id: "sheets" as Tab, label: "Sheets Sync", icon: RefreshCw },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20 glass-strong">
        <div className="max-w-[1800px] mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="font-playfair text-3xl font-bold text-[#D4AF37]">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className={styles.adminButtonSmall + " flex items-center px-4 py-2"} style={{ justifyContent: 'center'}}>
              <Home size={20} className="mr-1" />
            </a>
            <button onClick={handleLogout} className={styles.adminButtonSmall + " flex items-center px-4 py-2"} style={{justifyContent: 'center'}}>
              <LogOut size={16} className="mr-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-[#1a1a1a]"
                    : "glass text-[#f5f5f5]/80 hover:text-[#D4AF37]"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "seating" && (
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full lg:w-2/3">
                <SeatingAdmin />
              </div>
              <div className="w-full lg:w-1/3">
                <RegistrationList />
              </div>
            </div>
          )}
          {activeTab === "auction" && <AuctionAdmin />}
          {activeTab === "event" && <EventAdmin />}
          {activeTab === "sheets" && <SheetsSync />}
        </motion.div>
      </div>
    </main>
  );
}
