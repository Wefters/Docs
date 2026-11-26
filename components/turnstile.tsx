/** Cloudflare Turnstile bot check, used on the admin login. */

"use client";

import { useEffect, useRef } from "react";

declare global {
  /** The Turnstile script's global API. */
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

/** The site key, and callbacks for a solved and an expired check. */
interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/** Renders the Turnstile widget, loading Cloudflare's script on first use, and removes it on unmount. */
export function TurnstileWidget({ siteKey, onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onVerify(token),
            "expired-callback": () => {
              if (onExpire) onExpire();
            },
            theme: "auto",
          });
        } catch (err) {
          console.error("Cloudflare Turnstile render error:", err);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById("cf-turnstile-script") as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      const existingCallback = window.onloadTurnstileCallback;
      window.onloadTurnstileCallback = () => {
        if (existingCallback) existingCallback();
        renderWidget();
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire]);

  return <div ref={containerRef} className="my-2 flex justify-center min-h-[65px]" />;
}
