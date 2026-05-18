export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

export interface StudyLog {
  id: string;
  user_id: string;
  title: string;
  content: string;
  study_date: string;
  duration_minutes: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type StudyLogInput = Pick<
  StudyLog,
  "title" | "content" | "study_date" | "duration_minutes" | "tags"
>;

export type FeedbackType =
  | "summary"
  | "strengths"
  | "improvements"
  | "next_steps"
  | "todos";

export interface Feedback {
  id: string;
  study_log_id: string;
  user_id: string;
  version: number;
  summary: string | null;
  strengths: string | null;
  improvements: string | null;
  next_steps: string | null;
  todos: string | null;
  rating: number | null;
  created_at: string;
}

export interface ProfileData {
  user: { id: string; email: string; name: string | null; avatar_url: string | null };
  stats: {
    total_logs: number;
    total_minutes: number;
    weekly_logs: number;
    monthly_minutes: number;
    streak: number;
    top_tags: { tag: string; count: number }[];
    monthly_breakdown: { month: string; count: number; minutes: number }[];
  };
}

export interface Statistics {
  total_logs: number;
  total_minutes: number;
  weekly_logs: number;
  monthly_minutes: number;
}
