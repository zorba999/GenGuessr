import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["genlayer-js"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
