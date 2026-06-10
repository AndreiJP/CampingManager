import { HttpErrorResponse } from '@angular/common/http';

interface ProblemDetails {
  title?: string;
  detail?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export function formatApiError(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  const problemDetails = error.error as ProblemDetails | null;
  const validationMessage = firstValidationError(problemDetails);
  const detail = validationMessage ?? problemDetails?.detail ?? problemDetails?.title;
  const traceId = problemDetails?.traceId;
  const status = error.status > 0 ? `HTTP ${error.status}` : 'rete non raggiungibile';
  const message = detail?.trim() ? detail : fallbackMessage;

  return traceId ? `${message} (${status}, trace ${traceId})` : `${message} (${status})`;
}

function firstValidationError(problemDetails: ProblemDetails | null): string | null {
  const errors = problemDetails?.errors;

  if (!errors) {
    return null;
  }

  const firstMessages = Object.values(errors).find((messages) => messages.length > 0);

  return firstMessages?.[0] ?? null;
}
