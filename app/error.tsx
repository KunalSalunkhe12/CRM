"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex justify-center items-center text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Something Went Wrong</h2>
        <Button variant="secondary" className="rounded-xl mt-2" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
