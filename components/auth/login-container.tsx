"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { AiLoginButton } from "@/components/auth/ai-login-button";

// Extend Window interface for Gigya
declare global {
  interface Window {
    gigya?: {
      accounts: {
        showScreenSet: (params: {
          screenSet: string;
          startScreen: string;
          containerID: string;
        }) => void;
        session: {
          verify: (params: {
            callback: (event: { errorCode: number }) => void;
          }) => void;
        };
        addEventHandlers: (handlers: { onLogin: () => void }) => void;
      };
    };
    onGigyaServiceReady?: () => void;
    onAfterScreenLoadPlatform?: (event: { currentScreen: string }) => void;
  }
}

const config = {
  homeUrl: typeof window !== "undefined" ? window.location.origin : "/",
};

export function LoginContainer() {
  const [showGigya, setShowGigya] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const initRef = useRef(false);

  const showLoginScreen = () => {
    setShowGigya(true);

    if (window.gigya) {
      window.gigya.accounts.showScreenSet({
        screenSet: "Default-RegistrationLogin",
        startScreen: "cindi-social-login-screen",
        containerID: "gigya-container",
      });
    }
  };

  const handleLoginSuccess = () => {
    setShowLoader(true);
    window.location.href = config.homeUrl;
  };

  const checkLoginStatus = () => {
    if (window.gigya) {
      window.gigya.accounts.session.verify({
        callback: (event: { errorCode: number }) => {
          if (event.errorCode !== 0) {
            showLoginScreen();
          } else {
            window.location.href = config.homeUrl;
          }
        },
      });
    }
  };

  const initGigya = () => {
    if (initRef.current) return;
    initRef.current = true;

    setShowGigya(false);
    setShowLoader(true);

    if (window.gigya) {
      window.gigya.accounts.addEventHandlers({
        onLogin: handleLoginSuccess,
      });
      checkLoginStatus();
    } else {
      console.error("Gigya is not loaded in initGigya");
    }
  };

  useEffect(() => {
    // Set up the onAfterScreenLoadPlatform callback
    window.onAfterScreenLoadPlatform = (event) => {
      if (event.currentScreen === "cindi-social-login-screen") {
        setShowLoader(false);
        // Show AI help button after 3 seconds
        setTimeout(() => {
          setShowAiHelp(true);
        }, 3000);
      }
    };

    // Use the recommended onGigyaServiceReady callback
    window.onGigyaServiceReady = () => {
      initGigya();
    };

    // If Gigya is already loaded, call init immediately
    if (window.gigya) {
      initGigya();
    }

    return () => {
      // Cleanup
      window.onGigyaServiceReady = undefined;
      window.onAfterScreenLoadPlatform = undefined;
    };
  }, []);

  return (
    <section className="py-12 relative min-h-[400px]">
      <Loader isVisible={showLoader} />

      <div
        id="gigya-container"
        className={`max-w-[1180px] mx-auto px-6 ${showGigya ? "" : "hidden"}`}
      />

      {showAiHelp && <AiLoginButton />}
    </section>
  );
}
