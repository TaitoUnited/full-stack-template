import { type output, type ZodType } from 'zod';

// Add keys here so that we get strong typings for the storage key value pairs
const STORAGE_KEYS = ['locale'] as const;
const STORAGE_KEY_PREFIX = '@your-app-name/'; // Make sure to replace this with your app name

type StorageKey = (typeof STORAGE_KEYS)[number];

function prefixedKey(key: StorageKey) {
  return `${STORAGE_KEY_PREFIX}${key}`;
}

export const storage = {
  set: (key: StorageKey, value: Record<string, any> | string) => {
    localStorage.setItem(prefixedKey(key), JSON.stringify(value));
  },

  get: <Schema extends ZodType>(
    key: StorageKey,
    schema: Schema
  ): output<Schema> | null => {
    try {
      const value = localStorage.getItem(prefixedKey(key));
      if (!value) {
        return null;
      }

      const result = schema.safeParse(JSON.parse(value));
      return result.success ? result.data : null;
    } catch (error) {
      console.log(`> Failed to get persisted item: ${key}`, error);
      return null;
    }
  },

  remove: (key: StorageKey) => {
    localStorage.removeItem(prefixedKey(key));
  },

  clearAll: () => {
    STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(prefixedKey(key));
    });
  },
};
