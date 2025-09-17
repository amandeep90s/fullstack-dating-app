"use client";

import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/utils/helpers";
import Link from "next/link";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav
      className={cn(
        "relative z-50 bg-slate-900 border-b border-gray-200/50 dark:border-gray-700/50"
      )}
    >
      <div className={cn("container mx-auto px-6")}>
        <div className={cn("flex items-center justify-between h-16")}>
          <Link href="/" className={cn("flex items-center space-x-3")}>
            <span
              className={cn(
                "text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700",
                "dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
              )}
            >
              StreamMatch
            </span>
          </Link>

          {/* Only show navigation is user is authenticated */}
          {user && (
            <div className={cn("hidden md:flex items-center space-x-8")}>
              <Link
                href="/matches"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-pink-600",
                  "dark:hover:text-pink-400 font-medium transition-colors duration-200"
                )}
              >
                Discover
              </Link>
              <Link
                href="/matches/list"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-pink-600",
                  "dark:hover:text-pink-400 font-medium transition-colors duration-200"
                )}
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-pink-600",
                  "dark:hover:text-pink-400 font-medium transition-colors duration-200"
                )}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-pink-600",
                  "dark:hover:text-pink-400 font-medium transition-colors duration-200"
                )}
              >
                Profile
              </Link>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={signOut}
              className={cn(
                "px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium cursor-pointer rounded-lg",
                "hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
              )}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className={cn(
                "px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium cursor-pointer rounded-lg",
                "hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
