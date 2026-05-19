/**
 * Single source of truth for runtime environment values.
 *
 * IMPORTANT — there must be no other place in the codebase that hardcodes
 * "http://localhost:5000" or any other backend URL. All network code must
 * import {@link apiBaseUrl} from here so it can be overridden by setting
 * `NEXT_PUBLIC_API_URL` in the environment (Vercel, Docker, .env.local, …).
 */

const DEV_FALLBACK_API_URL = "http://localhost:5000";

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  // In production we should never silently fall back to localhost — that
  // almost always indicates a misconfigured deployment. Surface a clear
  // warning so it shows up in Vercel build logs / browser console.
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "[env] NEXT_PUBLIC_API_URL is not set. Falling back to " +
        `${DEV_FALLBACK_API_URL}, which will not work in production. ` +
        "Set NEXT_PUBLIC_API_URL on your hosting provider.",
    );
  }
  return DEV_FALLBACK_API_URL;
}

/** FastAPI backend base URL (no trailing slash). Override via NEXT_PUBLIC_API_URL. */
export const apiBaseUrl = resolveApiBaseUrl();

export const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
