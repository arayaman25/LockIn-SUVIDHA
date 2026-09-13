import type { NextConfig } from "next";

// NEXT_PUBLIC_* values are inlined at build time, so a Vercel build without
// the API URL would silently ship a bundle pointing at localhost.
if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Add it in Vercel → Project Settings → Environment Variables (e.g. https://<your-service>.onrender.com).",
  );
}

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
