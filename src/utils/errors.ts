import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"

function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error
}

export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) return ""

  if (isFetchBaseQueryError(error)) {
    if (error.status === "FETCH_ERROR") return "No connection with server"
    if (error.status === 404) return "Nothing was found"
    if (error.status === 401) return "Please login into the system"
    if (typeof error.status === "number" && error.status >= 500) {
      return "Server error. Try again later"
    }
    return "Couldn't execute request"
  }

  return error.message ?? "Unknown error"
}