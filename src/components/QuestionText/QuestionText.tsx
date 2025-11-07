import type { FC } from 'react';
import Markdown from 'react-markdown';
import remark from 'remark-gfm';
import { useQuestionAtomValue } from '../../hooks/useQuestionIndex';
import { testQuestionTextAtom } from '../../state/tests/testsAtoms';

export const QuestionText: FC<{
  className?: string;
}> = ({ className }) => {
  const qText = useQuestionAtomValue(testQuestionTextAtom);

  return (
    <div className={className}>
      <Markdown remarkPlugins={[remark]}>{qText}</Markdown>
    </div>
  );
};
