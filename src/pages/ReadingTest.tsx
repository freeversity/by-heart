import { styled } from '@linaria/react';
import { useAtom, useAtomValue } from 'jotai';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { type FC, Suspense, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { QuestionPanel } from '../components/QuestionPanel/QuestionPanel';
import { QuestionsPanel } from '../components/QuestionsPanel/QuestionsPanel';
import {
  currentTestAnswered,
  currentTestAnswersAtom,
  currentTestAtom,
  currentTestFinishedAtom,
  questionIndexAtom,
} from '../state/currentTest/atoms';

export const ReadingTest: FC = () => {
  const { testId, subj, listId } = useParams<{
    testId: string;
    subj: string;
    listId: string;
  }>();

  if (!testId || !subj || !listId) throw new Error('No test id');

  const [qParam, setSearchParams] = useAtom(questionIndexAtom);

  const [isWarningOpen, setWarningOpen] = useState(false);

  const qIndex = +qParam;

  const [answers, setAnswers] = useAtom(currentTestAnswersAtom);
  const [isFinished, setFinished] = useAtom(currentTestFinishedAtom);
  const { questions, timeout } = useAtomValue(currentTestAtom);
  const isAllAnswered = useAtomValue(currentTestAnswered);

  return (
    <PageLayout>
      <Content>
        <Breadcrumbs>
          <Link to={`/subjs/${subj}`}>{subj}</Link>
          {'>'}
          <Link to={`/subjs/${subj}/lists/${listId}`}>{listId}</Link>
        </Breadcrumbs>
        <Divider />
        <QuestionsPanel
          // answers={undefined}
          // grade={undefined}
          onTimeout={() => {
            setFinished(true);
          }}
        />
        <Divider />

        <Suspense>
          <QuestionPanel
            testId={testId}
            answer={answers[qIndex]}
            onAnswer={(qIndex, answerIndex) => {
              setAnswers({
                ...answers,
                [qIndex]: answerIndex,
              });
            }}
            onNext={
              qIndex < questions.length
                ? () => {
                    setSearchParams(`${qIndex + 1}`);
                  }
                : undefined
            }
            onPrev={
              qIndex > 1
                ? () => {
                    setSearchParams(`${qIndex - 1}`);
                  }
                : undefined
            }
            onFinish={
              isFinished
                ? undefined
                : () => {
                    if (isAllAnswered) {
                      setFinished(true);
                    } else {
                      setWarningOpen(true);
                    }
                  }
            }
            onRetry={
              !isFinished
                ? undefined
                : () => {
                    setFinished(false);
                    setAnswers({});
                    setSearchParams('1');
                  }
            }
          />
        </Suspense>
      </Content>
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
    </PageLayout>
  );
};

const Breadcrumbs = styled.div`
  text-align: left;
`;

const Content = styled(Panel)`
  max-width: 1200px;
  margin: 0 auto;
`;
