"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudyLogForm } from "@/components/study-log/StudyLogForm";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { formatDate, formatDuration } from "@/lib/utils";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import type { StudyLog, StudyLogInput } from "@/types";

export default function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { updateLog, deleteLog } = useStudyLogs();
  const [log, setLog] = useState<StudyLog | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient
      .get<{ data: StudyLog }>(`/api/study-logs/${id}`)
      .then((res) => setLog(res.data))
      .catch(() => router.replace("/logs"));
  }, [id, router]);

  const isOwner = !!user && !!log && log.user_id === user.id;

  const handleUpdate = async (input: StudyLogInput) => {
    if (!log) return;
    setSaving(true);
    try {
      const updated = await updateLog(log.id, input);
      setLog(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!log || !confirm("정말 삭제하시겠습니까?")) return;
    await deleteLog(log.id);
    router.push("/logs");
  };

  if (!log) {
    return (
      <p className="py-20 text-center text-sm text-zinc-400">불러오는 중...</p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {editing ? (
        <StudyLogForm
          initial={log}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      ) : (
        <>
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {log.title}
                </h1>
                {log.is_public && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    공개
                  </span>
                )}
              </div>
              {isOwner && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 flex gap-3 text-xs text-zinc-400">
              <span>{formatDate(log.study_date)}</span>
              {log.duration_minutes > 0 && (
                <span>{formatDuration(log.duration_minutes)}</span>
              )}
            </div>

            {log.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {log.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs dark:bg-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {log.content}
            </p>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {isOwner && <FeedbackPanel studyLogId={log.id} />}
        </>
      )}
    </div>
  );
}
