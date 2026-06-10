import { HttpParams } from '@angular/common/http';

type QueryValue = boolean | number | string | null | undefined;

export function buildHttpParams<T extends object>(query: T): HttpParams {
  return Object.entries(query as Record<string, QueryValue>).reduce((params, [key, value]) => {
    if (value === null || value === undefined || value === '') {
      return params;
    }

    return params.set(key, value);
  }, new HttpParams());
}
