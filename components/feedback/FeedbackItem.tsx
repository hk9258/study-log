interface Props {
  label: string;
  content: string | null | undefined;
}

export function FeedbackItem({ label, content }: Props) {
  if (!content) return null;
  return (
    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {content}
      </p>
    </div>
  );
}
