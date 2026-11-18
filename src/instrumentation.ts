import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  _request,
  context,
) => {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  const digest =
    typeof error === "object" && error !== null && "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : undefined;

  console.error(JSON.stringify({
    message: "Next.js request failed",
    errorName,
    digest,
    routerKind: context.routerKind,
    routeType: context.routeType,
  }));
};
