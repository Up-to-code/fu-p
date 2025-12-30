import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    hasCheckedSession,
    login,
    signup,
    logout,
    checkSession,
  } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only check session once on mount if not already checked
    if (!hasInitialized.current && !hasCheckedSession) {
      hasInitialized.current = true;
      checkSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedSession]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkSession,
  };
}

