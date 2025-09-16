import { cn } from "@/utils/helpers";

interface FullPageLoaderProps {
  text?: string;
}

export function FullPageLoader({ text = "Loading..." }: FullPageLoaderProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900",
        "dark:to-gray-800 flex items-center justify-center"
      )}
    >
      <div className={cn("text-center")}>
        <div
          className={cn(
            "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"
          )}
        ></div>
        <p className={cn("mt-4 text-gray-600 dark:text-gray-400")}>{text}</p>
      </div>
    </div>
  );
}
