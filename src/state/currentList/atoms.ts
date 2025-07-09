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
  (_params: { subj: string; id: string; mode: string }) =>
    atom<string | null>(null),
  isEqual,
);
