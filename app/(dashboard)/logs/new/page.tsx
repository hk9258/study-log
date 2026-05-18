"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudyLogForm } from "@/components/study-log/StudyLogForm";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import type { StudyLogInput } from "@/types";

export default function NewLogPage() {
  const router = useRouter();
  const { createLog } = useStudyLogs();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (input: StudyLogInput) => {
    setLoading(true);
    try {
      const log = await createLog(input);
      router.push(`/logs/${log.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        새 학습 기록
      </h1>
      <StudyLogForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={loading}
      />
    </div>
  );
}
