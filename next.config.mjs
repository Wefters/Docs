import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const rawAdminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "/weft-admin-sg";
const adminPath = rawAdminPath.startsWith("/") ? rawAdminPath : `/${rawAdminPath}`;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    if (adminPath !== "/weft-admin-sg") {
      return [
        {
          source: adminPath,
          destination: "/weft-admin-sg",
        },
        {
          source: `${adminPath}/:path*`,
          destination: "/weft-admin-sg/:path*",
        },
      ];
    }
    return [];
  },
};

export default withMDX(config);
