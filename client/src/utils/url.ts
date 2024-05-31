export function getAllUrlParams() {
  const entries = new URLSearchParams(location.search).entries();
  const all: Record<string, string> = {};

  for (const entry of entries) {
    all[entry[0]] = entry[1];
  }

  return all;
}

export function getUrlParam(name: string) {
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

export function setUrlParam(key: string, value: number | string) {
  const params = new URLSearchParams(location.search);

  if (value) {
    params.set(key, `${value}`);
  } else {
    params.delete(key);
  }

  history.replaceState({}, '', `${location.pathname}?${params}`);
}
