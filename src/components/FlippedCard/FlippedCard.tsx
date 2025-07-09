import { useAtom } from 'jotai';
import type { FC } from 'react';
import { definitionAtom } from '../../state/currentDef/atoms';
import { WordDef } from '../WordDef';

export const FlippedCard: FC<{
  def: string;
  subj: string;
  className?: string;
  detailed?: boolean;
}> = ({ def, subj, className, detailed }) => {
  const [defPayload] = useAtom(definitionAtom({ subj, def }));

  return (
    <WordDef
      def={defPayload}
      className={className}
      lang={subj}
      detailed={detailed}
    />
  );
};
