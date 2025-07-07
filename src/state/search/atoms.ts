import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash';
import { getSearchResults } from '../../api/search';

export const currentSearchQuery = atom('');

export const currentSearch = atomFamily(
  (subj: string) =>
    atom(async (get) => {
      const query = get(currentSearchQuery);

      if (!query.length) return [];

      return getSearchResults(subj, query);
    }),

  isEqual,
);
