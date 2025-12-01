"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Extend Window interface for cindi
declare global {
  interface Window {
    cindi?: {
      user?: {
        countryCode?: string;
        enabledProviders?: string;
      };
    };
  }
}

interface LoginApiResponse {
  statusCode: number;
  body: {
    status: string;
    result: {
      sortedSocials: string[];
      sortedMethods: string[];
    };
    providers_used: string[];
    logins_used: string[];
    providers_removed: string[];
    logins_removed: string[];
  };
}

export function AiLoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const countryCode = window.cindi?.user?.countryCode || "US";
      const enabledProviders = window.cindi?.user?.enabledProviders || "";
      const apiUrl = `https://jrulttak6c.execute-api.eu-central-1.amazonaws.com/default/api-ciam/v1/login?countryCode=${countryCode}&loginMethods=sociallogins,standard,onetimepassword&socialProviders=${enabledProviders}`;

      const response = await fetch(apiUrl);
      const data: LoginApiResponse = await response.json();

      if (data.statusCode === 200 && data.body.status === "success") {
        const { sortedSocials } = data.body.result;

        // Close modal first
        setIsOpen(false);

        // Wait 1 second before sorting
        setTimeout(() => {
          const providerRow = document.querySelector(
            ".gigya-login-provider-row"
          );

          if (providerRow && sortedSocials.length > 0) {
            // Get all provider elements
            const providers = Array.from(
              providerRow.querySelectorAll("[data-gigya-provider]")
            ).map((el) => ({
              element: el as HTMLElement,
              provider: el.getAttribute("data-gigya-provider") || "",
            }));

            // Create a map for current positions
            const providerMap = new Map(
              providers.map((p) => [p.provider, p.element])
            );

            // Sort according to sortedSocials
            const sortedElements = sortedSocials
              .map((provider) => providerMap.get(provider))
              .filter((el) => el !== undefined) as HTMLElement[];

            // Add remaining elements that weren't in sortedSocials
            providers.forEach((p) => {
              if (!sortedSocials.includes(p.provider)) {
                sortedElements.push(p.element);
              }
            });

            // FLIP animation: First - capture initial positions
            const initialPositions = new Map();
            sortedElements.forEach((element) => {
              const rect = element.getBoundingClientRect();
              initialPositions.set(element, rect);
            });

            // Last - reorder in DOM
            const fragment = document.createDocumentFragment();
            sortedElements.forEach((element) =>
              fragment.appendChild(element)
            );
            providerRow.appendChild(fragment);

            // Force a reflow after DOM change
            void (providerRow as HTMLElement).offsetHeight;

            // Invert & Play
            requestAnimationFrame(() => {
              sortedElements.forEach((element) => {
                const first = initialPositions.get(element);
                const last = element.getBoundingClientRect();

                if (!first || !last) return;

                const deltaX = first.left - last.left;
                const deltaY = first.top - last.top;

                if (deltaX === 0 && deltaY === 0) return;

                // Invert: set initial transform without transition
                element.style.setProperty("transform", `translate(${deltaX}px, ${deltaY}px)`);
                element.style.setProperty("transition", "none");

                // Force reflow
                void element.offsetHeight;

                // Play: animate to final position
                requestAnimationFrame(() => {
                  element.style.setProperty(
                    "transition",
                    "transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1)"
                  );
                  element.style.setProperty("transform", "translate(0, 0)");

                  const cleanup = () => {
                    element.style.removeProperty("transition");
                    element.style.removeProperty("transform");
                    element.removeEventListener("transitionend", cleanup);
                  };

                  element.addEventListener("transitionend", cleanup);
                });
              });

              // Add blinking animation to the first provider
              if (sortedElements[0]) {
                sortedElements[0].classList.add("gigya-dropdown-highlight");
                setTimeout(() => {
                  sortedElements[0]?.classList.remove(
                    "gigya-dropdown-highlight"
                  );
                }, 5000);
              }
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching login suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-[#002e6d] hover:bg-[#002e6d]/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-50 animate-in fade-in duration-500"
              aria-label="AI Help"
            >
              <Bot className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white">
            <p>Need some help from AI?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <DialogDescription>
              Would you like a suggestion for the most popular login method for
              your country?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Based on your location, I can recommend the most commonly used
              login methods to make signing in easier.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-none"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#002e6d] hover:bg-[#002e6d]/90 rounded-none"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Yes, help me"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
