import { sleep } from '~/utils/promise';
import { z } from 'zod';

const starWarsResponseSchema = z.object({
  results: z.array(z.object({ name: z.string(), url: z.string() })),
});

export async function fetchStarWarsCharacter({
  filterText = '',
  signal,
}: {
  filterText?: string;
  signal?: AbortSignal;
}): Promise<{ value: string; label: string }[]> {
  await sleep(500); // add a bit extra delay to simulate network latency
  const response = await fetch(
    `https://swapi.py4e.com/api/people/?search=${filterText}`,
    { signal }
  );
  const responseBody: unknown = await response.json();
  const result = starWarsResponseSchema.parse(responseBody).results;

  return result.map(item => ({ value: item.url, label: item.name }));
}
