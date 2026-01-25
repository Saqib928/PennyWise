import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AppUser } from "../types/user.types";
import { AuthService } from "../services/auth.service";

interface AuthContextType {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Try to get current user from API
          const response = await AuthService.me();
          if (response.data.success && response.data.data) {
            const userData = response.data.data;
            const appUser: AppUser = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              country: userData.country,
            };
            setUser(appUser);
            localStorage.setItem("user", JSON.stringify(appUser));
          }
        }
      } catch (err) {
        // User not authenticated
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
