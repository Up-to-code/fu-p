import { create } from "zustand";
import { authClient } from "@/lib/auth/client";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
  organizationId?: string;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCheckedSession: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

let checkSessionPromise: Promise<void> | null = null;
let isInitialized = false;

// Initialize session check once globally
if (typeof window !== "undefined" && !isInitialized) {
  isInitialized = true;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  hasCheckedSession: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setSession: (session) =>
    set({ session, isAuthenticated: !!session }),

  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.data?.user) {
        // After login, check session to get full session data
        const sessionData = await authClient.getSession();
        set({
          user: {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            image: result.data.user.image || undefined,
            role: (result.data.user as any).role,
            organizationId: (result.data.user as any).organizationId,
          },
          session: sessionData.data?.session || null,
          isAuthenticated: true,
          isLoading: false,
          hasCheckedSession: true,
        });
      } else {
        throw new Error(result.error?.message || "Login failed");
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email, password, name) => {
    try {
      set({ isLoading: true });
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.data?.user) {
        // After signup, check session to get full session data
        const sessionData = await authClient.getSession();
        set({
          user: {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            image: result.data.user.image || undefined,
            role: (result.data.user as any).role,
            organizationId: (result.data.user as any).organizationId,
          },
          session: sessionData.data?.session || null,
          isAuthenticated: true,
          isLoading: false,
          hasCheckedSession: true,
        });
      } else {
        throw new Error(result.error?.message || "Signup failed");
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authClient.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedSession: false,
      });
      checkSessionPromise = null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  checkSession: async () => {
    const state = get();
    
    // If we've already checked and have a session, don't check again
    if (state.hasCheckedSession && state.isAuthenticated) {
      return;
    }

    // Prevent multiple simultaneous session checks
    if (checkSessionPromise) {
      return checkSessionPromise;
    }

    checkSessionPromise = (async () => {
      try {
        // Only set loading if we haven't checked yet
        if (!state.hasCheckedSession) {
          set({ isLoading: true });
        }
        
        const { data } = await authClient.getSession();
        
        if (data?.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              image: data.user.image || undefined,
              role: (data.user as any).role,
              organizationId: (data.user as any).organizationId,
            },
            session: data.session || null,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedSession: true,
          });
        } else {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            hasCheckedSession: true,
          });
        }
      } catch {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          hasCheckedSession: true,
        });
      } finally {
        checkSessionPromise = null;
      }
    })();

    return checkSessionPromise;
  },
}));

