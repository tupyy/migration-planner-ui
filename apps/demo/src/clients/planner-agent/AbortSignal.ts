import type { Duration } from "#/common/time";

export function newAbortSignal(
  delay: Duration,
  abortMessage?: string
): AbortSignal {
  const abortController = new AbortController();
  const signal = abortController.signal;
  window.setTimeout(() => {
    abortController.abort(abortMessage);
  }, delay);
  return signal;
}
