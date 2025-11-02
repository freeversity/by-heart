import { styled } from '@linaria/react';
import type { FC, ReactNode } from 'react';
import { Colors } from '../../consts/colors';
import { Status } from '../../db/db';

export const LangProgressBar: FC<{
  className?: string;
  stats: {
    [Status.Mastered]: number;
    [Status.Awared]: number;
    [Status.Unknown]: number;
  };
  targets: Array<{ value: number; label: string }>;
  children?: ReactNode;
}> = ({ className, targets, stats, children }) => {
  const lastValue = targets.at(-1)?.value ?? 0;

  return (
    <div className={className}>
      <Background>
        {children && <Title>{children}</Title>}
        <Scale>
          <Mastered
            style={{
              '--lang-progress': `${
                (stats[Status.Mastered] / lastValue) * 100
              }%`,
            }}
          />
          <Awared
            style={{
              '--lang-progress': `${
                ((stats[Status.Mastered] + stats[Status.Awared]) / lastValue) *
                100
              }%`,
            }}
          />
          <Unknown
            style={{
              '--lang-progress': `${
                ((stats[Status.Mastered] +
                  stats[Status.Awared] +
                  stats[Status.Unknown]) /
                  lastValue) *
                100
              }%`,
            }}
          />
        </Scale>
      </Background>
      <Labels>
        {targets.map(({ label, value }) => (
          <Label
            style={{ '--lang-progress': `${(value / lastValue) * 100}%` }}
            data-fullfilled={stats[Status.Mastered] >= value}
            key={label}
          >
            {label}
          </Label>
        ))}
      </Labels>
    </div>
  );
};

const Title = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Background = styled.div`
  width: 100%;
  height: 15px;
  border-radius: 10px;
  background-color: ${Colors.neutral[2]};
  position: relative;
  /* overflow: hidden; */
`;

const Scale = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;
const Mastered = styled.div`
  position: absolute;
  height: 100%;
  width: var(--lang-progress);
  background-color: ${Colors.mastered};
  z-index: 3;
`;
const Awared = styled.div`
  position: absolute;
  height: 100%;
  width: var(--lang-progress);
  background-color: ${Colors.awared};
  z-index: 2;
`;
const Unknown = styled.div`
  position: absolute;
  height: 100%;
  width: var(--lang-progress);
  background-color: ${Colors.unknown};
  z-index: 1;
`;

const Labels = styled.ul`
  display: flex;
  width: 100%;
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  position: relative;
  height: 20px;
`;

const Label = styled.li`
  position: absolute;
  left: var(--lang-progress);
  transform: translateX(-50%);

  &[data-fullfilled="true"] {
    font-weight: bold;
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 100%;
    border: 5px solid transparent;
    border-bottom-color: ${Colors.neutral[4]};
    left: 50%;
    transform: translateX(-50%);
  }
`;
