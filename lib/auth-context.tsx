"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
      };
    };
  }
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session when Gigya is ready
    const checkSession = () => {
      if (window.gigya?.accounts?.session?.verify) {
        window.gigya.accounts.session.verify({
          callback: (response: any) => {
            setIsLoggedIn(response.errorCode === 0);
            setIsLoading(false);
          },
        });
      } else {
        setIsLoading(false);
      }
    };

    // Wait for Gigya to be ready
    if (typeof window !== "undefined") {
      (window as any).onGigyaServiceReady = checkSession;

      // If Gigya is already loaded, check immediately
      if (window.gigya) {
        checkSession();
      }
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
    <AuthContext.Provider value={{ isLoggedIn, isLoading, logout }}>
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
