import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-b23099a950b44f8a98893aa3b5131fe2.r2.dev",
      },
    ],
  },
};

export default nextConfig;
