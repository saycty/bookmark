"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/supabase/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Smart Bookmark App</CardTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Sign in with Google to get started
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
