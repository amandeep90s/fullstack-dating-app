// Environment variable validation
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// Validate required environment variables
function validateConfig() {
  const missingVars = [];

  if (!config.supabaseUrl) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!config.supabaseAnonKey) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file."
    );
  }
}

// Validate on import (client-side only)
if (typeof window !== "undefined") {
  validateConfig();
}

export { validateConfig };
