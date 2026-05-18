import { NextResponse } from "next/server";
import { getAuthUser, createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0];
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];

  const [total, weekly, monthly] = await Promise.all([
    supabase
      .from("study_logs")
      .select("duration_minutes", { count: "exact" })
      .eq("user_id", user.id),
    supabase
      .from("study_logs")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("study_date", weekAgo),
    supabase
      .from("study_logs")
      .select("duration_minutes")
      .eq("user_id", user.id)
      .gte("study_date", monthAgo),
  ]);

  const totalMinutes = (total.data ?? []).reduce(
    (s, l) => s + (l.duration_minutes ?? 0),
    0
  );
  const monthlyMinutes = (monthly.data ?? []).reduce(
    (s, l) => s + (l.duration_minutes ?? 0),
    0
  );

  return NextResponse.json({
    data: {
      total_logs: total.count ?? 0,
      total_minutes: totalMinutes,
      weekly_logs: weekly.count ?? 0,
      monthly_minutes: monthlyMinutes,
    },
  });
}
