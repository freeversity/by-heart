import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash';
import { getSearchResults } from '../../api/search';
import { normalizeString } from '../../utils/normilize';

export const currentSearchQuery = atom('');

export const searchRequest = atomFamily(
  (subj: string) =>
    atom(async (get) => {
      const query = get(currentSearchQuery);

      if (!query.length) return [];

      return getSearchResults(subj, query);
    }),

  isEqual,
);

export const currentSearch = atomFamily(
  (subj: string) =>
    atom(async (get) => {
      const query = get(currentSearchQuery);

      if (!query.length) return [];

      const result = await get(searchRequest(subj));

      const normalizedSearchStr = normalizeString(query);

      return result
        .filter((word) => normalizeString(word).includes(normalizedSearchStr))
        .sort((wordA, wordB) => {
          const startsA =
            normalizeString(wordA).startsWith(normalizedSearchStr);
          const startsB =
            normalizeString(wordB).startsWith(normalizedSearchStr);

          if (startsA === startsB) return wordA.localeCompare(wordB);

          return startsA ? -1 : 1;
        })
        .slice(0, 50);
    }),

  isEqual,
);
