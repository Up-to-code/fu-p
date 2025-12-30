import { useAuthStore } from "@/store/auth-store";

export function useSession() {
  const { session, isLoading, isAuthenticated } = useAuthStore();

  return {
    session,
    isLoading,
    isAuthenticated,
  };
}


