"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { api } from "@/utils/api";
import { GetPollsResponse } from "@/types/poll";
import { Vote, Users, Calendar, CheckCircle } from "lucide-react";

interface VoteClientProps {
  poll: GetPollsResponse;
}

export default function VoteClient({ poll }: VoteClientProps) {
  const user = useAuthGuard();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voted, setVoted] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getTotalVotes = () => {
    return poll.poll_options.reduce(
      (total, option) => total + option.vote_count,
      0
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVote = async () => {
    if (selectedOption === null) {
      setError("Please select an option to vote");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.votes.castVote({
        poll_id: poll.id,
        option_id: selectedOption,
        user_id: user.id,
      });

      if (response.success) {
        setVoted(true);
        setError("");
      } else {
        setError(response.message || "Failed to cast vote");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (voted) {
    return (
      <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vote Cast Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for participating in this poll.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push(`/polls/${poll.id}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Results
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-gray-600 mb-4">{poll.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {getTotalVotes()} votes
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(poll.created_at)}
            </span>
            <span>{poll.poll_options.length} options</span>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {poll.poll_options.map((option) => (
              <div
                key={option.id}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <input
                  type="radio"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label className="ml-3 flex-1 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">
                    {option.option_text}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {option.vote_count} votes
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleVote}
              disabled={loading || selectedOption === null}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Vote className="h-4 w-4 mr-2" />
              {loading ? "Casting Vote..." : "Cast Vote"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
