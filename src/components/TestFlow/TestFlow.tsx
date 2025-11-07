import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { type FC, Suspense, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { v4 } from 'uuid';
import { useQuestionAtomValue } from '../../hooks/useQuestionIndex';
import {
  useSetTestAtom,
  useTestAtom,
  useTestAtomValue,
  useTestId,
} from '../../hooks/useTestId';
import {
  testActiveTryAnswered,
  testActiveTryFinished,
  testActiveTryId,
} from '../../state/tests/testActiveTryAtoms';
import { testPaused, testQuestionAtom } from '../../state/tests/testsAtoms';
import { QuestionPanel } from '../QuestionPanel/QuestionPanel';
import { QuestionsPanel } from '../QuestionsPanel/QuestionsPanel';

export const TestFlow: FC = () => {
  const testId = useTestId();

  const [tryId, setTryId] = useTestAtom(testActiveTryId);
  const setFinished = useSetTestAtom(testActiveTryFinished);
  const question = useQuestionAtomValue(testQuestionAtom);
  const isAllAnswered = useTestAtomValue(testActiveTryAnswered);

  const [isWarningOpen, setWarningOpen] = useState(false);

  const [isPaused, setPaused] = useTestAtom(testPaused);

  useEffect(
    () => () => {
      setPaused(true);
    },
    [setPaused],
  );

  return (
    <>
      {!tryId && (
        <Button
          onClick={() => {
            setTryId(v4());
          }}
        >
          Start test
        </Button>
      )}
      {!!tryId && (
        <>
          <QuestionsPanel />
          <Divider />

          {question && (
            <Suspense>
              <QuestionPanel
                testId={testId}
                onFinish={() => {
                  if (isAllAnswered) {
                    setFinished(true);
                  } else {
                    setWarningOpen(true);
                  }
                }}
                onRetry={() => {
                  setTryId(v4());
                }}
              />
            </Suspense>
          )}
        </>
      )}
      <Dialog
        onHide={() => {
          setWarningOpen(false);
        }}
        visible={isWarningOpen}
        header={'Finish test?'}
        footer={
          <>
            <Button
              onClick={() => {
                setWarningOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setWarningOpen(false);
                flushSync(() => {
                  setFinished(true);
                });
              }}
            >
              Finish
            </Button>
          </>
        }
      >
        Are you sure you want to finish the test?
        <br />
        There are several unanswered questions left.
      </Dialog>
    </>
  );
};
