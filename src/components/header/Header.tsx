"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Home, LogOut } from "lucide-react";
import { IHeader } from "./IHeader";
import { authUtils } from "@/utils/auth";

export default function Header({
  title,
  subtitle,
  showCreateButton = true,
}: IHeader) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      authUtils.removeUser();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6">
          <div className="flex-1 mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="h-4 w-4 mr-2 sm:mr-1" />
              <span className="sm:hidden">Dashboard</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {showCreateButton && (
              <Link
                href="/polls/create"
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Poll</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
