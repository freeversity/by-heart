import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './index.css';

const root = document.getElementById('root');

if (!root) throw new Error('No root elem found!');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
