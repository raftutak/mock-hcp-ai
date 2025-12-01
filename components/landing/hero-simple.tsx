"use client";

import { motion } from "framer-motion";

interface HeroSimpleProps {
  title: string;
}

export function HeroSimple({ title }: HeroSimpleProps) {
  return (
    <section className="bg-gradient-to-r from-[#fff3ee] via-white to-[#e9f0ff]">
      <div className="max-w-[1180px] mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[2.1rem] font-bold text-[#002e6d] leading-tight"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}
