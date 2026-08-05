import { z } from 'zod';

import { storage } from './storage';

const STORAGE_KEY = '@your-app-name/locale';
const localeSchema = z.enum(['fi', 'en-FI']);

describe('storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns validated data with the schema-inferred type', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('fi'));

    const locale = storage.get('locale', localeSchema);

    expect(locale).toBe('fi');
  });

  it('returns null when validation fails', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('sv'));

    expect(storage.get('locale', localeSchema)).toBeNull();
  });

  it('returns null when parsing fails', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');

    expect(storage.get('locale', localeSchema)).toBeNull();
  });
});
