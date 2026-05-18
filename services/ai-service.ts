import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `당신은 학습 코치입니다. 학습 회고 내용을 분석하고 아래 JSON 형식으로만 응답하세요.
{
  "summary": "핵심 학습 내용 요약 (2~3문장)",
  "strengths": "잘한 점과 긍정적인 부분",
  "improvements": "개선할 수 있는 부분",
  "next_steps": "다음 학습 방향 제안",
  "todos": "다음 학습을 위한 구체적인 실천 항목 3~5개. 반드시 줄바꿈(\\n)으로 구분하고 각 항목은 '- '로 시작하세요. 예: '- React 공식문서 Hooks 챕터 읽기\\n- useState 커스텀 훅 직접 만들어보기'"
}`;

const config = {
  systemInstruction: SYSTEM_PROMPT,
  responseMimeType: "application/json",
};

function prompt(title: string, content: string) {
  return `제목: ${title}\n\n내용: ${content}`;
}

export async function generateFeedback(title: string, content: string) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt(title, content),
    config,
  });
  return JSON.parse(response.text ?? "{}") as {
    summary: string;
    strengths: string;
    improvements: string;
    next_steps: string;
    todos: string;
  };
}

export async function generateFeedbackStream(title: string, content: string) {
  return ai.models.generateContentStream({
    model: MODEL,
    contents: prompt(title, content),
    config,
  });
}
