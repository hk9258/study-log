import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-server";
import {
  getStudyLogOrPublic,
  updateStudyLog,
  deleteStudyLog,
} from "@/services/study-log-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const log = await getStudyLogOrPublic(id, user.id);
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: log });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const log = await updateStudyLog(id, user.id, body);
    return NextResponse.json({ data: log });
  } catch {
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await deleteStudyLog(id, user.id);
    return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 });
  }
}
