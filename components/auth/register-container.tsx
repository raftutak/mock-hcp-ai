"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { AiHelpButton } from "@/components/auth/ai-help-button";

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

export function RegisterContainer() {
  const [showGigya, setShowGigya] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const initRef = useRef(false);

  const showRegistrationScreen = () => {
    setShowGigya(true);

    if (window.gigya) {
      window.gigya.accounts.showScreenSet({
        screenSet: "Default-RegistrationLogin",
        startScreen: "cindi-registration-screen",
        containerID: "gigya-register-container",
      });
    }
  };

  const handleRegistrationSuccess = () => {
    setShowLoader(true);
    window.location.href = config.homeUrl;
  };

  const checkLoginStatus = () => {
    if (window.gigya) {
      window.gigya.accounts.session.verify({
        callback: (event: { errorCode: number }) => {
          if (event.errorCode !== 0) {
            showRegistrationScreen();
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
        onLogin: handleRegistrationSuccess,
      });
      checkLoginStatus();
    } else {
      console.error("Gigya is not loaded in initGigya");
    }
  };

  useEffect(() => {
    // Set up the onAfterScreenLoadPlatform callback
    window.onAfterScreenLoadPlatform = (event) => {
      if (event.currentScreen === "cindi-registration-screen") {
        setShowLoader(false);
      }
      // Show AI help button only on the second registration screen
      if (event.currentScreen === "cindi-registration-screen2") {
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
        id="gigya-register-container"
        className={`max-w-[1180px] mx-auto px-6 ${showGigya ? "" : "hidden"}`}
      />

      {showAiHelp && <AiHelpButton />}
    </section>
  );
}
