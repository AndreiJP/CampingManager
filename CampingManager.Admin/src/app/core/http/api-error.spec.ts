import { HttpErrorResponse } from '@angular/common/http';
import { formatApiError } from './api-error';

describe('formatApiError', () => {
  it('uses ProblemDetails detail and trace id when available', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: {
        detail: 'La piazzola non e disponibile.',
        traceId: 'trace-123',
      },
    });

    expect(formatApiError(error, 'Fallback')).toBe('La piazzola non e disponibile. (HTTP 409, trace trace-123)');
  });

  it('uses the first validation error when available', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        errors: {
          email: ['Email non valida.'],
        },
      },
    });

    expect(formatApiError(error, 'Fallback')).toBe('Email non valida. (HTTP 400)');
  });

  it('falls back for non HTTP errors', () => {
    expect(formatApiError(new Error('boom'), 'Fallback')).toBe('Fallback');
  });
});
