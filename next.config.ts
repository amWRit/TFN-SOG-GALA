import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // This repo contains multiple lockfiles at different levels.
    // Pin Turbopack to this app's directory so it doesn't infer the monorepo root.
    root: __dirname,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
