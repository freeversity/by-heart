import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { atomFamily, loadable } from 'jotai/utils';
import { isEqual } from 'lodash';
import { getQuestionText, getTest } from '../../api/tests';

export interface TestParams {
  testId: string;
}

export interface QuestionParams {
  testId: string;
  index: number;
}

export const testFetchAtom = atomFamily(
  ({ testId }: TestParams) => atomWithCache(() => getTest(testId)),
  isEqual,
);

export const testAtom = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const atom = testFetchAtom({ testId });

      const result = get(loadable(atom));

      if (result.state === 'hasData') return result.data;

      return get(atom);
    }),
  isEqual,
);

export const testTimeout = atomFamily(
  ({ testId }: TestParams) =>
    atom(async (get) => {
      const result = await get(testAtom({ testId }));

      return result.timeout;
    }),
  isEqual,
);

export const testQuestionAtom = atomFamily(
  ({ testId, index }: QuestionParams) =>
    atom(async (get) => {
      const test = await get(testAtom({ testId }));

      return test.questions[index - 1];
    }),
  isEqual,
);

export const testQuestionTextAtom = atomFamily(
  ({ testId, index }: QuestionParams) =>
    atomWithCache(
      async (get) => {
        const question = await get(testQuestionAtom({ testId, index }));

        if (!question?.text) return null;

        return getQuestionText(testId, question.text);
      },
      { size: 100 },
    ),

  isEqual,
);

export const testQuestionsCount = atomFamily(
  ({ testId }: TestParams) =>
    atom(async (get) => {
      const test = await get(testAtom({ testId }));

      return test?.questions.length ?? 0;
    }),
  isEqual,
);

export const testPaused = atomFamily(
  (_params: TestParams) => atom(true),
  isEqual,
);
