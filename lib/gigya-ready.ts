"use client";

type GigyaReadyCallback = () => void;

declare global {
  interface Window {
    onGigyaServiceReady?: () => void;
  }
}

const readyCallbacks = new Set<GigyaReadyCallback>();
let handlerAttached = false;

function attachReadyHandler() {
  if (handlerAttached || typeof window === "undefined") {
    return;
  }

  const existingHandler = window.onGigyaServiceReady;

  window.onGigyaServiceReady = () => {
    existingHandler?.();

    readyCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in Gigya ready callback", error);
      }
    });
  };

  handlerAttached = true;
}

export function onGigyaReady(callback: GigyaReadyCallback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  readyCallbacks.add(callback);
  attachReadyHandler();

  if (window.gigya) {
    callback();
  }

  return () => {
    readyCallbacks.delete(callback);
  };
}
