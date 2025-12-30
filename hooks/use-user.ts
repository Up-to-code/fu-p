import { useAuthStore } from "@/store/auth-store";

export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}


