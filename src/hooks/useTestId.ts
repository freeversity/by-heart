import {
  type Atom,
  type ExtractAtomArgs,
  type ExtractAtomResult,
  type ExtractAtomValue,
  type PrimitiveAtom,
  type WritableAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai';
import type { AtomFamily } from 'jotai/vanilla/utils/atomFamily';
import { useParams } from 'react-router';
import type { TestParams } from '../state/tests/testsAtoms';

export function useTestId() {
  const { testId } = useParams<{ testId: string }>();

  if (!testId) throw new Error('Test ID is not defined!');

  return testId;
}

export function useTestAtom<TValue, TArgs extends unknown[], TResult>(
  atomFamily: AtomFamily<TestParams, WritableAtom<TValue, TArgs, TResult>>,
): [Awaited<TValue>, (...args: TArgs) => TResult];
export function useTestAtom<TValue>(
  atomFamily: AtomFamily<TestParams, PrimitiveAtom<TValue>>,
): [Awaited<TValue>, (arg: TValue) => void];
export function useTestAtom<TValue>(
  atomFamily: AtomFamily<TestParams, Atom<TValue>>,
): [Awaited<TValue>, never];
export function useTestAtom<
  AtomType extends WritableAtom<unknown, never[], unknown>,
>(
  atomFamily: AtomFamily<TestParams, AtomType>,
): [
  Awaited<ExtractAtomValue<AtomType>>,
  (...args: ExtractAtomArgs<AtomType>) => ExtractAtomResult<AtomType>,
];
export function useTestAtom<TAtom extends Atom<unknown>>(
  atomFamily: AtomFamily<TestParams, TAtom>,
): [Awaited<ExtractAtomValue<TAtom>>, never] {
  const testId = useTestId();

  return useAtom<TAtom>(atomFamily({ testId }));
}

export function useSetTestAtom<TValue, TArgs extends unknown[], TResult>(
  atomFamily: AtomFamily<TestParams, WritableAtom<TValue, TArgs, TResult>>,
): (...args: TArgs) => TResult;
export function useSetTestAtom<
  TAtom extends WritableAtom<unknown, never[], unknown>,
>(
  atomFamily: AtomFamily<TestParams, TAtom>,
): (...args: ExtractAtomArgs<TAtom>) => ExtractAtomResult<TAtom> {
  const testId = useTestId();

  return useSetAtom<TAtom>(atomFamily({ testId }));
}

export function useTestAtomValue<TAtom extends Atom<unknown>>(
  atomFamily: AtomFamily<TestParams, TAtom>,
) {
  const testId = useTestId();

  return useAtomValue<TAtom>(atomFamily({ testId }));
}
