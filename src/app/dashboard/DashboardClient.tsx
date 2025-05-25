"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { GetPollsResponse } from "@/types/poll";
import { Plus, Vote, Users, Calendar, BarChart3 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRealtimePolls } from "@/hooks/useRealtimePolls";

interface DashboardClientProps {
  initialPolls?: GetPollsResponse[];
}

export default function DashboardClient({
  initialPolls = [],
}: DashboardClientProps) {
  const polls = useRealtimePolls(initialPolls);
  const [error, setError] = useState("");
  const user = useAuthGuard();

  const refreshPolls = async () => {
    try {
      const response = await api.polls.getPolls();
      if (response.success && response.data) {
        window.location.reload();
      } else {
        setError(response.message || "Failed to refresh polls");
      }
    } catch (err) {
      setError("Something went wrong while refreshing polls");
    }
  };

  const getTotalVotes = (poll: GetPollsResponse) => {
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

  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Vote className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Polls</p>
              <p className="text-2xl font-bold text-gray-900">{polls.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">
                {polls.reduce((total, poll) => total + getTotalVotes(poll), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-gray-900">{polls.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Polls</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
            <button
              onClick={refreshPolls}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No polls yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first poll to get started
            </p>
            <Link
              href="/polls/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Poll
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {polls.map((poll) => (
              <div key={poll.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 leading-tight">
                      {poll.title}
                    </h4>
                    {poll.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {poll.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                      {getTotalVotes(poll)}{" "}
                      {getTotalVotes(poll) === 1 ? "vote" : "votes"}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      {formatDate(poll.created_at)}
                    </span>
                    <span className="flex items-center">
                      <Vote className="h-4 w-4 mr-1 flex-shrink-0" />
                      {poll.poll_options.length} options
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <Link
                      href={`/polls/${poll.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Results
                    </Link>
                    <Link
                      href={`/polls/${poll.id}/vote`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      Vote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
