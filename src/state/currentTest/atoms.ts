import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash';
import { getQuestionText, getTest } from '../../api/tests';

export const currentTestAtom = atomFamily((id: string) =>
  atom(async () => await getTest(id)),
);

export const currentTestQuestionAtom = atomFamily(
  ({ id, index }: { id: string; index: number }) =>
    atom(async (get) => {
      const test = await get(currentTestAtom(id));

      return test.questions[index - 1];
    }),
  isEqual,
);

export const currentTestTextAtom = atomFamily(
  ({ id, index }: { id: string; index: number }) =>
    atom(async (get) => {
      const question = await get(currentTestQuestionAtom({ id, index }));

      if (!question?.text) return null;

      return getQuestionText(id, question.text);
    }),
  isEqual,
);

export const currentTestAnswersAtom = atomFamily((_id: string) =>
  atom<{ [key: number]: number | undefined }>({}),
);

export const currentTestResult = atomFamily((id: string) =>
  atom(async (get) => {
    const isFinished = get(currentTestFinishedAtom(id));

    if (!isFinished) return {};

    const answers = get(currentTestAnswersAtom(id));

    const { questions } = await get(currentTestAtom(id));

    return Object.entries(answers).reduce<{ [index: number]: boolean }>(
      (result, [qIndex, answer]) => {
        result[+qIndex] = answer === questions[+qIndex - 1]?.answer;

        return result;
      },
      {},
    );
  }),
);

export const currentTestFinishedAtom = atomFamily((_id: string) =>
  atom<boolean>(false),
);

export const currentTestGradeAtom = atomFamily((id: string) =>
  atom(async (get) => {
    const result = await get(currentTestResult(id));
    const { questions } = await get(currentTestAtom(id));

    return questions.reduce((grade, q, index) => {
      if (result[index + 1]) {
        return grade + q.points;
      }

      return grade;
    }, 0);
  }),
);
