import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'primereact/resources/themes/lara-dark-amber/theme.css';

import App from './App.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </PrimeReactProvider>
  </StrictMode>
);
