import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { DefList } from './pages/DefList';
import { DefListPlay } from './pages/DefListPlay';
import { Definition } from './pages/Definition';
import { Home } from './pages/Home';
import { Subj } from './pages/Subj';
import { Subjs } from './pages/Subjs';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <Routes>
          <Route path="/subjs/:subj/defs/:def" element={<Definition />} />
          <Route
            path="/subjs/:subj/lists/:listId/play/:mode"
            element={<DefListPlay />}
          />
          <Route path="/subjs/:subj/lists/:listId" element={<DefList />} />
          <Route path="/subjs/:subj" element={<Subj />} />
          <Route path="/subjs" element={<Subjs />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
