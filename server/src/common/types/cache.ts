export type Cache = {
  enabled: boolean;
  data: Record<string, any>;
};

export interface CacheContainer {
  cache: Cache;
}
