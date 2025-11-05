import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { atomWithLocation, atomWithSearchParams } from 'jotai-location';
import { atomFamily, loadable, selectAtom } from 'jotai/utils';
import { isEqual } from 'lodash';
import { matchPath } from 'react-router';
import { getQuestionText, getTest } from '../../api/tests';

export const locationAtom = atomWithLocation();

export const questionIndexAtom = atomWithSearchParams('q', '1');

export const testAtom = atomFamily((testId: string) =>
  atomWithCache(() => getTest(testId)),
);

export const testQuestionAtom = atomFamily(
  ({ testId, questionIndex }: { testId: string; questionIndex: number }) =>
    atom(async (get) => {
      const test = await get(testAtom(testId));

      return test.questions[questionIndex - 1];
    }),
  isEqual,
);

export const testQuestionTextAtom = atomFamily(
  ({ testId, questionIndex }: { testId: string; questionIndex: number }) =>
    atomWithCache(
      async (get) => {
        const question = await get(testQuestionAtom({ testId, questionIndex }));

        if (!question?.text) return null;

        return getQuestionText(testId, question.text);
      },
      { size: 100 },
    ),

  isEqual,
);

export const testAnswersAtom = atomFamily((_testId: string) =>
  atom<{
    [key: number]: number | undefined;
  }>({}),
);

export const testFinishedAtom = atomFamily((_testId: string) =>
  atom<boolean>(false),
);

export const currentTestIdAtom = selectAtom(locationAtom, ({ pathname }) => {
  if (!pathname) throw new Error('Test id is not valid');

  const matchReading = matchPath(
    '/subjs/:subj/lists/:listId/reading/:testId',
    pathname,
  );
  const matchListening = matchPath(
    '/subjs/:subj/lists/:listId/listening/:testId',
    pathname,
  );

  const testId =
    matchReading?.params.testId ?? matchListening?.params?.testId ?? null;

  if (!testId) return null;

  return testId;
});

export const currentQuestionIndexAtom = selectAtom(
  questionIndexAtom,
  (qIndex) => {
    if (!qIndex || Number.isNaN(+qIndex)) return 1;

    return +qIndex;
  },
);

export const currentTestAtom = atom((get) => {
  const testId = get(currentTestIdAtom);

  if (!testId) return null;

  return get(testAtom(testId));
});

export const currentTestQuestionAtom = atom((get) => {
  const qIndex = get(currentQuestionIndexAtom);
  const result = get(loadable(currentTestAtom));

  if (result.state !== 'hasData') return undefined;

  return result.data?.questions[qIndex - 1];
});

export const currentTestAnswersAtom = atom(
  (get) => {
    const testId = get(currentTestIdAtom);

    if (!testId) return {};

    return get(testAnswersAtom(testId));
  },
  (
    get,
    set,
    value: {
      [key: number]: number | undefined;
    },
  ) => {
    const testId = get(currentTestIdAtom);

    if (!testId) return null;
    set(testAnswersAtom(testId), value);
  },
);

export const currentTestFinishedAtom = atom(
  (get) => {
    const testId = get(currentTestIdAtom);

    if (!testId) return false;

    return get(testFinishedAtom(testId));
  },
  (get, set, value: boolean) => {
    const testId = get(currentTestIdAtom);

    if (!testId) return null;
    set(testFinishedAtom(testId), value);
  },
);

export const currentTestResult = atom((get) => {
  const isFinished = get(currentTestFinishedAtom);

  if (!isFinished) return undefined;

  const answers = get(currentTestAnswersAtom);

  const testLoadable = get(loadable(currentTestAtom));

  if (testLoadable.state !== 'hasData') return {};

  return Object.entries(answers).reduce<{ [index: number]: boolean }>(
    (result, [qIndex, answer]) => {
      result[+qIndex] =
        answer === testLoadable.data?.questions[+qIndex - 1]?.answer;

      return result;
    },
    {},
  );
});

export const currentTestGradeAtom = atom((get) => {
  const isFinished = get(currentTestFinishedAtom);

  if (!isFinished) return undefined;

  const testResult = get(currentTestResult);
  const result = get(loadable(currentTestAtom));

  if (result.state !== 'hasData') return undefined;

  return result.data?.questions.reduce((grade, q, index) => {
    if (testResult?.[index + 1]) {
      return grade + q.points;
    }

    return grade;
  }, 0);
});

export const currentTestQuestionsCount = atom(async (get) => {
  const test = await get(currentTestAtom);

  return test?.questions.length;
});

export const currentTestAnswered = atom((get) => {
  const questionsCount = get(loadable(currentTestQuestionsCount));
  const answers = get(currentTestAnswersAtom);

  if (questionsCount.state !== 'hasData') return false;

  return questionsCount.data === Object.keys(answers).length;
});
