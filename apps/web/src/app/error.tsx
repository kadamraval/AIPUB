"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-sm text-default-500 mb-4">{error.message || "An unexpected error occurred."}</p>
      <Button onPress={() => reset()} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
