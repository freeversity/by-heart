import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash';
import { getPage } from '../../api/pages';

export const DEF_PAGE_SIZE = 100;
export const PAGE_SET_SIZE = 1000;

export const pageRequest = atomFamily(
  ({ subj, page }: { subj: string; page: number }) =>
    atom(async () => {
      return getPage(subj, page);
    }),

  isEqual,
);

export const totalDefsCount = atomFamily((subj: string) =>
  atom(async (get) => {
    const { total } = await get(pageRequest({ subj, page: 0 }));

    return Math.floor(total) + 1;
  }),
);

export const defsPageContent = atomFamily(
  ({ subj, page }: { subj: string; page: number }) =>
    atom(async (get) => {
      const pageId = Math.floor((page * DEF_PAGE_SIZE) / PAGE_SET_SIZE);

      const items = await get(pageRequest({ subj, page: page - 1 }));

      const startIndex = page * DEF_PAGE_SIZE - pageId * PAGE_SET_SIZE;

      return items.content.slice(startIndex, startIndex + DEF_PAGE_SIZE);
    }),
  isEqual,
);
