import type { FC } from 'react';
import { Link } from 'react-router';
import { PageLayout } from '../components/PageLayout';

const frLists = [
  {
    list: 'fr_50k',
    title: 'French 50k',
  },
];

export const Lists: FC = () => {
  return (
    <PageLayout>
      <ul>
        <h2>French</h2>
        <ul>
          {frLists.map(({ list, title }) => (
            <li key={list}>
              <Link to={`/lists/fr/${list}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </ul>
    </PageLayout>
  );
};
