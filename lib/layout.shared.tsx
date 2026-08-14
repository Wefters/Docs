import type { BaseLayoutProps, LayoutTab } from "fumadocs-ui/layouts/shared";
import { BookOpen, Puzzle, Terminal, Package } from "lucide-react";
import { HeaderGithubStar } from "@/components/github-star";

const DiscordIcon = () => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

function NavTitle() {
  return (
    <>
      <img src="/Logo/Dark/Logo.svg" alt="Wefter" className="h-6 w-auto dark:hidden" />
      <img src="/Logo/Light/Logo.svg" alt="Wefter" className="h-6 w-auto hidden dark:block" />
    </>
  );
}

export const rootTabs: LayoutTab[] = [
  {
    icon: <BookOpen className="size-4.5" />,
    title: "Docs",
    description: "Architecture, setup, and configuration",
    url: "/docs",
  },
  {
    icon: <Puzzle className="size-4.5" />,
    title: "Plugin",
    description: "Plugin anatomy, the native API surface, and a full worked tutorial",
    url: "/plugin",
  },
  {
    icon: <Terminal className="size-4.5" />,
    title: "CLI",
    description: "Every command, every flag, every failure mode, documented",
    url: "/cli",
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NavTitle />,
    },
    links: [
      {
        icon: <BookOpen className="size-4" />,
        text: "Docs",
        url: "/docs",
        active: "nested-url",
        on: "nav",
      },
      {
        icon: <Puzzle className="size-4" />,
        text: "Plugin",
        url: "/plugin",
        active: "nested-url",
        on: "nav",
      },
      {
        icon: <Terminal className="size-4" />,
        text: "CLI",
        url: "/cli",
        on: "nav",
      },
      {
        icon: <Package className="size-4" />,
        text: "Plugins",
        url: "/plugins",
        active: "nested-url",
        on: "nav",
      },
      {
        type: "icon",
        label: "Join our Discord",
        icon: <DiscordIcon />,
        text: "Discord",
        url: "https://discord.gg/your-invite",
      },
      {
        type: "custom",
        children: <HeaderGithubStar />,
      },
    ],
  };
}
