"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@/types";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/");
        return;
      }
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
        name: data.user.user_metadata?.full_name ?? null,
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
      });
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="profile"
              className="h-16 w-16 rounded-full"
            />
          )}
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {user?.name ?? user?.email}
          </h1>
          <p className="text-sm text-zinc-500">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-8 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
