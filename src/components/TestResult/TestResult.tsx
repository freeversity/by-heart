import { styled } from '@linaria/react';
import { useAtomValue } from 'jotai';
import { Divider } from 'primereact/divider';
import type { FC } from 'react';
import { useParams } from 'react-router';
import { currentTestAtom } from '../../state/currentTest/atoms';
import { LangProgressBar } from '../LangProgressBar';

export const TestResult: FC<{ className?: string; grade: number }> = ({
  className,
  grade,
}) => {
  const { testId } = useParams<{
    testId: string;
  }>();

  if (!testId) throw new Error('No test id');

  const { benchmarks } = useAtomValue(currentTestAtom);

  return (
    <div className={className}>
      <div>
        Grade: : {grade}/{benchmarks[0]?.levels?.at(-1)?.max}
      </div>
      <Divider />
      <Scales>
        {benchmarks.map(({ levels, name, title }) => (
          <Level key={name}>
            <Progress
              stats={{ mastered: grade, awared: 0, unknown: 0 }}
              targets={levels.map(({ max }, index, array) => ({
                label: array[index + 1]?.title ?? '',
                value: max,
              }))}
            >
              {title}
            </Progress>
          </Level>
        ))}
      </Scales>
    </div>
  );
};

const Scales = styled.ul`
  margin: 0;
  padding: 0;
`;

const Level = styled.li`
  display: flex;
  list-style: none;
  align-items: center;
`;

const Progress = styled(LangProgressBar)`
  flex-grow: 1;
`;
