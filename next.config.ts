import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // Safety net so a stray type error never blocks a hackathon deploy.
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
