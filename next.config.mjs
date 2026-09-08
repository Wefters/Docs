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
  async redirects() {
    return [
      {
        source: "/docs/app-icon",
        destination: "/docs/app-configuration/app-icon",
        permanent: true,
      },
      {
        source: "/docs/app-splash-screen",
        destination: "/docs/app-configuration/splash-screen",
        permanent: true,
      },
      {
        source: "/docs/app-launch-background",
        destination: "/docs/app-configuration/launch-background",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
