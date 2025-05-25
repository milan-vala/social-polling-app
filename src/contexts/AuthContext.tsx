"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser } from "@/types/auth";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "polling_app_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserData = (userData: AuthUser | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      console.log("Getting initial session...");

      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Found user in localStorage:", parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing stored user:", e);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("Supabase session:", session);
      console.log("Session error:", error);

      if (session?.user) {
        const authUser = {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
        };
        console.log("Setting user from Supabase session:", authUser);
        setUserData(authUser);
      } else if (!storedUser) {
        setUserData(null);
      }

      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (event === "SIGNED_IN" && session?.user) {
        const authUser = {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
        };
        console.log("User signed in, storing:", authUser);
        setUserData(authUser);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, clearing data");
        setUserData(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("Signing out...");
    await supabase.auth.signOut();
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
