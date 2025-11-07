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
import { useSearchParams } from 'react-router';
import type { QuestionParams } from '../state/tests/testsAtoms';
import { useRefCallback } from './useRefCallback';
import { useTestId } from './useTestId';

export function useQuestionIndexParam() {
  const [params, setParams] = useSearchParams();

  const qIndexParam = params.get('q');

  const qIndex = !qIndexParam || Number.isNaN(+qIndexParam) ? 1 : +qIndexParam;

  const setQIndex = useRefCallback((qIndex: number) => {
    setParams((params) => {
      params.set('q', `${qIndex}`);

      return params;
    });
  });

  return [qIndex, setQIndex] as const;
}

export function useQuestionIndex() {
  return useQuestionIndexParam()[0];
}

export function useQuestionAtom<TValue, TArgs extends unknown[], TResult>(
  atomFamily: AtomFamily<QuestionParams, WritableAtom<TValue, TArgs, TResult>>,
): [Awaited<TValue>, (...args: TArgs) => TResult];
export function useQuestionAtom<TValue>(
  atomFamily: AtomFamily<QuestionParams, PrimitiveAtom<TValue>>,
): [Awaited<TValue>, (arg: TValue) => void];
export function useQuestionAtom<TValue>(
  atomFamily: AtomFamily<QuestionParams, Atom<TValue>>,
): [Awaited<TValue>, never];
export function useQuestionAtom<
  AtomType extends WritableAtom<unknown, never[], unknown>,
>(
  atomFamily: AtomFamily<QuestionParams, AtomType>,
): [
  Awaited<ExtractAtomValue<AtomType>>,
  (...args: ExtractAtomArgs<AtomType>) => ExtractAtomResult<AtomType>,
];
export function useQuestionAtom<TAtom extends Atom<unknown>>(
  atomFamily: AtomFamily<QuestionParams, TAtom>,
): [Awaited<ExtractAtomValue<TAtom>>, never] {
  const testId = useTestId();
  const index = useQuestionIndex();

  return useAtom<TAtom>(atomFamily({ testId, index }));
}
export function useSetQuestionAtom<TValue, TArgs extends unknown[], TResult>(
  atomFamily: AtomFamily<QuestionParams, WritableAtom<TValue, TArgs, TResult>>,
): (...args: TArgs) => TResult;
export function useSetQuestionAtom<
  TAtom extends WritableAtom<unknown, never[], unknown>,
>(
  atomFamily: AtomFamily<QuestionParams, TAtom>,
): (...args: ExtractAtomArgs<TAtom>) => ExtractAtomResult<TAtom> {
  const testId = useTestId();
  const index = useQuestionIndex();

  return useSetAtom<TAtom>(atomFamily({ testId, index }));
}

export function useQuestionAtomValue<TAtom extends Atom<unknown>>(
  atomFamily: AtomFamily<QuestionParams, TAtom>,
) {
  const testId = useTestId();
  const index = useQuestionIndex();

  return useAtomValue<TAtom>(atomFamily({ testId, index }));
}
