import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import isEqual from 'lodash/isEqual';
import { getList } from '../../api/lists';

export const currentListAtom = atomFamily(
  ({ subj, id }: { subj: string; id: string }) =>
    atom(async () => await getList(subj, id)),
  isEqual,
);

export const currentListDef = atomFamily(
  ({ subj, id }: { subj: string; id: string }) =>
    atom(async (get) => {
      const list = await get(currentListAtom({ subj, id }));

      return list.filter((item) => typeof item === 'string');
    }),
  isEqual,
);

export const currentListeningTests = atomFamily(
  ({ subj, id }: { subj: string; id: string }) =>
    atom(async (get) => {
      const list = await get(currentListAtom({ subj, id }));

      return list.filter(
        (item) => typeof item !== 'string' && item.type === 'listening',
      );
    }),
  isEqual,
);

export const currentReadingTests = atomFamily(
  ({ subj, id }: { subj: string; id: string }) =>
    atom(async (get) => {
      const list = await get(currentListAtom({ subj, id }));

      return list.filter(
        (item) => typeof item !== 'string' && item.type === 'reading',
      );
    }),
  isEqual,
);
