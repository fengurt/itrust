import type { NextConfig } from "next";

const agentApiUrl = process.env.AGENT_API_URL ?? "http://127.0.0.1:3001";

const nextConfig: NextConfig = {
  transpilePackages: ["@itrust/shared", "recharts"],
  async rewrites() {
    return [
      {
        source: "/api/agent/:path*",
        destination: `${agentApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
