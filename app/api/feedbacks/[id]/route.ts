import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-server";
import { rateFeedback } from "@/services/feedback-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { rating } = await request.json();

  try {
    const feedback = await rateFeedback(id, rating);
    return NextResponse.json({ data: feedback });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to rate feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
