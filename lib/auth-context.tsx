"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onGigyaReady } from "@/lib/gigya-ready";

// Extend Window interface for Gigya
declare global {
  interface Window {
    gigya?: {
      accounts: {
        login: (params: {
          loginID: string;
          password: string;
          callback: (response: any) => void;
        }) => void;
        session: {
          verify: (params: { callback: (response: any) => void }) => void;
        };
        logout: (params: { callback: (response: any) => void }) => void;
        getAccountInfo: (params: {
          include?: string;
          callback: (response: any) => void;
        }) => void;
      };
    };
  }
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check session when Gigya is ready
    const checkSession = () => {
      if (window.gigya?.accounts?.session?.verify) {
        window.gigya.accounts.session.verify({
          callback: (response: any) => {
            const loggedIn = response.errorCode === 0;
            setIsLoggedIn(loggedIn);

            // If logged in, fetch user profile
            if (loggedIn && window.gigya?.accounts?.getAccountInfo) {
              window.gigya.accounts.getAccountInfo({
                include: "profile",
                callback: (accountResponse: any) => {
                  if (accountResponse.errorCode === 0 && accountResponse.profile) {
                    setUserProfile({
                      firstName: accountResponse.profile.firstName,
                      lastName: accountResponse.profile.lastName,
                    });
                  }
                  setIsLoading(false);
                },
              });
            } else {
              setIsLoading(false);
            }
          },
        });
      } else {
        setIsLoading(false);
      }
    };

    // Wait for Gigya to be ready
    if (typeof window !== "undefined") {
      const cleanup = onGigyaReady(checkSession);

      return () => {
        cleanup();
      };
    }
  }, []);

  const logout = () => {
    if (window.gigya?.accounts?.logout) {
      window.gigya.accounts.logout({
        callback: () => {
          window.location.reload();
        },
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, userProfile, logout }}>
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
