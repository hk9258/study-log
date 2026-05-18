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
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            Study Log
          </span>
          <div className="flex gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? "font-medium text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className={`flex items-center gap-2 text-sm transition-colors ${
              pathname === "/profile"
                ? "font-medium text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            }`}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full" />
            ) : (
              <span>마이페이지</span>
            )}
          </Link>
          <button
            onClick={signOut}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
