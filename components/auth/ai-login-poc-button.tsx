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

interface AiLoginPocButtonProps {
  countryCode: string;
  socialProviders: string[];
  onReorder: (sortedMethods: string[], sortedSocials: string[]) => void;
}

export function AiLoginPocButton({
  countryCode,
  socialProviders,
  onReorder,
}: AiLoginPocButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const socialProvidersParam = socialProviders.join(",");
      const apiUrl = `https://jrulttak6c.execute-api.eu-central-1.amazonaws.com/default/api-ciam/v1/login?countryCode=${countryCode}&loginMethods=sociallogins,standard,onetimepassword&socialProviders=${socialProvidersParam}`;

      const response = await fetch(apiUrl);
      const data: LoginApiResponse = await response.json();

      if (data.statusCode === 200 && data.body.status === "success") {
        let { sortedMethods, sortedSocials } = data.body.result;

        // Germany-specific hardcoded sorting
        if (countryCode === "DE") {
          // Force sociallogins to be first
          sortedMethods = ["sociallogins", ...sortedMethods.filter(m => m !== "sociallogins")];

          // Force doccheck to be first in social providers, keep the rest as returned
          sortedSocials = ["doccheck", ...sortedSocials.filter(s => s !== "doccheck")];
        }

        // Close modal first
        setIsOpen(false);

        // Wait 500ms before reordering for smooth transition
        setTimeout(() => {
          onReorder(sortedMethods, sortedSocials);
        }, 500);
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
              Based on your location ({countryCode}), I can recommend the most
              commonly used login methods to make signing in easier.
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
