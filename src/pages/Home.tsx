import type { FC } from 'react';
import { Navigate } from 'react-router';

export const Home: FC = () => {
  return <Navigate to="/subjs" />;
};
