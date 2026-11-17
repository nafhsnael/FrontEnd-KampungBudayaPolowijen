"use client";

import { useEffect } from "react";
import ErrorFallback from "./components/errors/ErrorFallback";

type RouteError = Error & { digest?: string };

export default function ErrorPage({
  error,
  reset,
}: {
  error: RouteError;
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) {
      console.error("Route rendering failed", { digest: error.digest });
    }
  }, [error.digest]);

  return <ErrorFallback onRetry={reset} />;
}
