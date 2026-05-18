import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-server";
import { getFeedback, getFeedbackVersions, saveFeedback } from "@/services/feedback-service";
import { generateFeedback } from "@/services/ai-service";
import { getStudyLog } from "@/services/study-log-service";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const studyLogId = request.nextUrl.searchParams.get("study_log_id");
  if (!studyLogId)
    return NextResponse.json({ error: "study_log_id required" }, { status: 400 });

  const [feedback, versions] = await Promise.all([
    getFeedback(studyLogId),
    getFeedbackVersions(studyLogId),
  ]);
  return NextResponse.json({ data: feedback, versions });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { study_log_id } = await request.json();
    const log = await getStudyLog(study_log_id, user.id);
    if (!log) return NextResponse.json({ error: "Study log not found" }, { status: 404 });

    const aiResult = await generateFeedback(log.title, log.content);
    const feedback = await saveFeedback(study_log_id, user.id, aiResult);
    return NextResponse.json({ data: feedback }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
