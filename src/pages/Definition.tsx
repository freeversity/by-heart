import { styled } from '@linaria/react';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import { useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { WordDef } from '../components/WordDef';
import { currentDefAtom } from '../state/currentDef/atoms';

export const Definition: FC = () => {
  const { def: defEncoded, subj } = useParams();

  if (!defEncoded || !subj) throw new Error('No subject or list id present');

  const defName = decodeURIComponent(defEncoded);

  const [def] = useAtom(currentDefAtom({ def: defName, subj }));

  return (
    <PageLayout>
      <SWordDef def={def} lang={subj} />
    </PageLayout>
  );
};

const SWordDef = styled(WordDef)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;
