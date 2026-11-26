/**
 * Admin sign-in. A successful login sets an HTTP-only session cookie for seven days. Failed logins are
 * rate-limited per IP, and a Cloudflare Turnstile check is required when its secret key is configured.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

/** Verifies a Turnstile token with Cloudflare. Always passes when no secret key is configured. */
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return true;
  }
  if (!token) return false;

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Cloudflare Turnstile verification error:", err);
    return false;
  }
}

/**
 * Signs in with `username` and `password` (from `WEFTER_ADMIN_USERNAME` / `WEFTER_ADMIN_PASSWORD`), or
 * signs out with `action: "logout"`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, turnstileToken, action } = body;

    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out" });
      response.cookies.delete("wefter_admin_session");
      return response;
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 5, 15 * 60 * 1000);

    if (!rateLimit.success) {
      const minutes = Math.ceil(rateLimit.resetSeconds / 60);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Rate limit exceeded. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
          resetSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        },
      );
    }

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: "Cloudflare Turnstile security check failed. Please complete the captcha." },
        { status: 400 },
      );
    }

    const adminUsername = process.env.WEFTER_ADMIN_USERNAME || "admin";
    const adminPassword = process.env.WEFTER_ADMIN_PASSWORD || "wefter2026!";

    if (username === adminUsername && password === adminPassword) {
      resetRateLimit(clientIp);
      const response = NextResponse.json({ success: true, message: "Authenticated" });
      response.cookies.set("wefter_admin_session", "authorized", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return NextResponse.json(
      {
        error: `Invalid credentials. ${rateLimit.remaining} ${
          rateLimit.remaining === 1 ? "attempt" : "attempts"
        } remaining before lockout.`,
      },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}

/** Whether the request carries a valid admin session. */
export async function GET(request: NextRequest) {
  const session = request.cookies.get("wefter_admin_session")?.value;
  return NextResponse.json({ authenticated: session === "authorized" });
}
