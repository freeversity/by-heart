import { styled } from '@linaria/react';
import { useAtom, useAtomValue } from 'jotai';
import { Button } from 'primereact/button';
import { type FC, Fragment, useState } from 'react';
import Markdown from 'react-markdown';
import remark from 'remark-gfm';
import type { Question } from '../../api/tests';
import { Colors } from '../../consts/colors';
import {
  currentTestQuestionAtom,
  currentTestTextAtom,
} from '../../state/currentTest/atoms';
import { QuestionAudio } from '../QuestionAudio/QuestionAudio';

export const QuestionPanel: FC<{
  testId: string;
  question: Question;
  index: number;
  answer: number | undefined;
  onAnswer: (q: number, option: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
  correctAnswer?: number;
}> = ({
  testId,
  question,
  index: qIndex,
  onAnswer,
  answer,
  onNext,
  onPrev,
  onFinish,
  correctAnswer,
}) => {
  const qText = useAtomValue(
    currentTestTextAtom({ index: qIndex, id: testId }),
  );

  const { points } =
    useAtomValue(currentTestQuestionAtom({ index: qIndex, id: testId })) ?? {};

  return (
    <div>
      <Heading>
        Question #{qIndex} ({points} points)
      </Heading>
      {question?.images?.map((imgUrl, index) => (
        <Img
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          src={`https://cdn.freeversity.io/tests/${testId}/${imgUrl}`}
          alt="blah"
        />
      ))}
      {qText && !question.audio && (
        <Markdown remarkPlugins={[remark]}>{qText}</Markdown>
      )}
      {question?.audio?.map((src, index) => (
        <QuestionAudio
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={`${src}-${index}`}
          src={`https://cdn.freeversity.io/tests/${testId}/${src}`}
          subPath={`https://cdn.freeversity.io/tests/${testId}/${question.text}`}
          subs={qText}
          subsOpen={correctAnswer !== undefined}
        />
      ))}
      <Answers>
        {question?.options.map((option, index) => (
          <Answer
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            data-correct={correctAnswer === index}
            data-incorrect={
              correctAnswer !== undefined &&
              correctAnswer !== index &&
              answer === index
            }
          >
            <AnswerLabel>
              <Option
                name={question.index}
                type="radio"
                value={index}
                checked={answer === index}
                disabled={correctAnswer !== undefined}
                onChange={() => {
                  onAnswer(qIndex, index);
                }}
              />
              {option}
            </AnswerLabel>
          </Answer>
        ))}
      </Answers>
      {onPrev && <Button onClick={onPrev}>Prev</Button>}
      {onNext && <Button onClick={onNext}>Next</Button>}
      {onFinish && <Button onClick={onFinish}>Finish</Button>}
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
