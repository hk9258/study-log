import Link from "next/link";
import { StudyLogCard } from "./StudyLogCard";
import type { StudyLog } from "@/types";

export function StudyLogList({ logs }: { logs: StudyLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
        <p className="text-zinc-500">아직 학습 기록이 없습니다.</p>
        <Link
          href="/logs/new"
          className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          첫 기록 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <StudyLogCard key={log.id} log={log} />
      ))}
    </div>
  );
}
