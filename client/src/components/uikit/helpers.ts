import { sleep } from '~utils/promise';

export async function fetchStarWarsCharacter({
  filterText = '',
  signal,
}: {
  filterText?: string;
  signal?: AbortSignal;
}): Promise<{ value: string; label: string }[]> {
  await sleep(500); // add a bit extra delay to simulate network latency
  const result = await fetch(
    `https://swapi.py4e.com/api/people/?search=${filterText}`,
    { signal }
  )
    .then(res => res.json())
    .then(data => data.results as { name: string; url: string }[]);

  return result.map(pokemon => ({ value: pokemon.url, label: pokemon.name }));
}
