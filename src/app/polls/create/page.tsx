import Header from "@/components/header";
import CreatePollClient from "./CreatePollClient";

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Create New Poll"
        subtitle="Build a poll and collect responses from your audience"
        showCreateButton={false}
      />
      <CreatePollClient />
    </div>
  );
}
