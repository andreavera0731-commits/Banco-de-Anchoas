/**
 * Extracts a human-readable error message from an Axios error response.
 * Returns null for unknown errors — views should provide i18n fallbacks.
 */
export function extractError(err: unknown): string | null {
  const res = (err as { response?: { data?: { message?: string; errors?: string } } })?.response
    ?.data
  return res?.message ?? res?.errors ?? null
}
