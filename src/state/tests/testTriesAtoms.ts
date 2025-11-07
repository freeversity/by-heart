import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { withAtomEffect } from 'jotai-effect';
import { atomFamily, loadable } from 'jotai/utils';
import { isEqual } from 'lodash';
import { db } from '../../db';
import { type TestParams, testAtom } from './testsAtoms';

export interface TestTryParams {
  testId: string;
  tryId: string;
}

export interface QuestionTryParams {
  testId: string;
  index: number;
  tryId: string;
}

export const testTries = atomFamily(
  ({ testId }: TestParams) =>
    atom(() => db.testTries.where({ testId }).toArray()),
  isEqual,
);

export const testTry = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom(() => db.testTries.where({ tryId, testId }).first()),
  isEqual,
);

const testQuestionAnswerInitial = atomFamily(
  ({ testId, index, tryId }: QuestionTryParams) =>
    atomWithCache(async () => {
      const event = await db.testEvents
        .where({
          testId,
          tryId,
          qIndex: index,
        })
        .first();

      return event?.answer;
    }),
  isEqual,
);

const testQuestionAnswerCurrent = atomFamily(
  ({ testId, index, tryId }: QuestionTryParams) =>
    withAtomEffect(atom<number | undefined>(undefined), (get) => {
      const answer = get(testQuestionAnswerCurrent({ testId, index, tryId }));

      if (answer === undefined) return;

      db.testEvents.put({
        testId,
        qIndex: index,
        tryId,
        created: Date.now(),
        updated: Date.now(),
        answer,
      });
    }),
  isEqual,
);

export const testQuestionAnswer = atomFamily(
  ({ testId, index, tryId }: QuestionTryParams) =>
    atom(
      (get) => {
        const currentAnswer = get(
          testQuestionAnswerCurrent({ testId, index, tryId }),
        );

        if (currentAnswer !== undefined) return currentAnswer;

        return get(testQuestionAnswerInitial({ testId, index, tryId }));
      },
      (_get, set, answer: number) => {
        set(testQuestionAnswerCurrent({ testId, index, tryId }), answer);
      },
    ),
  isEqual,
);

export const testQuestionAnswerMaybe = atomFamily(
  ({ testId, index, tryId }: QuestionTryParams) =>
    atom((get) => {
      const result = get(
        loadable(testQuestionAnswer({ testId, index, tryId })),
      );

      if (result.state !== 'hasData') return undefined;

      return result.data;
    }),
  isEqual,
);

const testAnswersInitial = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atomWithCache(async () => {
      const events = await db.testEvents
        .where({
          testId,
          tryId,
        })
        .toArray();

      return events.reduce<{ [key: number]: number }>(
        (answers, { qIndex, answer }) => {
          answers[qIndex] = answer;

          return answers;
        },
        {},
      );
    }),
  isEqual,
);

const testAnswersCurrent = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom((get) => {
      const result = get(loadable(testAtom({ testId })));

      if (result.state !== 'hasData') return {};

      return result.data.questions.reduce<{ [key: number]: number }>(
        (answers, { index }) => {
          const answer = get(
            testQuestionAnswerCurrent({ testId, tryId, index: +index }),
          );

          if (answer !== undefined) {
            answers[+index] = answer;
          }

          return answers;
        },
        {},
      );
    }),
  isEqual,
);

export const testAnswers = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom((get) => {
      const currentAnswers = get(testAnswersCurrent({ testId, tryId }));

      const initialAnswers = get(
        loadable(testAnswersInitial({ testId, tryId })),
      );

      if (initialAnswers.state !== 'hasData') return {};

      return { ...initialAnswers.data, ...currentAnswers };
    }),
  isEqual,
);

export const testTryResult = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom(async (get) => {
      const answers = await get(testAnswers({ testId, tryId }));

      const { questions } = await get(testAtom({ testId }));

      return Object.entries(answers).reduce<{ [index: number]: boolean }>(
        (result, [qIndex, answer]) => {
          result[+qIndex] = answer === questions[+qIndex - 1]?.answer;

          return result;
        },
        {},
      );
    }),
  isEqual,
);
export const testTryResultMaybe = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom((get) => {
      const answersResult = get(loadable(testTryResult({ testId, tryId })));

      if (answersResult.state !== 'hasData') return {};

      return answersResult.data;
    }),
  isEqual,
);

export const testTryScore = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom(async (get) => {
      const tryResult = await get(testTryResult({ testId, tryId }));

      const { questions } = await get(testAtom({ testId }));

      return questions.reduce((grade, q, index) => {
        if (tryResult?.[index + 1]) {
          return grade + q.points;
        }

        return grade;
      }, 0);
    }),
  isEqual,
);

export const testTryScoreMaybe = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom((get) => {
      const scoreResult = get(loadable(testTryScore({ testId, tryId })));

      if (scoreResult.state !== 'hasData') return undefined;

      return scoreResult.data;
    }),
  isEqual,
);

export const testTryFinished = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom(
      async (get) => {
        const targetTry = await get(
          testTry({
            testId,
            tryId,
          }),
        );

        return !!targetTry?.finished;
      },
      async (get, _set, value: boolean) => {
        if (!value) return;

        const grade = await get(testTryScore({ testId, tryId }));

        await db.testTries.update(tryId, { grade });
      },
    ),
  isEqual,
);

export const testTryFinishedCurrent = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    withAtomEffect(atom(false), (get) => {
      const isFinished = get(testTryFinishedCurrent({ testId, tryId }));

      if (!isFinished) return;

      finishTry();

      async function finishTry() {
        const grade = await get(testTryScore({ testId, tryId }));

        const testTry = await db.testTries.get({ testId, tryId });

        if (!testTry) return;

        await db.testTries.put({
          tryId,
          testId,
          grade,
          timeLeft: 0,
          updated: Date.now(),
          finished: Date.now(),
          created: testTry.created,
        });
      }
    }),
  isEqual,
);

export const testTryTimeoutInitial = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    atom(async (get) => {
      const initialActiveTry = await get(testTry({ testId, tryId }));

      if (initialActiveTry) return initialActiveTry.timeLeft;

      const { timeout } = await get(testAtom({ testId }));

      return timeout;
    }),
  isEqual,
);

export const testTryTimeoutCurrent = atomFamily(
  ({ testId, tryId }: TestTryParams) =>
    withAtomEffect(atom<null | number>(null), (get, set) => {
      const timeout = get(testTryTimeoutCurrent({ testId, tryId }));

      if (typeof timeout !== 'number') return;

      if (timeout <= 0) {
        set(testTryFinishedCurrent({ testId, tryId }), true);

        return;
      }

      updateTry(timeout);

      async function updateTry(timeout: number) {
        const testTry = await db.testTries.get({ testId, tryId });

        if (!testTry) return;

        await db.testTries.put({
          ...testTry,
          tryId,
          testId,
          timeLeft: Math.max(timeout, 0),
          updated: Date.now(),
        });
      }
    }),
  isEqual,
);
