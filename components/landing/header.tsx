"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Phone, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { isLoggedIn, userProfile, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between min-h-[4.25rem] gap-6">
        {/* Logo group */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="https://cdn.cookielaw.org/logos/d83b6e8f-2787-46e5-b85f-ad52b3a0acb6/b1259cd3-622f-44d3-ad52-9ab3d83cd8ad/0817c5fe-6cff-4070-b7e7-d2d1f28e976e/Roche_Logo_800px_Blue_RGB_Roche_Logo_RGB_(1).png"
              alt="Roche"
              width={120}
              height={40}
              className="h-[30px] w-auto"
            />
            <span className="text-gray-400">|</span>
            <div className="font-semibold text-[#004c97]">Roche Hub</div>
          </Link>
          {isLoggedIn && userProfile && (userProfile.firstName || userProfile.lastName) && (
            <div className="text-sm text-gray-700">
              Welcome back, {userProfile.firstName} {userProfile.lastName}
            </div>
          )}
        </div>

        {/* Main navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-[0.95rem] text-gray-700">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
            Therapeutic Areas
            <span className="text-[0.7rem]">&#9662;</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
            Roche Products
            <span className="text-[0.7rem]">&#9662;</span>
          </div>
          <div className="cursor-pointer hover:text-gray-900">Adverse Events</div>
          <div className="cursor-pointer hover:text-gray-900">Contact</div>
        </nav>

        {/* Header actions */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Support">
            <Phone className="h-5 w-5" />
          </Button>
          <span className="mx-1 hidden sm:inline">Support</span>
          <span className="w-px h-5 bg-gray-300 hidden sm:inline"></span>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer rounded-none focus:bg-[#f1f5fb]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" aria-label="User">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
