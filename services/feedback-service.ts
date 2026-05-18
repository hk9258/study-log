import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Feedback } from "@/types";

type FeedbackPayload = {
  summary: string;
  strengths: string;
  improvements: string;
  next_steps: string;
  encouragement: string;
};

export async function getFeedback(studyLogId: string): Promise<Feedback | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("study_log_id", studyLogId)
    .order("version", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function getFeedbackVersions(studyLogId: string): Promise<Feedback[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("study_log_id", studyLogId)
    .order("version", { ascending: false });
  return data ?? [];
}

export async function saveFeedback(
  studyLogId: string,
  userId: string,
  payload: FeedbackPayload
): Promise<Feedback> {
  const supabase = await createServerSupabaseClient();

  const { data: latest } = await supabase
    .from("feedbacks")
    .select("version")
    .eq("study_log_id", studyLogId)
    .eq("user_id", userId)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const version = (latest?.version ?? 0) + 1;

  const { data, error } = await supabase
    .from("feedbacks")
    .insert({ study_log_id: studyLogId, user_id: userId, version, ...payload })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function rateFeedback(
  id: string,
  rating: number | null
): Promise<Feedback> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("feedbacks")
    .update({ rating })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
