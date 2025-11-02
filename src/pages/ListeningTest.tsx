import { styled } from '@linaria/react';
import { useAtom, useAtomValue } from 'jotai';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { type FC, Suspense } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { QuestionPanel } from '../components/QuestionPanel/QuestionPanel';
import { QuestionsPanel } from '../components/QuestionsPanel/QuestionsPanel';
import {
  currentTestAnswersAtom,
  currentTestAtom,
  currentTestFinishedAtom,
  currentTestGradeAtom,
  currentTestQuestionAtom,
  currentTestResult,
} from '../state/currentTest/atoms';

export const ListeningTest: FC = () => {
  const { testId, subj, listId } = useParams<{
    testId: string;
    subj: string;
    listId: string;
  }>();

  if (!testId || !subj || !listId) throw new Error('No test id');

  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams({ q: '1' }),
  );

  const qParam = searchParams.get('q') ?? '1';

  const qIndex = +qParam;

  const [answers, setAnswers] = useAtom(currentTestAnswersAtom(testId));
  const [isFinished, setFinished] = useAtom(currentTestFinishedAtom(testId));
  const question = useAtomValue(
    currentTestQuestionAtom({ id: testId, index: qIndex }),
  );
  const test = useAtomValue(currentTestAtom(testId));

  const result = useAtomValue(currentTestResult(testId));

  const grade = useAtomValue(currentTestGradeAtom(testId));

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
          answers={isFinished ? result : undefined}
          grade={isFinished ? grade : undefined}
          // answers={undefined}
          // grade={undefined}
          timeout={test.timeout}
          active={qIndex}
          onSetActive={(index) => {
            setSearchParams((params) => {
              params.set('q', `${index}`);

              return params;
            });
          }}
          questions={test.questions.map((q, index) => ({
            ...q,
            status: `${index + 1}` in answers ? 'answered' : null,
          }))}
        />
        <Divider />

        {question && (
          <Suspense>
            <QuestionPanel
              testId={testId}
              question={question}
              index={qIndex}
              answer={answers[qIndex]}
              correctAnswer={isFinished ? question.answer : undefined}
              onAnswer={(qIndex, answerIndex) => {
                setAnswers((answers) => ({
                  ...answers,
                  [qIndex]: answerIndex,
                }));
              }}
              onNext={
                qIndex < test.questions.length
                  ? () => {
                      setSearchParams((params) => {
                        params.set('q', `${qIndex + 1}`);

                        return params;
                      });
                    }
                  : undefined
              }
              onPrev={
                qIndex > 1
                  ? () => {
                      setSearchParams((params) => {
                        params.set('q', `${qIndex - 1}`);

                        return params;
                      });
                    }
                  : undefined
              }
              onFinish={
                isFinished
                  ? undefined
                  : () => {
                      setFinished(true);
                    }
              }
            />
          </Suspense>
        )}
      </Content>
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
