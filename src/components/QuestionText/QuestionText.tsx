import { useAtomValue } from 'jotai';
import type { FC } from 'react';
import Markdown from 'react-markdown';
import remark from 'remark-gfm';
import {
  currentQuestionIndexAtom,
  currentTestIdAtom,
  testQuestionTextAtom,
} from '../../state/currentTest/atoms';

export const QuestionText: FC<{
  className?: string;
}> = ({ className }) => {
  const qIndex = useAtomValue(currentQuestionIndexAtom);
  const testId = useAtomValue(currentTestIdAtom);

  const qText = useAtomValue(
    testQuestionTextAtom({ testId, questionIndex: qIndex }),
  );

  return (
    <div className={className}>
      <Markdown remarkPlugins={[remark]}>{qText}</Markdown>
    </div>
  );
};
