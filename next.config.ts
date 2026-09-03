import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "softstar.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
