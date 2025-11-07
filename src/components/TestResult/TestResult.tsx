import { styled } from '@linaria/react';
import { Divider } from 'primereact/divider';
import type { FC } from 'react';
import { useTestAtomValue } from '../../hooks/useTestId';
import { testActiveTryScore } from '../../state/tests/testActiveTryAtoms';
import { testAtom } from '../../state/tests/testsAtoms';
import { LangProgressBar } from '../LangProgressBar';

export const TestResult: FC<{ className?: string }> = ({ className }) => {
  const score = useTestAtomValue(testActiveTryScore);

  const { benchmarks = [] } = useTestAtomValue(testAtom) ?? {};

  return (
    <div className={className}>
      <div>
        Score: : {score}/{benchmarks[0]?.levels?.at(-1)?.max}
      </div>
      <Divider />
      <Scales>
        {benchmarks.map(({ levels, name, title }) => (
          <Level key={name}>
            <Progress
              stats={{ mastered: score ?? 0, awared: 0, unknown: 0 }}
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
