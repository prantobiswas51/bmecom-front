import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Dev only: serve the Vite admin (bmcom-admin) at /admin on this origin.
  // In production the built admin is static files hosted at /admin.
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    const admin = process.env.ADMIN_DEV_URL ?? "http://localhost:5173";
    return [
      { source: "/admin", destination: `${admin}/admin/` },
      { source: "/admin/:path*", destination: `${admin}/admin/:path*` },
    ];
  },
  // Vite's base is "/admin/"; Next must not redirect "/admin/" back to "/admin".
  skipTrailingSlashRedirect: true,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
