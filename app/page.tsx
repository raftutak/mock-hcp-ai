"use client";

import { motion } from "framer-motion";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <Hero />

        {/* Next content section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-[1180px] mx-auto px-6"
          >
            <h2 className="text-[1.6rem] font-bold mb-3 text-[#002e6d]">
              Therapeutic areas
            </h2>
            <p className="text-gray-600">
              This is a placeholder section for the content that appears below
              the hero on the original site.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
