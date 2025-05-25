import Header from "@/components/header";
import ResultsClient from "./ResultsClient";
import { getApiUrl } from "@/utils/url";

async function getPoll(pollId: string) {
  try {
    const res = await fetch(getApiUrl(`/api/polls/${pollId}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching poll:", error);
    return null;
  }
}

export default async function PollResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Poll Not Found" showCreateButton={true} />
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Poll Not Found
          </h2>
          <p className="text-gray-600">
            The poll you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Poll Results" showCreateButton={true} />
      <ResultsClient poll={poll} />
    </div>
  );
}
