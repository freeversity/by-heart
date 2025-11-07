import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { withAtomEffect } from 'jotai-effect';
import { atomFamily, loadable } from 'jotai/utils';
import { isEqual } from 'lodash';
import { db } from '../../db';
import {
  testAnswers,
  testQuestionAnswer,
  testQuestionAnswerMaybe,
  testTryFinishedCurrent,
  testTryResultMaybe,
  testTryScoreMaybe,
  testTryTimeoutCurrent,
  testTryTimeoutInitial,
} from './testTriesAtoms';
import {
  type QuestionParams,
  type TestParams,
  testAtom,
  testPaused,
  testQuestionsCount,
  testTimeout,
} from './testsAtoms';

export const testActiveTryInitial = atomFamily(
  ({ testId }: TestParams) =>
    atomWithCache(async () => {
      const [currentTry] = await db.testTries
        .where({ testId })
        .and(({ finished }) => finished === null)
        .sortBy('timestamp');

      return currentTry;
    }),
  isEqual,
);

export const testActiveTryIdInitial = atomFamily(
  ({ testId }: TestParams) =>
    atom(async (get) => {
      const initialTry = await get(testActiveTryInitial({ testId }));

      return initialTry?.tryId;
    }),
  isEqual,
);

export const testActiveTryIdCurrent = atomFamily(
  ({ testId }: TestParams) =>
    withAtomEffect(atom<string | undefined>(undefined), (get, set) => {
      const tryId = get(testActiveTryIdCurrent({ testId }));

      if (!tryId) return;

      set(testPaused({ testId }), false);

      createNewTry();

      async function createNewTry() {
        const test = await get(testAtom({ testId }));

        db.testTries.add({
          tryId,
          testId,
          grade: null,
          timeLeft: test.timeout,
          created: Date.now(),
          updated: Date.now(),
          finished: null,
        });
      }
    }),
  isEqual,
);

export const testActiveTryId = atomFamily(
  ({ testId }: TestParams) =>
    atom(
      (get) => {
        const currentTryId = get(testActiveTryIdCurrent({ testId }));

        if (currentTryId) return currentTryId;

        return get(testActiveTryIdInitial({ testId }));
      },
      (_get, set, value: string) => {
        set(testActiveTryIdCurrent({ testId }), value);
      },
    ),
  isEqual,
);

const testActiveTryIdMaybe = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const tryIdResult = get(loadable(testActiveTryId({ testId })));

      if (tryIdResult.state !== 'hasData') return undefined;

      return tryIdResult.data;
    }),
  isEqual,
);

export const testActiveTryFinishedInitial = atomFamily(
  ({ testId }: TestParams) =>
    atomWithCache(async (get) => {
      const initialTry = await get(testActiveTryInitial({ testId }));

      return !initialTry;
    }),
  isEqual,
);

export const testActiveTryFinishedCurrent = atomFamily(
  ({ testId }: TestParams) =>
    atom(
      async (get) => {
        const tryId = await get(testActiveTryIdMaybe({ testId }));

        if (!tryId) return false;

        return get(testTryFinishedCurrent({ testId, tryId }));
      },
      async (get, set, isFinished: boolean) => {
        const tryId = await get(testActiveTryIdMaybe({ testId }));

        if (!tryId) return;

        set(testTryFinishedCurrent({ testId, tryId }), isFinished);
      },
    ),
  isEqual,
);

export const testActiveTryFinished = atomFamily(
  ({ testId }: TestParams) =>
    atom(
      (get) => {
        const tryId = get(testActiveTryIdMaybe({ testId }));

        if (tryId) return get(testTryFinishedCurrent({ testId, tryId }));

        return get(testActiveTryFinishedInitial({ testId }));
      },
      async (get, set, isFinished: boolean) => {
        const tryId = await get(testActiveTryId({ testId }));

        if (!tryId) return;

        set(testTryFinishedCurrent({ testId, tryId }), isFinished);
      },
    ),
  isEqual,
);

export const testActiveTryQuestionAnswer = atomFamily(
  ({ testId, index }: QuestionParams) =>
    atom(
      (get) => {
        const tryId = get(testActiveTryIdMaybe({ testId }));

        if (!tryId) return undefined;

        return get(testQuestionAnswerMaybe({ testId, index, tryId }));
      },
      async (get, set, value: number) => {
        const tryId = await get(testActiveTryId({ testId }));

        if (!tryId) return;

        set(testQuestionAnswer({ testId, index, tryId }), value);
      },
    ),
  isEqual,
);

export const testActiveTryAnswers = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const tryId = get(testActiveTryIdMaybe({ testId }));

      if (!tryId) return {};

      return get(testAnswers({ testId, tryId }));
    }),
  isEqual,
);

export const testActiveTryResult = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const tryId = get(testActiveTryIdMaybe({ testId }));

      if (!tryId) return {};

      return get(testTryResultMaybe({ testId, tryId }));
    }),
  isEqual,
);

export const testActiveTryScore = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const tryId = get(testActiveTryIdMaybe({ testId }));

      if (!tryId) return undefined;

      return get(testTryScoreMaybe({ testId, tryId }));
    }),
  isEqual,
);

export const testActiveTryTimeout = atomFamily(
  ({ testId }: TestParams) =>
    atom(
      (get) => {
        const tryId = get(testActiveTryIdMaybe({ testId }));

        if (!tryId) return null;

        return get(testTryTimeoutCurrent({ testId, tryId }));
      },
      async (get, set, timeout: number) => {
        const tryId = await get(testActiveTryId({ testId }));

        if (!tryId) return;

        set(testTryTimeoutCurrent({ testId, tryId }), timeout);
      },
    ),
  isEqual,
);

export const testActiveTryTimeoutInitial = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const tryId = get(testActiveTryIdMaybe({ testId }));

      if (!tryId) return get(testTimeout({ testId }));

      return get(testTryTimeoutInitial({ testId, tryId }));
    }),
  isEqual,
);

export const testActiveTryAnswered = atomFamily(
  ({ testId }: TestParams) =>
    atom((get) => {
      const questionsCountResult = get(
        loadable(testQuestionsCount({ testId })),
      );
      const answersResult = get(loadable(testActiveTryAnswers({ testId })));

      if (
        questionsCountResult.state !== 'hasData' ||
        answersResult.state !== 'hasData'
      )
        return false;

      return (
        questionsCountResult.data === Object.keys(answersResult.data).length
      );
    }),
  isEqual,
);
