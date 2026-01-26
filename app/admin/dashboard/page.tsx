import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function DashboardPage() {
  const isAuthenticated = await getSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
