"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, onAuthStateChange } from "@/lib/supabase/auth";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const resolveSession = async () => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const { data } = await getSession();
        if (!active) return;

        if (data?.session) {
          router.replace("/dashboard");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      router.replace("/signup");
    };

    resolveSession();

    const subscription = onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  );
}
