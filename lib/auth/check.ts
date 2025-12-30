import { cookies } from "next/headers";

/**
 * Check if user is authenticated by verifying session token
 * @returns true if authenticated, false otherwise
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");
    return !!sessionToken;
  } catch (error) {
    return false;
  }
}

/**
 * Get the session token from cookies
 * @returns session token string or null
 */
export async function getSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");
    return sessionToken?.value || null;
  } catch (error) {
    return null;
  }
}

