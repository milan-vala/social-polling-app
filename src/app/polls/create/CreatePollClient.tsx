"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { authUtils } from "@/utils/auth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Plus, X, Save } from "lucide-react";

export default function CreatePollClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const user = useAuthGuard();

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim()) {
      setError("Poll title is required");
      setLoading(false);
      return;
    }

    const validOptions = options.filter((option) => option.trim());
    if (validOptions.length < 2) {
      setError("At least 2 options are required");
      setLoading(false);
      return;
    }

    const currentUser = authUtils.getUser();
    if (!currentUser) {
      setError("You must be logged in to create a poll");
      setLoading(false);
      return;
    }

    try {
      const response = await api.polls.createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions,
        user_id: currentUser.id,
      });

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Failed to create poll");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Poll Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What's your favorite programming language?"
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-500">
            {title.length}/200 characters
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Provide more context about your poll..."
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {description.length}/500 characters
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options *
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Add at least 2 options for your poll
          </p>

          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                {index + 1}
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Option ${index + 1}`}
                maxLength={100}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-3 p-1 text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Poll"}
          </button>
        </div>
      </form>
    </main>
  );
}
