import type { FeedbackType } from "@/types";

export const FEEDBACK_TYPES: FeedbackType[] = [
  "summary",
  "strengths",
  "improvements",
  "next_steps",
  "todos",
];

export const FEEDBACK_LABELS: Record<FeedbackType, string> = {
  summary: "핵심 요약",
  strengths: "잘한 점",
  improvements: "개선할 점",
  next_steps: "다음 학습 방향",
  todos: "실천 TODO",
};
