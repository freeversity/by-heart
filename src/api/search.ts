import axios, { isAxiosError } from 'axios';
import { normalizeString } from '../utils/normilize';

export async function getSearchResults(subj: string, searchString: string) {
  const normalizedSearchStr = normalizeString(searchString);

  const setName = normalizedSearchStr
    .replaceAll(/[^a-zA-Z0-9]/g, '')
    .slice(0, 3);

  let data: string[] = [];

  try {
    const response = await axios.get<string[]>(
      `https://wiktionary.freeversity.io/v0/${subj}/search/set-${setName}.json`,
    );

    data = response.data;
  } catch (err) {
    if (isAxiosError(err) && err.status === 404) {
      data = [];
    } else {
      throw err;
    }
  }

  return data;
}
