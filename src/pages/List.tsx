import { useAtom } from 'jotai';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import { LearnFlow } from '../components/LearnFlow';
import { PageLayout } from '../components/PageLayout';
import { currentListAtom } from '../state/currentList/atoms';

export const List: FC = () => {
  return (
    <PageLayout>
      <LearnFlow />
    </PageLayout>
  );
};
