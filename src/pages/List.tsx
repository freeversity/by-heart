import { useAtom } from 'jotai';
import type { FC } from 'react';
import { Link, useParams } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { currentListAtom } from '../state/currentList/atoms';

export const List: FC = () => {
  const { id, subj } = useParams();

  if (!id || !subj) throw new Error('No subject or list id present');

  const [list] = useAtom(currentListAtom({ id, subj }));

  return (
    <PageLayout>
      {subj}/{id}
      <div>
        {list.slice(0, 100).map((item) => (
          <li key={item}>
            <Link to={`/defs/${subj}/${encodeURIComponent(item)}`}>{item}</Link>
          </li>
        ))}
      </div>
    </PageLayout>
  );
};
