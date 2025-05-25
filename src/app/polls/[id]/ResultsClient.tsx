"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GetPollsResponse } from "@/types/poll";
import {
  Users,
  Calendar,
  Vote,
  BarChart3,
  Share2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ResultsClientProps {
  poll: GetPollsResponse;
}

export default function ResultsClient({ poll }: ResultsClientProps) {
  const router = useRouter();
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [refreshing, setRefreshing] = useState(false);

  if (!poll || !poll.poll_options || !Array.isArray(poll.poll_options)) {
    return (
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Poll Data
          </h2>
          <p className="text-gray-600">This poll has no options available.</p>
        </div>
      </main>
    );
  }

  const getTotalVotes = () => {
    return poll.poll_options.reduce(
      (total, option) => total + (option.vote_count || 0),
      0
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const totalVotes = getTotalVotes();

  const chartData = poll.poll_options.map((option, index) => ({
    name: option.option_text,
    votes: option.vote_count || 0,
    percentage: getPercentage(option.vote_count || 0, totalVotes),
    fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.title,
          text: `Check out this poll: ${poll.title}`,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert("Poll link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Poll link copied to clipboard!");
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {poll.title}
              </h1>
              {poll.description && (
                <p className="text-gray-600 mb-4">{poll.description}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {formatDate(poll.created_at)}
                </span>
                <span>{poll.poll_options.length} options</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Results</h2>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  chartType === "bar"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2 inline" />
                Bar Chart
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                  chartType === "pie"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Vote className="h-4 w-4 mr-2 inline" />
                Pie Chart
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {totalVotes === 0 ? (
            <div className="text-center py-12">
              <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No votes yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to vote on this poll!
              </p>
              <button
                onClick={() => router.push(`/polls/${poll.id}/vote`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Vote className="h-4 w-4 mr-2" />
                Cast Your Vote
              </button>
            </div>
          ) : (
            <div className="h-80">
              {chartType === "bar" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${value} votes (${getPercentage(value, totalVotes)}%)`,
                        "Votes",
                      ]}
                    />
                    <Bar dataKey="votes" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${value} votes (${getPercentage(value, totalVotes)}%)`,
                        "Votes",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Detailed Results
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {poll.poll_options.map((option, index) => {
            const percentage = getPercentage(
              option.vote_count || 0,
              totalVotes
            );
            return (
              <div key={option.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {option.option_text}
                  </span>
                  <span className="text-sm text-gray-500">
                    {option.vote_count || 0} votes ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => router.push(`/polls/${poll.id}/vote`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Vote className="h-4 w-4 mr-2" />
          Vote on This Poll
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
