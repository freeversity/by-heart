import { styled } from '@linaria/react';
import { PrimeReactProvider } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';
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
    <PrimeReactProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <Fallback>
              <Spinner />
            </Fallback>
          }
        >
          <Routes>
            <Route path="/subjs/:subj/defs/:def" element={<Definition />} />
            <Route
              path="/subjs/:subj/lists/:listId/play/*"
              element={<DefListPlay />}
            />
            <Route path="/subjs/:subj/lists/:listId" element={<DefList />} />
            <Route path="/subjs/:subj" element={<Subj />} />
            <Route path="/subjs" element={<Subjs />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

const Fallback = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Spinner = styled(ProgressSpinner)`
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default App;
