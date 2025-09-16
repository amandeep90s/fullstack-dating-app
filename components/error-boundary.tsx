"use client";

import { cn } from "@/utils/helpers";
import React, { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Here you could send error to monitoring service like Sentry
    // trackError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
          )}
        >
          <div className={cn("max-w-md w-full text-center space-y-6 p-8")}>
            <div className={cn("text-6xl")}>😵</div>
            <div>
              <h1
                className={cn(
                  "text-2xl font-bold text-gray-900 dark:text-white mb-2"
                )}
              >
                Oops! Something went wrong
              </h1>
              <p className={cn("text-gray-600 dark:text-gray-400 mb-4")}>
                We&apos;re sorry for the inconvenience. Please try refreshing
                the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md",
                  "hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                )}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  return (error: Error) => {
    throw error;
  };
}
