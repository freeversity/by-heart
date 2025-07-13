import { useAtom } from 'jotai';
import type { FC } from 'react';
import { definitionAtom } from '../../state/currentDef/atoms';
import { WordDef } from '../WordDef';

export const FlippedCard: FC<{
  term: string;
  subj: string;
  className?: string;
  detailed?: boolean;
  mode?: string;
  type?: string;
  def?: string;
}> = ({ term, subj, className, detailed, mode, def, type }) => {
  const [defPayload] = useAtom(definitionAtom({ subj, def: term }));

  return (
    <WordDef
      defPayload={defPayload}
      type={type}
      className={className}
      lang={subj}
      detailed={detailed}
      mode={mode}
      def={def}
    />
  );
};
