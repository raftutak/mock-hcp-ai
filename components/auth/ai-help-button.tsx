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
import { Textarea } from "@/components/ui/textarea";

// Extend Window interface for cindi
declare global {
  interface Window {
    cindi?: {
      user?: {
        countryCode?: string;
      };
      formElements?: {
        c_profession?: {
          professionTypeDescription?: HTMLSelectElement;
          specialtyDescription?: HTMLSelectElement;
        };
        c_affiliation?: {
          jobRoleDescription?: HTMLSelectElement;
        };
      };
    };
  }
}

interface ProfessionResult {
  contactTypeCode: string;
  contactTypeDescription: string;
  contactSubTypeCode: string;
  contactSubTypeDescription: string;
}

interface ApiResponse {
  statusCode: number;
  body: {
    status: string;
    result: {
      profession: ProfessionResult[];
      specialty: Array<{
        specialtyCode: string;
        specialtyDescription: string;
      }>;
      jobRole: Array<{
        jobRoleCode: string;
        jobRoleDescription: string;
      }>;
    };
  };
}

export function AiHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [profession, setProfession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfessionData, setHasProfessionData] = useState(false);
  const [showAoiPrompt, setShowAoiPrompt] = useState(false);
  const [showProfessionInput, setShowProfessionInput] = useState(true);

  const handleSubmitProfession = async () => {
    if (!profession.trim()) return;

    setIsLoading(true);

    try {
      const countryCode = window.cindi?.user?.countryCode || "US";
      const encodedText = encodeURIComponent(profession);
      const apiUrl = `https://jrulttak6c.execute-api.eu-central-1.amazonaws.com/default/api-ciam/v1/customerProfessional?countryCode=${countryCode}&lang=en&text=${encodedText}`;

      const response = await fetch(apiUrl);
      const data: ApiResponse = await response.json();

      if (data.statusCode === 200 && data.body.status === "success") {
        const dropdownsToHighlight: HTMLSelectElement[] = [];

        // Handle profession
        if (data.body.result.profession.length > 0) {
          const professionData = data.body.result.profession[0];
          const professionDropdown =
            window.cindi?.formElements?.c_profession?.professionTypeDescription;

          if (professionDropdown) {
            const options = Array.from(professionDropdown.options);
            const matchingOption = options.find(
              (option) =>
                option.getAttribute("subtypedescription") ===
                professionData.contactSubTypeDescription
            );

            if (matchingOption) {
              professionDropdown.value = matchingOption.value;
              const event = new Event("change", { bubbles: true });
              professionDropdown.dispatchEvent(event);
              dropdownsToHighlight.push(professionDropdown);
            }
          }
        }

        // Handle specialty
        if (data.body.result.specialty.length > 0) {
          const specialtyData = data.body.result.specialty[0];
          const specialtyDropdown =
            window.cindi?.formElements?.c_profession?.specialtyDescription;

          if (specialtyDropdown) {
            const options = Array.from(specialtyDropdown.options);
            const matchingOption = options.find(
              (option) =>
                option.getAttribute("specialtycode") ===
                specialtyData.specialtyCode
            );

            if (matchingOption) {
              specialtyDropdown.value = matchingOption.value;
              const event = new Event("change", { bubbles: true });
              specialtyDropdown.dispatchEvent(event);
              dropdownsToHighlight.push(specialtyDropdown);
            }
          }
        }

        // Handle job role
        if (data.body.result.jobRole.length > 0) {
          const jobRoleData = data.body.result.jobRole[0];
          const jobRoleDropdown =
            window.cindi?.formElements?.c_affiliation?.jobRoleDescription;

          if (jobRoleDropdown) {
            const options = Array.from(jobRoleDropdown.options);
            const matchingOption = options.find(
              (option) =>
                option.getAttribute("jobrolecode") === jobRoleData.jobRoleCode
            );

            if (matchingOption) {
              jobRoleDropdown.value = matchingOption.value;
              const event = new Event("change", { bubbles: true });
              jobRoleDropdown.dispatchEvent(event);
              dropdownsToHighlight.push(jobRoleDropdown);
            }
          }
        }

        // Add blinking animation to all dropdowns that were updated
        dropdownsToHighlight.forEach((dropdown) => {
          dropdown.classList.add("gigya-dropdown-highlight");
        });

        // Remove the animation class after 5 seconds
        setTimeout(() => {
          dropdownsToHighlight.forEach((dropdown) => {
            dropdown.classList.remove("gigya-dropdown-highlight");
          });
        }, 5000);

        setHasProfessionData(true);
        setIsOpen(false);
        setProfession("");
      }
    } catch (error) {
      console.error("Error fetching profession data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAoi = async () => {
    setIsLoading(true);

    try {
      const countryCode = window.cindi?.user?.countryCode || "US";
      const profession =
        window.cindi?.formElements?.c_profession?.professionTypeDescription
          ?.value || "";
      const specialty =
        window.cindi?.formElements?.c_profession?.specialtyDescription?.value ||
        "";
      const jobRole =
        window.cindi?.formElements?.c_affiliation?.jobRoleDescription?.value ||
        "";

      const apiUrl = `https://jrulttak6c.execute-api.eu-central-1.amazonaws.com/default/api-ciam/v1/customerAreaOfInterest?countryCode=${countryCode}&lang=en&profession=${encodeURIComponent(
        profession
      )}&specialty=${encodeURIComponent(
        specialty
      )}&jobRole=${encodeURIComponent(jobRole)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (
        data.statusCode === 200 &&
        data.body.status === "success" &&
        data.body.result.length > 0
      ) {
        const aoiContainer = document.querySelector(
          ".cindi-areasOfInterest-container"
        );

        if (aoiContainer) {
          // Clear existing selections
          const allOptions = aoiContainer.querySelectorAll(
            ".cindi-areasOfInterest-option"
          );
          allOptions.forEach((option) => {
            option.classList.remove("selectedAOI");
          });

          // Select matching AOIs
          data.body.result.forEach(
            (item: {
              indicationCode: string;
              indicationDescription: string;
            }) => {
              const matchingOption = Array.from(allOptions).find((option) => {
                const attrValue = option.getAttribute("indicationcode");
                return (
                  attrValue &&
                  attrValue.toUpperCase() === item.indicationCode.toUpperCase()
                );
              });

              if (matchingOption) {
                (matchingOption as HTMLElement).click();
              }
            }
          );
        }

        setIsOpen(false);
        setShowAoiPrompt(false);
      }
    } catch (error) {
      console.error("Error fetching AOI data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    if (hasProfessionData) {
      setShowAoiPrompt(true);
      setShowProfessionInput(false);
    } else {
      setShowAoiPrompt(false);
      setShowProfessionInput(true);
    }
  };

  const handleAskForProfession = () => {
    setShowAoiPrompt(false);
    setShowProfessionInput(true);
  };

  const handleCancel = () => {
    setProfession("");
    setIsOpen(false);
    setShowAoiPrompt(false);
    setShowProfessionInput(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleOpenModal}
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
              {showAoiPrompt
                ? "Would you like help selecting Areas of Interest based on your profession, specialty, and position?"
                : "Tell me something about your profession so I can assist you better."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {showProfessionInput && (
              <Textarea
                placeholder="e.g., I'm a cardiologist specializing in heart failure..."
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="min-h-[120px]"
              />
            )}
            {showAoiPrompt && (
              <p className="text-sm text-muted-foreground">
                Based on your selected profession, specialty, and job role, I
                can help you select relevant Areas of Interest.
              </p>
            )}
          </div>
          <DialogFooter className="flex-col gap-3">
            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-none"
                disabled={isLoading}
              >
                Cancel
              </Button>
              {showProfessionInput && (
                <Button
                  onClick={handleSubmitProfession}
                  className="bg-[#002e6d] hover:bg-[#002e6d]/90 rounded-none"
                  disabled={isLoading || !profession.trim()}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </Button>
              )}
              {showAoiPrompt && (
                <Button
                  onClick={handleSubmitAoi}
                  className="bg-[#002e6d] hover:bg-[#002e6d]/90 rounded-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Yes, help me"}
                </Button>
              )}
            </div>
          </DialogFooter>
          {showAoiPrompt && (
            <div className="flex justify-end">
              <button
                onClick={handleAskForProfession}
                className="text-sm text-[#002e6d] hover:underline disabled:opacity-50 disabled:no-underline"
                disabled={isLoading}
              >
                Ask for profession again
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
