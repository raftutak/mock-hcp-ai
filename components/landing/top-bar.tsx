"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function TopBar() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading || isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-[#002e6d] text-white text-sm">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between min-h-12 gap-4 flex-wrap">
        <p className="text-sm">
          Sign in to access in-depth product information, valuable resources,
          and comprehensive trial data.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white text-xs font-semibold rounded-none"
            asChild
          >
            <Link href="/login-poc">Sign in</Link>
          </Button>
          <Button
            size="sm"
            className="bg-white text-[#002e6d] hover:bg-white/90 text-xs font-semibold rounded-none"
            asChild
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
