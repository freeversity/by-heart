import { styled } from '@linaria/react';
import { Card } from 'antd';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import { useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { WordDef } from '../components/WordDef';
import { definitionAtom } from '../state/currentDef/atoms';

export const Definition: FC = () => {
  const { def: defEncoded, subj } = useParams();

  if (!defEncoded || !subj) throw new Error('No subject or list id present');

  const defName = decodeURIComponent(defEncoded);

  const [def] = useAtom(definitionAtom({ def: defName, subj }));

  return (
    <PageLayout>
      <SCard>
        <WordDef defPayload={def} lang={subj} />
      </SCard>
    </PageLayout>
  );
};

const SCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;
