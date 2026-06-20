import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: ["192.168.1.2", "localhost", "127.0.0.1"],
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

};

export default nextConfig;




