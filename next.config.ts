import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cookielaw.org",
        port: "",
        pathname: "/logos/**",
      },
      {
        protocol: "https",
        hostname: "s7g10.scene7.com",
        port: "",
        pathname: "/is/image/**",
      },
    ],
  },
};

export default nextConfig;
