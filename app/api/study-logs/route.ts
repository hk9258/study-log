import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-server";
import { getStudyLogs, createStudyLog } from "@/services/study-log-service";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const logs = await getStudyLogs(user.id);
    return NextResponse.json({ data: logs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const log = await createStudyLog(user.id, body);
    return NextResponse.json({ data: log }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}
