import type { FC } from 'react';

import { Route, Routes } from 'react-router';
import { ForwardGame } from '../components/ForwardGame';
import { ReverseGame } from '../components/ReverseGame/ReverseGame';
import { SpellingGame } from '../components/SpellingGame';

export const DefListPlay: FC = () => {
  return (
    <Routes>
      <Route path="/forward" element={<ForwardGame />} />
      <Route path="/reverse" element={<ReverseGame />} />
      <Route path="/spelling" element={<SpellingGame />} />
    </Routes>
  );
};
