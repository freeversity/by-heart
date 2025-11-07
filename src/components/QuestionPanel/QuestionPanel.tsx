import { styled } from '@linaria/react';
import { Button } from 'primereact/button';
import { type FC, Suspense } from 'react';
import { Colors } from '../../consts/colors';
import {
  useQuestionAtom,
  useQuestionAtomValue,
  useQuestionIndexParam,
} from '../../hooks/useQuestionIndex';
import { useTestAtom, useTestAtomValue } from '../../hooks/useTestId';
import {
  testActiveTryAnswered,
  testActiveTryFinished,
  testActiveTryQuestionAnswer,
} from '../../state/tests/testActiveTryAtoms';
import {
  testPaused,
  testQuestionAtom,
  testQuestionsCount,
} from '../../state/tests/testsAtoms';
import { QuestionAudio } from '../QuestionAudio/QuestionAudio';
import { QuestionText } from '../QuestionText/QuestionText';

export const QuestionPanel: FC<{
  testId: string;
  onFinish: () => void;
  onRetry: () => void;
}> = ({ testId, onFinish, onRetry }) => {
  const [qIndex, setQIndex] = useQuestionIndexParam();

  const isFinished = useTestAtomValue(testActiveTryFinished);
  const [answer, setAnswer] = useQuestionAtom(testActiveTryQuestionAnswer);
  const questionsCount = useTestAtomValue(testQuestionsCount);
  const {
    points,
    images,
    audio,
    options,
    text,
    answer: correctAnswer,
  } = useQuestionAtomValue(testQuestionAtom) ?? {};
  const isAllAnswered = useTestAtomValue(testActiveTryAnswered);

  const [isPaused, setPaused] = useTestAtom(testPaused);

  return (
    <div>
      {isPaused && !isFinished && (
        <PauseWarning>
          <p>The test is paused. Would you like to proceed?</p>
          <Button
            onClick={() => {
              setPaused(false);
            }}
          >
            Continue test
          </Button>
        </PauseWarning>
      )}

      <QuestionContent data-paused={isPaused && !isFinished}>
        <Heading>
          Question #{qIndex} ({points} points)
        </Heading>
        {images?.map((imgUrl, index) => (
          <Img
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            src={`https://cdn.freeversity.io/tests/${testId}/${imgUrl}`}
            alt="blah"
          />
        ))}
        {!audio && !!text && (
          <Suspense>
            <QuestionText />
          </Suspense>
        )}
        {audio?.map((src, index) => (
          <QuestionAudio
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`${src}-${index}`}
            src={`https://cdn.freeversity.io/tests/${testId}/${src}`}
            subPath={`https://cdn.freeversity.io/tests/${testId}/${text}`}
            subsOpen={isFinished}
          />
        ))}
        <Answers>
          {options?.map((option, index) => (
            <Answer
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              data-correct={isFinished && correctAnswer === index}
              data-incorrect={
                isFinished && correctAnswer !== index && answer === index
              }
            >
              <AnswerLabel>
                <Option
                  name={`${index}`}
                  type="radio"
                  value={index}
                  checked={answer === index}
                  disabled={isFinished}
                  onChange={() => {
                    setAnswer(index);
                  }}
                />
                {option}
              </AnswerLabel>
            </Answer>
          ))}
        </Answers>
      </QuestionContent>
      {!isPaused && (
        <Footer>
          {qIndex > 1 && (
            <Button
              onClick={() => {
                setQIndex(qIndex - 1);
              }}
            >
              Prev
            </Button>
          )}
          {qIndex < questionsCount && (
            <Button
              onClick={() => {
                setQIndex(qIndex + 1);
              }}
            >
              Next
            </Button>
          )}
          {!isFinished && (
            <Button
              severity={isAllAnswered ? 'success' : 'danger'}
              onClick={onFinish}
            >
              Finish
            </Button>
          )}
          {isFinished && <Button onClick={onRetry}>Retry</Button>}
        </Footer>
      )}
    </div>
  );
};

const PauseWarning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const QuestionContent = styled.div`
  position: relative;

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

const Heading = styled.h2`
  font-size: 18px;
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 40vh;
  min-height: 300px;
`;

const Answers = styled.ul`
  padding: 0;
  margin: 0 auto;
  max-width: 600px;
  list-style: none;
  text-align: left;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Answer = styled.li`
  &:not(:first-child) {
    border-top: 1px solid ${Colors.gray[2]};
  }

  &[data-correct="true"] {
    color: ${Colors.green[6]};
    font-weight: bold;
  }

  &[data-incorrect="true"] {
    color: ${Colors.red[6]};
    font-weight: bold;
  }
`;

const AnswerLabel = styled.label`
  padding: 10px;
  display: block;
  display: flex;
  gap: 10px;
`;

const Option = styled.input``;
