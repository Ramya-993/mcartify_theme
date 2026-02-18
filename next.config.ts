import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "mcartify.s3.ap-south-1.amazonaws.com",
      "picsum.photos",
      "drf14yukn9qsy.cloudfront.net",
      "api.dev.mcartify.com",
      "api.mcartify.com",
    ],
    formats: ["image/webp", "image/avif"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // SEO-friendly configurations
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,

  // Generate static pages for better SEO
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return "build-" + Date.now();
  },

  // Headers for better crawling
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
