import { buildHttpParams } from './api-params';

describe('buildHttpParams', () => {
  it('keeps meaningful boolean and numeric values', () => {
    const params = buildHttpParams({
      pageNumber: 1,
      pageSize: 20,
      isActive: false,
      search: '',
      status: undefined,
    });

    expect(params.get('pageNumber')).toBe('1');
    expect(params.get('pageSize')).toBe('20');
    expect(params.get('isActive')).toBe('false');
    expect(params.has('search')).toBe(false);
    expect(params.has('status')).toBe(false);
  });
});
