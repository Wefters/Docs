import { hostname, networkInterfaces } from "node:os";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const rawAdminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "/weft-admin-sg";
const adminPath = rawAdminPath.startsWith("/") ? rawAdminPath : `/${rawAdminPath}`;

/**
 * Hosts other than localhost that may open the dev server. Next.js refuses its scripts and live reload to
 * any other origin, so opening the site at this machine's network address (from a phone, say) would load
 * the page without JavaScript. This lists every network address of this machine, its `.local` name, and any
 * hosts in `DEV_ALLOWED_ORIGINS` (comma-separated, such as a tunnel's host name). Only used by `next dev`.
 */
function devOrigins() {
  const addresses = Object.values(networkInterfaces())
    .flat()
    .filter((info) => info && !info.internal && info.family === "IPv4")
    .map((info) => info.address);
  const extra = (process.env.DEV_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  const machine = hostname().toLowerCase();
  return [...new Set([...addresses, machine, machine.endsWith(".local") ? machine : `${machine}.local`, ...extra])];
}

const config = {
  reactStrictMode: true,
  allowedDevOrigins: devOrigins(),
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
