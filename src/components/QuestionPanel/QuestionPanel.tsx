import { styled } from '@linaria/react';
import { useAtomValue } from 'jotai';
import { Button } from 'primereact/button';
import { type FC, Suspense } from 'react';
import { Colors } from '../../consts/colors';
import {
  currentQuestionIndexAtom,
  currentTestAnswered,
  currentTestFinishedAtom,
  currentTestQuestionAtom,
} from '../../state/currentTest/atoms';
import { QuestionAudio } from '../QuestionAudio/QuestionAudio';
import { QuestionText } from '../QuestionText/QuestionText';

export const QuestionPanel: FC<{
  testId: string;
  answer: number | undefined;
  onAnswer: (q: number, option: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
  onRetry?: () => void;
}> = ({ testId, onAnswer, answer, onNext, onPrev, onFinish, onRetry }) => {
  const qIndex = useAtomValue(currentQuestionIndexAtom);

  const isFinished = useAtomValue(currentTestFinishedAtom);

  const {
    points,
    images,
    audio,
    options,
    text,
    answer: correctAnswer,
  } = useAtomValue(currentTestQuestionAtom) ?? {};

  const isAllAnswered = useAtomValue(currentTestAnswered);

  return (
    <div>
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
                  onAnswer(qIndex, index);
                }}
              />
              {option}
            </AnswerLabel>
          </Answer>
        ))}
      </Answers>
      <Footer>
        {onPrev && <Button onClick={onPrev}>Prev</Button>}
        {onNext && <Button onClick={onNext}>Next</Button>}
        {onFinish && (
          <Button
            severity={isAllAnswered ? 'success' : 'danger'}
            onClick={onFinish}
          >
            Finish
          </Button>
        )}
        {onRetry && <Button onClick={onRetry}>Retry</Button>}
      </Footer>
    </div>
  );
};

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
