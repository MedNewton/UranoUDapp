import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from '@/App';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
