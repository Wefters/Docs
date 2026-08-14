import { NextRequest, NextResponse } from "next/server";
import { getPlugins, getPluginBySlug, upsertPlugin, deletePlugin } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const plugin = await getPluginBySlug(slug);
    if (!plugin) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
    }
    return NextResponse.json(plugin);
  }

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";

  const data = await getPlugins({ page, limit, search, type });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("wefter_admin_session")?.value;
  if (session !== "authorized") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await upsertPlugin(body);
    return NextResponse.json({ success: true, plugin: result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save plugin" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = request.cookies.get("wefter_admin_session")?.value;
  if (session !== "authorized") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await upsertPlugin(body);
    return NextResponse.json({ success: true, plugin: result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plugin" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get("wefter_admin_session")?.value;
  if (session !== "authorized") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Plugin ID required" }, { status: 400 });
    }

    const success = await deletePlugin(id);
    if (!success) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Plugin deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plugin" }, { status: 500 });
  }
}
