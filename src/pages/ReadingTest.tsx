import { styled } from '@linaria/react';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { TestCountdown } from '../components/TestCountdown/TestCountdown';
import { TestFlow } from '../components/TestFlow/TestFlow';
import { useTestAtomValue } from '../hooks/useTestId';
import { testAtom } from '../state/tests/testsAtoms';

export const ReadingTest: FC = () => {
  const { subj, listId } = useParams<{
    testId: string;
    subj: string;
    listId: string;
  }>();

  if (!subj || !listId) throw new Error('No test id');

  const test = useTestAtomValue(testAtom);

  return (
    <PageLayout>
      <Content>
        <Heading>
          <Breadcrumbs>
            <Link to={`/subjs/${subj}`}>{subj}</Link>
            {'>'}
            <Link to={`/subjs/${subj}/lists/${listId}`}>{listId}</Link>
            {'>'}
            Compréhension ecrit #{test?.id.split('-')[1]}
          </Breadcrumbs>
          <TestCountdown />
        </Heading>
        <Divider />

        <TestFlow />
      </Content>
    </PageLayout>
  );
};

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Breadcrumbs = styled.div`
  text-align: left;
`;

const Content = styled(Panel)`
  max-width: 1200px;
  margin: 0 auto;
`;
