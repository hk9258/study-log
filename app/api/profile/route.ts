import { NextResponse } from "next/server";
import { getAuthUser, createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data: logs } = await supabase
    .from("study_logs")
    .select("study_date, duration_minutes, tags")
    .eq("user_id", user.id)
    .order("study_date", { ascending: true });

  const allLogs = logs ?? [];
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  const totalMinutes = allLogs.reduce((s, l) => s + (l.duration_minutes ?? 0), 0);
  const weeklyLogs = allLogs.filter((l) => l.study_date >= weekAgo).length;
  const monthlyMinutes = allLogs
    .filter((l) => l.study_date >= monthAgo)
    .reduce((s, l) => s + (l.duration_minutes ?? 0), 0);

  // Consecutive streak ending today
  const dateSet = new Set(allLogs.map((l) => l.study_date));
  let streak = 0;
  let cursor = today;
  while (dateSet.has(cursor)) {
    streak++;
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().split("T")[0];
  }

  // Top tags
  const tagCount: Record<string, number> = {};
  for (const log of allLogs) {
    for (const tag of log.tags ?? []) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1;
    }
  }
  const topTags = Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Monthly breakdown (last 6 months)
  const monthData: Record<string, { count: number; minutes: number }> = {};
  for (const log of allLogs) {
    const month = log.study_date.slice(0, 7);
    if (!monthData[month]) monthData[month] = { count: 0, minutes: 0 };
    monthData[month].count++;
    monthData[month].minutes += log.duration_minutes ?? 0;
  }
  const monthlyBreakdown = Object.entries(monthData)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 6);

  return NextResponse.json({
    data: {
      user: {
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.full_name as string | null) ?? null,
        avatar_url: (user.user_metadata?.avatar_url as string | null) ?? null,
      },
      stats: {
        total_logs: allLogs.length,
        total_minutes: totalMinutes,
        weekly_logs: weeklyLogs,
        monthly_minutes: monthlyMinutes,
        streak,
        top_tags: topTags,
        monthly_breakdown: monthlyBreakdown,
      },
    },
  });
}
