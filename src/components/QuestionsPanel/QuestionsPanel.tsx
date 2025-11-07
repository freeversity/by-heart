import { styled } from '@linaria/react';
import { Divider } from 'primereact/divider';
import type { FC } from 'react';
import { Colors } from '../../consts/colors';
import { useQuestionIndexParam } from '../../hooks/useQuestionIndex';
import { useTestAtomValue } from '../../hooks/useTestId';
import {
  testActiveTryAnswers,
  testActiveTryFinished,
  testActiveTryResult,
} from '../../state/tests/testActiveTryAtoms';
import { testAtom, testPaused } from '../../state/tests/testsAtoms';
import { TestResult } from '../TestResult/TestResult';

export const QuestionsPanel: FC<{
  className?: string;
}> = ({ className }) => {
  const [qIndex, setQIndex] = useQuestionIndexParam();

  const result = useTestAtomValue(testActiveTryResult);
  const { questions } = useTestAtomValue(testAtom) ?? {};
  const answers = useTestAtomValue(testActiveTryAnswers);
  const isFinished = useTestAtomValue(testActiveTryFinished);
  const isPaused = useTestAtomValue(testPaused);

  return (
    <div>
      {isFinished && (
        <>
          <TestResult />
          <Divider />
        </>
      )}

      <QuestionsNav className={className} data-paused={isPaused && !isFinished}>
        {questions?.map((_q, index) => (
          <QuestionsNavItem
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
          >
            <QuestionsNavButton
              data-active={qIndex === index + 1}
              data-correct={isFinished && result[index + 1]}
              data-incorrect={
                isFinished && index + 1 in answers && !result[index + 1]
              }
              data-status={index + 1 in answers ? 'answered' : undefined}
              onClick={() => {
                setQIndex(index + 1);
              }}
            >
              {index + 1}
            </QuestionsNavButton>
          </QuestionsNavItem>
        ))}
      </QuestionsNav>
    </div>
  );
};

const QuestionsNav = styled.ul`
  position: relative;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;

  &[data-paused="true"] {
    filter: blur(5px);

    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
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

  &[data-active="true"] {
    box-shadow: 0 0 0 2px ${Colors.blue[3]};
  }

  &[data-status="answered"] {
    background-color: ${Colors.blue[1]};
  }

  &[data-correct="true"] {
    background-color: ${Colors.green[2]};
  }

  &[data-incorrect="true"] {
    background-color: ${Colors.red[2]};
  }
`;
