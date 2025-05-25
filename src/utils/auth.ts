import { AuthUser } from "@/types/auth";

const USER_STORAGE_KEY = "polling_app_user";

export const authUtils = {
  setUser: (user: AuthUser) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  getUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  isLoggedIn: (): boolean => {
    return !!authUtils.getUser();
  },
};
