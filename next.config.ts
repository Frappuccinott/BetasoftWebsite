import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-b23099a950b44f8a98893aa3b5131fe2.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.betasoftotomasyon.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: "default-src 'self'; connect-src 'self' wss://*.convex.cloud https://*.convex.cloud; img-src 'self' data: blob: https://pub-b23099a950b44f8a98893aa3b5131fe2.r2.dev https://cdn.betasoftotomasyon.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
