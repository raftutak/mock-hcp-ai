"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Phone, Key, User } from "lucide-react";
import { CountrySelector } from "@/components/auth/country-selector";
import { AiLoginPocButton } from "@/components/auth/ai-login-poc-button";

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

const initialSocialProviders = [
  { name: "googleplus", label: "Google", color: "#4285F4" },
  { name: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { name: "facebook", label: "Facebook", color: "#1877F2" },
  { name: "doccheck", label: "DocCheck", color: "#DC143C" },
  { name: "line", label: "LINE", color: "#00B900" },
  { name: "finmet", label: "FinMet", color: "#1B4F72" },
  { name: "prosante", label: "ProSanté", color: "#0066CC" },
  { name: "kakaotalk", label: "KakaoTalk", color: "#FEE500" },
  { name: "wechat", label: "WeChat", color: "#07C160" },
];

const loginMethodsConfig = [
  { value: "standard", label: "Standard Login", icon: Mail },
  { value: "sociallogins", label: "Social Logins", icon: User },
  { value: "onetimepassword", label: "One-Time Password", icon: Phone },
  { value: "passkey", label: "Passkey", icon: Key },
];

export function LoginPocContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("AU");
  const [showAiButton, setShowAiButton] = useState(false);
  const [socialProviders, setSocialProviders] = useState(
    initialSocialProviders
  );
  const [loginMethods, setLoginMethods] = useState(
    loginMethodsConfig.map((m) => m.value)
  );
  const [accordionValue, setAccordionValue] = useState("standard");
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [highlightedMethod, setHighlightedMethod] = useState<string | null>(
    null
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAiButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (highlightedMethod) {
      const timer = setTimeout(() => {
        setHighlightedMethod(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightedMethod]);

  const handleReorder = (sortedMethods: string[], sortedSocials: string[]) => {
    // Reorder login methods
    const methodsMap = new Map(loginMethodsConfig.map((m) => [m.value, m]));
    const reorderedMethods = sortedMethods.filter((method) =>
      methodsMap.has(method)
    );

    // Add any methods not in the sorted list
    loginMethodsConfig.forEach((method) => {
      if (!reorderedMethods.includes(method.value)) {
        reorderedMethods.push(method.value);
      }
    });

    setLoginMethods(reorderedMethods);

    // Reorder social providers
    const providersMap = new Map(
      initialSocialProviders.map((p) => [p.name, p])
    );
    const reorderedProviders = sortedSocials
      .map((name) => providersMap.get(name))
      .filter((p) => p !== undefined) as typeof initialSocialProviders;

    // Add any providers not in the sorted list
    initialSocialProviders.forEach((provider) => {
      if (!sortedSocials.includes(provider.name)) {
        reorderedProviders.push(provider);
      }
    });

    setSocialProviders(reorderedProviders);

    // Reset show all providers when reordering
    setShowAllProviders(false);

    // Open the first method in the sorted list and highlight it
    if (reorderedMethods.length > 0) {
      setAccordionValue(reorderedMethods[0]);
      setHighlightedMethod(reorderedMethods[0]);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (window.gigya?.accounts?.login) {
      window.gigya.accounts.login({
        loginID: email,
        password: password,
        callback: (response: any) => {
          console.log(response);
          if (response.errorCode === 0 && response.status === "OK") {
            window.location.href = "/";
          } else {
            setIsLoggingIn(false);
          }
        },
      });
    } else {
      console.error("Gigya is not available");
      setIsLoggingIn(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log("Social Login:", provider);
  };

  const handleOTPLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP Login:", { phone, otp });
  };

  const handlePasskeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Passkey Login:", { username });
  };

  const renderLoginMethod = (methodValue: string) => {
    const method = loginMethodsConfig.find((m) => m.value === methodValue);
    if (!method) return null;

    const IconComponent = method.icon;

    switch (methodValue) {
      case "standard":
        return (
          <AccordionItem
            key="standard"
            value="standard"
            className={`p-2 border-b border-gray-200 ${
              highlightedMethod === "standard" ? "login-method-highlight" : ""
            }`}
          >
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002e6d]">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {method.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleStandardLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[#002e6d] font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[#002e6d] font-semibold"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#002e6d] text-white hover:bg-[#002e6d]/95 font-semibold rounded-none"
                  disabled={isLoggingIn}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {isLoggingIn ? "Processing..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-[#002e6d] hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        );

      case "sociallogins":
        const visibleProviders = showAllProviders
          ? socialProviders
          : socialProviders.slice(0, 1);
        const hasMoreProviders = socialProviders.length > 1;

        return (
          <AccordionItem
            key="sociallogins"
            value="sociallogins"
            className={`p-2 border-b border-gray-200 ${
              highlightedMethod === "sociallogins"
                ? "login-method-highlight"
                : ""
            }`}
          >
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002e6d]">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {method.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-4">
                {visibleProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    className="w-full justify-start rounded-none border-gray-300 hover:bg-[#f1f5fb] hover:border-[#002e6d] transition-all"
                    onClick={() => handleSocialLogin(provider.name)}
                  >
                    <div
                      className="w-5 h-5 mr-3 flex items-center justify-center rounded-none"
                      style={{
                        backgroundColor: provider.color,
                        color:
                          provider.name === "kakaotalk" ? "#000000" : "#FFFFFF",
                      }}
                    >
                      {provider.name === "googleplus" && (
                        <span className="text-xs font-bold">G</span>
                      )}
                      {provider.name === "linkedin" && (
                        <span className="text-xs font-bold">in</span>
                      )}
                      {provider.name === "facebook" && (
                        <span className="text-xs font-bold">f</span>
                      )}
                      {provider.name === "doccheck" && (
                        <span className="text-xs font-bold">DC</span>
                      )}
                      {provider.name === "line" && (
                        <span className="text-xs font-bold">L</span>
                      )}
                      {provider.name === "finmet" && (
                        <span className="text-xs font-bold">FM</span>
                      )}
                      {provider.name === "prosante" && (
                        <span className="text-xs font-bold">PS</span>
                      )}
                      {provider.name === "kakaotalk" && (
                        <span className="text-xs font-bold">K</span>
                      )}
                      {provider.name === "wechat" && (
                        <span className="text-xs font-bold">W</span>
                      )}
                    </div>
                    Continue with {provider.label}
                  </Button>
                ))}

                {hasMoreProviders && (
                  <button
                    onClick={() => setShowAllProviders(!showAllProviders)}
                    className="w-full py-2 text-sm text-[#002e6d] hover:text-[#002e6d]/80 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {showAllProviders ? (
                      <>
                        <span>Show Less</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>
                          Show All ({socialProviders.length} providers)
                        </span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case "onetimepassword":
        return (
          <AccordionItem
            key="onetimepassword"
            value="onetimepassword"
            className={`p-2 border-b border-gray-200 ${
              highlightedMethod === "onetimepassword"
                ? "login-method-highlight"
                : ""
            }`}
          >
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002e6d]">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {method.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleOTPLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-[#002e6d] font-semibold"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-none border-gray-300 text-[#002e6d] hover:bg-[#f1f5fb] hover:border-[#002e6d] font-semibold"
                >
                  Send OTP
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#002e6d] font-semibold">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#002e6d] text-white hover:bg-[#002e6d]/95 font-semibold rounded-none"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Verify & Sign In
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
        );

      case "passkey":
        return (
          <AccordionItem
            key="passkey"
            value="passkey"
            className={`p-2 border-b border-gray-200 ${
              highlightedMethod === "passkey" ? "login-method-highlight" : ""
            }`}
          >
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-[#002e6d]">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {method.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handlePasskeyLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-[#002e6d] font-semibold"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="your.username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
                    required
                  />
                </div>
                <div className="bg-[#f1f5fb] p-4 text-sm text-gray-700 border border-gray-200">
                  <p className="mb-2 font-semibold text-[#002e6d]">
                    Use your device&apos;s biometric authentication or security
                    key to sign in.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Face ID / Touch ID</li>
                    <li>Windows Hello</li>
                    <li>Hardware security key</li>
                  </ul>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#002e6d] text-white hover:bg-[#002e6d]/95 font-semibold rounded-none"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Authenticate with Passkey
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-[600px] mx-auto px-6">
        <div className="mb-6">
          <CountrySelector value={countryCode} onValueChange={setCountryCode} />
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
            className="w-full"
          >
            {loginMethods.map((method) => renderLoginMethod(method))}
          </Accordion>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-[#002e6d] font-semibold hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>

      {showAiButton && (
        <AiLoginPocButton
          countryCode={countryCode}
          socialProviders={initialSocialProviders.map((p) => p.name)}
          onReorder={handleReorder}
        />
      )}
    </section>
  );
}
