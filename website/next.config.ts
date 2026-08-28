import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/forge",
        destination: "/nanoforge",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
