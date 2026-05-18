import type { FeedbackType } from "@/types";

export const FEEDBACK_TYPES: FeedbackType[] = [
  "summary",
  "strengths",
  "improvements",
  "next_steps",
  "encouragement",
];

export const FEEDBACK_LABELS: Record<FeedbackType, string> = {
  summary: "핵심 요약",
  strengths: "잘한 점",
  improvements: "개선할 점",
  next_steps: "다음 학습 방향",
  encouragement: "격려의 말",
};
