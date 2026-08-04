"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error boundary caught:", error);
  }, [error]);

  return (
    <div className="p-8 max-w-xl mx-auto my-12 border border-divider rounded-2xl bg-content1 text-center space-y-4 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">Admin Section Error</h2>
      <p className="text-xs text-default-500">{error.message || "An error occurred while loading this admin view."}</p>
      <div className="flex justify-center gap-3 pt-2">
        <Button size="sm" onPress={() => reset()} variant="secondary">
          Try again
        </Button>
        <Button size="sm" onPress={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
