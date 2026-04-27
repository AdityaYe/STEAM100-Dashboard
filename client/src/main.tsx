import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import "./styles/index.css"
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/AuthContext.tsx';
import { AuthModalProvider } from './features/auth/AuthModalContext.tsx';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <BrowserRouter>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthModalProvider>
        <Toaster
  position="top-right"
  gutter={10}
  containerStyle={{
    top: 18,
    zIndex: 999999,
  }}
  toastOptions={{
    duration: 2400,
    icon: null,

    style: {
      background: "transparent",
      color: "inherit",
      boxShadow: "none",
      padding: "0",
      margin: "0",
    },
  }}
/>
        <App />
      </AuthModalProvider>
    </AuthProvider>
  </QueryClientProvider>
  </BrowserRouter>
</React.StrictMode>
);
