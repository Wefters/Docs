import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Extra classes for the wrapper and for the SVG. */
export interface WovenBackgroundProps extends ComponentProps<"div"> {
  svgClassName?: string;
}

/**
 * Decorative woven background at the top of the landing page, in a light and a dark variant that fade out
 * towards the bottom.
 */
export function WovenBackground({ className, svgClassName, ...props }: WovenBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px] sm:h-[840px] md:h-[920px] lg:h-[980px] overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMin slice"
        className={cn("h-full w-full object-cover", svgClassName)}
      >
        <defs>
          <linearGradient id="wefterBottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.96" />
            <stop offset="88%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="wefterFadeMask">
            <rect width="1600" height="900" fill="url(#wefterBottomFade)" />
          </mask>
        </defs>

        <g mask="url(#wefterFadeMask)">
          <g className="dark:hidden transition-opacity duration-300">
            <rect width="1600" height="900" fill="hsl(220, 20%, 99%)" />
            <image href="/images/woven-bg-light.webp" width="1600" height="900" preserveAspectRatio="xMidYMin slice" />
          </g>

          <g className="hidden dark:block transition-opacity duration-300">
            <rect width="1600" height="900" fill="hsl(230, 30%, 1.5%)" />
            <image href="/images/woven-bg-dark.webp" width="1600" height="900" preserveAspectRatio="xMidYMin slice" />
          </g>
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px] sm:h-[500px] md:h-[560px]
                   bg-gradient-to-b from-white/92 via-white/50 via-60% to-transparent
                   dark:bg-gradient-to-b dark:from-[#030712]/92 dark:via-[#030712]/50 dark:via-60% dark:to-transparent"
      />
    </div>
  );
}
