"use client";

import type { BaseLayoutProps, NavOptions } from "../shared";
import { type ComponentProps, createContext, type FC, use } from "react";
import { baseSlots, useLinkItems, type BaseSlots, type BaseSlotsProps } from "../shared";
import type { LinkItemType } from "../shared";
import { Container } from "./slots/container";
import { Header } from "./slots/header";

/** Options of the landing page layout. */
export interface HomeLayoutProps extends BaseLayoutProps, ComponentProps<"main"> {
  nav?: Nav;
  slots?: Partial<HomeSlots>;
}

/** Header options of the landing page. */
interface Nav extends NavOptions {
  enableHoverToOpen?: boolean;
}

/** Replaceable parts of the landing page layout. */
export interface HomeSlots extends BaseSlots {
  header: FC<ComponentProps<"header">>;
  container: FC<ComponentProps<"main">>;
}

/** Layout props and slots shared with the layout's parts. */
const LayoutContext = createContext<{
  props: BaseSlotsProps<HomeLayoutProps>;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: HomeSlots;
} | null>(null);

/**
 * The landing page layout's props and slots.
 *
 * @throws {Error} When used outside the layout.
 */
export function useHomeLayout() {
  const context = use(LayoutContext);
  if (!context) throw new Error("Please use this component under <HomeLayout /> (`fumadocs-ui/layouts/home`).");
  return context;
}

const { useBaseSlots } = baseSlots({
  useProps() {
    return useHomeLayout().props;
  },
});

/** Layout of the landing page: header and content. */
export function HomeLayout(props: HomeLayoutProps) {
  const {
    nav: { enabled: navEnabled = true } = {},
    slots: defaultSlots,
    children,
    i18n: _i18n,
    githubUrl: _githubUrl,
    links: _links,
    themeSwitch: _themeSwitch,
    searchToggle: _searchToggle,
    ...rest
  } = props;
  const { baseSlots, baseProps } = useBaseSlots(props);
  const linkItems = useLinkItems(props);
  const slots: HomeSlots = {
    ...baseSlots,
    header: defaultSlots?.header ?? InlineHeader,
    container: defaultSlots?.container ?? Container,
  };

  return (
    <LayoutContext
      value={{
        props: baseProps,
        slots,
        ...linkItems,
      }}
    >
      <slots.container {...rest}>
        {navEnabled && <slots.header />}
        {children}
      </slots.container>
    </LayoutContext>
  );
}

/** The configured header component, or the default header. */
function InlineHeader(props: ComponentProps<"header">) {
  const { nav } = useHomeLayout().props;
  if (nav?.component) return nav.component;
  return <Header {...props} />;
}
