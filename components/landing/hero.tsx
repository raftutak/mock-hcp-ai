"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function Hero() {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <section className="bg-gradient-to-r from-[#fff3ee] via-white to-[#e9f0ff]">
      <div className="max-w-[1180px] mx-auto px-6 flex items-stretch justify-between gap-12 flex-col lg:flex-row">
        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[560px] py-14 flex flex-col justify-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[2.1rem] font-bold mb-4 text-[#002e6d] leading-tight"
          >
            {isLoggedIn
              ? "Welcome back to RocheHub!"
              : "Our website interface has been renewed!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[0.95rem] mb-6 text-gray-600"
          >
            {isLoggedIn
              ? "You are successfully logged in. Explore in-depth product information, valuable resources, and comprehensive trial data."
              : "RocheHub is an educational resource for healthcare professionals. If you are not a healthcare professional, please visit the main Roche website."}
          </motion.p>
          {!isLoggedIn && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 flex-col sm:flex-row"
            >
              <Button
                className="bg-[#002e6d] text-white hover:bg-[#002e6d]/95 px-6 py-3 font-semibold rounded-none"
                asChild
              >
                <Link href="/login-poc">Log in</Link>
              </Button>
              <Button
                variant="outline"
                className="bg-transparent text-[#002e6d] border-[#002e6d] hover:bg-[#f1f5fb] px-6 py-3 font-semibold rounded-none"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-1 flex justify-center lg:justify-end w-full relative min-h-[300px] lg:min-h-0"
        >
          <div className="relative w-full lg:w-auto lg:min-w-[600px] h-full">
            <Image
              src="https://s7g10.scene7.com/is/image/rocheeheprod/banner-1?qlt=92&wid=687&ts=1707909058289&dpr=off"
              alt="Healthcare professional with mobile device"
              fill
              className="object-cover object-center lg:object-right"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
