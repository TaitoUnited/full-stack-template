const THEME_KEY = '@app/theme';
const LOCALE_KEY = '@app/locale';

// Add keys here so that we get strong typings for the storage key value pairs
const ALL_KEYS = [THEME_KEY, LOCALE_KEY] as const;

type StorageKey = (typeof ALL_KEYS)[number];

const set = (key: StorageKey, value: Record<string, any> | string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const get = (key: StorageKey) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log(`> Failed to get persisted item: ${key}`, error);
    return null;
  }
};

const remove = (key: StorageKey) => {
  localStorage.removeItem(key);
};

const clearAll = () => {
  localStorage.clear();
};

export const storage = { get, set, remove, clearAll };
