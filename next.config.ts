import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached from other devices on the LAN
  // (e.g. presenting the demo from a phone/tablet or another laptop).
  allowedDevOrigins: ["192.168.1.2", "localhost", "127.0.0.1"],
};

export default nextConfig;
