import type { FC } from 'react';
import { Link } from 'react-router';
import { PageLayout } from '../components/PageLayout';

export const Home: FC = () => {
  return (
    <PageLayout>
      Hello!
      <ul>
        <li>
          <Link to="/lists">to Lists</Link>
        </li>
      </ul>
    </PageLayout>
  );
};
