import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { StudyLog, StudyLogInput } from "@/types";

export async function getStudyLogs(userId: string): Promise<StudyLog[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("study_logs")
    .select("*")
    .eq("user_id", userId)
    .order("study_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getStudyLog(
  id: string,
  userId: string
): Promise<StudyLog | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("study_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getStudyLogOrPublic(
  id: string,
  userId: string
): Promise<StudyLog | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("study_logs")
    .select("*")
    .eq("id", id)
    .or(`user_id.eq.${userId},is_public.eq.true`)
    .single();
  return data;
}

export async function createStudyLog(
  userId: string,
  input: StudyLogInput
): Promise<StudyLog> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("study_logs")
    .insert({ ...input, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateStudyLog(
  id: string,
  userId: string,
  input: Partial<StudyLogInput>
): Promise<StudyLog> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("study_logs")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteStudyLog(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("study_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
