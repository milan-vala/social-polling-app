import Header from "@/components/header";
import DashboardClient from "./DashboardClient";
import { getApiUrl } from "@/utils/url";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPolls() {
  try {
    const res = await fetch(getApiUrl("/api/polls"), {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching polls on server:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const initialPolls = await getPolls();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        subtitle="Manage your polls and view results"
        showCreateButton={true}
      />
      <DashboardClient initialPolls={initialPolls} />
    </div>
  );
}
