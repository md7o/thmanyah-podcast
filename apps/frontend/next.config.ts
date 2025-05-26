import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.hosting.thmanyah.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3t3ozftmdmh3i.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3wo5wojvuv7l.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: " ",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: " ",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
