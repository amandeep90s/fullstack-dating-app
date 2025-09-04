import { ErrorBoundary } from "@/components/error-boundary";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/auth-context";
import { cn } from "@/utils/helpers";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StreamMatch - Find Your Perfect Match",
  description:
    "Connect with like-minded people in your area with StreamMatch, the modern dating app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          plexSans.variable,
          plexMono.variable,
          "antialiased h-full"
        )}
      >
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <div className={cn("h-full flex flex-col")}>{children}</div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
