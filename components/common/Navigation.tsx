"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/home", label: "대시보드" },
  { href: "/logs", label: "학습 기록" },
  { href: "/explore", label: "탐색" },
];

export function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/home" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-sm">
              S
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              Study Log
            </span>
          </Link>
          <div className="flex gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                  pathname === href
                    ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all ${
              pathname === "/profile"
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-6 w-6 rounded-full" />
            ) : null}
            <span>마이페이지</span>
          </Link>
          <button
            onClick={signOut}
            className="rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
