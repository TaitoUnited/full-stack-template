export type Cache = {
  enabled: boolean;
  data: Record<string, any>;
};

export interface CacheContainer {
  cache: Cache;
}

export type CacheableFunction<T> = (
  container: CacheContainer,
  ...args: any[]
) => Promise<T>;
