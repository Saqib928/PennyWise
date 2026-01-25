import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import type { AppUser } from "../types/user.types";
import { AuthService } from "../services/auth.service";

// Export the interface so it can be used in other files if needed
export interface AuthContextType {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

// FIX: Cast initial value to AuthContextType to remove '| undefined' from the type
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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
          // Adjust based on your actual API response structure
          const userData = response.data.user || response.data.user; 
          
          if (userData) {
            const appUser: AppUser = {
              id: userData._id || userData._id,
              username: userData.username,
              name: userData.name,
              email: userData.email,
              country: userData.country,
            };
            setUser(appUser);
            localStorage.setItem("user", JSON.stringify(appUser));
          }
        }
      } catch (err) {
        console.log("User not authenticated");
        localStorage.removeItem("user");
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

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}