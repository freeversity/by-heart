import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Definition } from './pages/Definition';
import { Home } from './pages/Home';
import { List } from './pages/List';
import { Lists } from './pages/Lists';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <Routes>
          <Route path="/defs/:subj/:def" element={<Definition />} />
          <Route path="/lists/:subj/:id" element={<List />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
