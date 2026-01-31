
import React, { useState } from "react";
import { User, Clock } from "lucide-react";
import { AdminAccounts } from "./admin-accounts";

export function SettingsAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<"account" | "future">("account");

  return (
    <div className="">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${activeSubTab === "account" ? "bg-[#D4AF37] text-[#1a1a1a]" : "bg-gray-800 text-[#f5f5f5]/80 hover:text-[#D4AF37]"}`}
          onClick={() => setActiveSubTab("account")}
        >
          <User size={18} />
          <span className="hidden sm:inline">Account</span>
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${activeSubTab === "future" ? "bg-[#D4AF37] text-[#1a1a1a]" : "bg-gray-800 text-[#f5f5f5]/80 hover:text-[#D4AF37]"}`}
          onClick={() => setActiveSubTab("future")}
        >
          <Clock size={18} />
          <span className="hidden sm:inline">Future</span>
        </button>
      </div>
      {activeSubTab === "account" && <AdminAccounts />}
      {activeSubTab === "future" && (
        <div>
          <h2 className="text-xl font-bold mb-2 text-[#D4AF37]">Future Features</h2>
          <p className="text-[#f5f5f5]/80">This section is reserved for future settings and features.</p>
        </div>
      )}
    </div>
  );
}

