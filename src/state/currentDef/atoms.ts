import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import isEqual from 'lodash/isEqual';
import { getDef } from '../../api/defs';

export const currentDefAtom = atomFamily(
  ({ subj, def }: { subj: string; def: string }) =>
    atom(async () => await getDef(subj, def)),
  isEqual,
);
