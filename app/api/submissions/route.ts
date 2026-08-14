import { NextRequest, NextResponse } from "next/server";
import {
  getSubmissions,
  createSubmission,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
} from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

function isAdmin(request: NextRequest): boolean {
  const session = request.cookies.get("wefter_admin_session")?.value;
  return session === "authorized";
}

// Public Submission Endpoint (POST)
export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate Limit: 5 submissions per 10 minutes
    const rateLimit = checkRateLimit(clientIp, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, packageName, repositoryUrl, npmUrl, license, author, authorEmail, platforms, version, descriptionMdx } = body;

    // Basic Validation
    if (!name || !packageName || !npmUrl || !author || !authorEmail) {
      return NextResponse.json(
        { error: "Missing required fields: Plugin Title, Package Name, npm Package Link, Author Name, and Email are required." },
        { status: 400 }
      );
    }

    const submission = await createSubmission({
      name,
      packageName,
      repositoryUrl: repositoryUrl || undefined,
      npmUrl: npmUrl || undefined,
      license: license || "MIT",
      author,
      authorEmail,
      platforms: platforms && platforms.length ? platforms : ["android", "ios"],
      version: version || "0.0.1",
      descriptionMdx: descriptionMdx || `## ${name}\n\nSubmitted plugin documentation.`,
    });

    return NextResponse.json(
      { success: true, message: "Plugin submitted successfully for admin review.", submission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission POST error:", error);
    return NextResponse.json({ error: "Failed to submit plugin." }, { status: 500 });
  }
}

// Admin-Only: Get Submissions Queue (GET)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// Admin-Only: Approve or Reject Submission (PUT)
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "Missing submission ID or action" }, { status: 400 });
    }

    if (action === "approve") {
      const publishedPlugin = await approveSubmission(id);
      if (!publishedPlugin) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Submission approved and published to Plugin Registry!",
        plugin: publishedPlugin,
      });
    }

    if (action === "reject") {
      const success = await rejectSubmission(id, rejectionReason);
      if (!success) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Submission rejected." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}

// Admin-Only: Delete Submission (DELETE)
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const deleted = await deleteSubmission(id);
    if (!deleted) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Submission deleted." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
