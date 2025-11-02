import { styled } from '@linaria/react';
import type { FC } from 'react';
import type { Question } from '../../api/tests';
import { Colors } from '../../consts/colors';
import { Countdown } from '../Countdown/Countdown';
import { Timer } from '../Timer/Timer';

export const QuestionsPanel: FC<{
  answers?: { [index: number]: boolean };
  grade?: number;
  className?: string;
  active: number;
  onSetActive: (index: number) => void;
  questions: (Question & { status: 'answered' | 'correct' | 'wrong' | null })[];
  timeout: number;
}> = ({
  active,
  onSetActive,
  questions,
  className,
  timeout,
  answers,
  grade,
}) => {
  return (
    <>
      {grade !== undefined && `Grade: ${grade}`}
      <QuestionsNav className={className}>
        {questions.map((q, index) => (
          <QuestionsNavItem
            data-active={active === index + 1}
            data-status={q.status}
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
          >
            <QuestionsNavButton
              data-correct={!!answers && answers[index + 1]}
              data-incorrect={!!answers && !answers[index + 1]}
              onClick={() => {
                onSetActive(index + 1);
              }}
            >
              {index + 1}
            </QuestionsNavButton>
          </QuestionsNavItem>
        ))}
      </QuestionsNav>
      <Countdown timeout={timeout * 1000} />
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
