import { styled } from '@linaria/react';
import { useAtom, useAtomValue } from 'jotai';
import { Divider } from 'primereact/divider';
import type { FC } from 'react';
import { Colors } from '../../consts/colors';
import {
  currentTestAnswersAtom,
  currentTestAtom,
  currentTestGradeAtom,
  currentTestResult,
  questionIndexAtom,
} from '../../state/currentTest/atoms';
import { Countdown } from '../Countdown/Countdown';
import { TestResult } from '../TestResult/TestResult';

export const QuestionsPanel: FC<{
  className?: string;
  onTimeout: () => void;
}> = ({ className, onTimeout }) => {
  const grade = useAtomValue(currentTestGradeAtom);
  const answers = useAtomValue(currentTestResult);

  const [qParam, setQIndex] = useAtom(questionIndexAtom);

  const qIndex = +qParam;

  const { questions, timeout } = useAtomValue(currentTestAtom) ?? {};

  const aswers = useAtomValue(currentTestAnswersAtom);

  return (
    <>
      {grade !== undefined && (
        <>
          <TestResult grade={grade} />
          <Divider />
        </>
      )}

      <QuestionsNav className={className}>
        {questions?.map((_q, index) => (
          <QuestionsNavItem
            data-active={qIndex === index + 1}
            data-status={`${index + 1}` in aswers ? 'answered' : undefined}
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
          >
            <QuestionsNavButton
              data-correct={!!answers && answers[index + 1]}
              data-incorrect={!!answers && !answers[index + 1]}
              onClick={() => {
                setQIndex(`${index + 1}`);
              }}
            >
              {index + 1}
            </QuestionsNavButton>
          </QuestionsNavItem>
        ))}
      </QuestionsNav>
      {grade === undefined && !!timeout && (
        <Countdown timeout={timeout * 1000} onTimeout={onTimeout} />
      )}
    </>
  );
};

const QuestionsNav = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
`;

const QuestionsNavItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const QuestionsNavButton = styled.button`
  background-color: ${Colors.gray[2]};
  border: 1px solid ${Colors.gray[4]};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  cursor: pointer;

  [data-active="true"] & {
    outline: 2px solid ${Colors.blue[3]};
  }

  [data-status="answered"] & {
    background-color: ${Colors.blue[1]};
  }

  &[data-correct="true"] {
    background-color: ${Colors.green[2]};
  }

  &[data-incorrect="true"] {
    background-color: ${Colors.red[2]};
  }
`;
