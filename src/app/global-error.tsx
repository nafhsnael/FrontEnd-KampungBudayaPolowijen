"use client";

import { useEffect } from "react";
import "@/styles/globals.css";
import ErrorFallback from "@/components/errors/ErrorFallback";

type RouteError = Error & { digest?: string };

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: RouteError;
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) {
      console.error("Root rendering failed", { digest: error.digest });
    }
  }, [error.digest]);

  return (
    <html lang="id">
      <body>
        <ErrorFallback onRetry={reset} />
      </body>
    </html>
  );
}
