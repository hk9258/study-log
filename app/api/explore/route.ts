import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const rawTags = searchParams.get("tags") ?? "";
  const tags = rawTags.split(",").map((t) => t.trim()).filter(Boolean);

  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("study_logs")
    .select("*")
    .eq("is_public", true)
    .order("study_date", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}
