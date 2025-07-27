import { User } from "@shared/schema";

const AUTH_STORAGE_KEY = "street_market_auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const authStorage = {
  get(): AuthState {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        return { user, isAuthenticated: true };
      }
    } catch (error) {
      console.error("Failed to parse auth state:", error);
    }
    return { user: null, isAuthenticated: false };
  },

  set(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};

export function useAuth() {
  const authState = authStorage.get();
  
  const login = (user: User) => {
    authStorage.set(user);
    window.location.href = getDashboardPath(user.role);
  };

  const logout = () => {
    authStorage.clear();
    window.location.href = "/";
  };

  return { ...authState, login, logout };
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "vendor":
      return "/vendor/dashboard";
    case "supplier":
      return "/supplier/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export function requireAuth(allowedRoles?: string[]): User | null {
  const { user, isAuthenticated } = authStorage.get();
  
  if (!isAuthenticated || !user) {
    window.location.href = "/";
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = "/";
    return null;
  }

  return user;
}
