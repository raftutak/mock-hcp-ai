"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const countries = [
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
];

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CountrySelector({ value, onValueChange }: CountrySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="country" className="text-[#002e6d] font-semibold">
        Select Your Country
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id="country"
          className="w-full rounded-none border-gray-300 focus:border-[#002e6d] focus:ring-[#002e6d]"
        >
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {countries.map((country) => (
            <SelectItem
              key={country.code}
              value={country.code}
              className="rounded-none focus:bg-[#f1f5fb]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{country.flag}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
