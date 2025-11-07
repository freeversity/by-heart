import { styled } from '@linaria/react';
import { Button } from 'primereact/button';
import { type FC, memo } from 'react';
import { useTestAtom, useTestAtomValue } from '../../hooks/useTestId';
import {
  testActiveTryFinished,
  testActiveTryTimeoutInitial,
} from '../../state/tests/testActiveTryAtoms';
import { testPaused } from '../../state/tests/testsAtoms';
import { Countdown } from '../Countdown/Countdown';

export const TestCountdown: FC<{
  className?: string;
}> = memo(({ className }) => {
  const initialTimeout = useTestAtomValue(testActiveTryTimeoutInitial);
  const isFinished = useTestAtomValue(testActiveTryFinished);
  const [isPaused, setPaused] = useTestAtom(testPaused);

  return (
    <CounterContent className={className}>
      {!isFinished && !!initialTimeout && (
        <Button
          size="small"
          rounded
          icon={`pi ${isPaused ? 'pi-play' : 'pi-pause'}`}
          onClick={() => {
            setPaused(!isPaused);
          }}
        >
          <Counter timeout={initialTimeout} isPaused={isPaused} />
        </Button>
      )}
    </CounterContent>
  );
});

const CounterContent = styled.div`
  justify-content: center;
  align-items: center;
  gap: 20px;
  display: flex;
`;

const Counter = styled(Countdown)`
  margin-left: 10px;
`;
