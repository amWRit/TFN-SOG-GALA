"use client";

import { SeatingAdmin } from "@/components/admin/seating-admin";
import { RegistrationList } from "@/components/admin/registration-list";

export default function AdminSeatingPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-8 bg-gray-900 text-white p-4">
      <div className="flex-1">
        <SeatingAdmin />
      </div>
      <div className="flex-1">
        <RegistrationList />
      </div>
    </div>
  );
}
