import React, { ReactElement } from 'react';
import { render, RenderOptions, renderHook as rtlRenderHook, RenderHookOptions } from '@testing-library/react';
import { AuthProvider } from '../context/AuthProvider';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes all providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Mock data for tests
export const mockUser = {
  id: 'user-123',
  username: 'testuser',
  capturedPokemon: [
    { pokemon_id: 1, date_created: new Date('2023-01-01T00:00:00Z') },
    { pokemon_id: 4, date_created: new Date('2023-01-02T00:00:00Z') },
  ],
};

// Custom renderHook function that includes all providers
const customRenderHook = <TResult, TProps>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>
) => rtlRenderHook(callback, { wrapper: AllProviders, ...options });

export { customRender as render, customRenderHook as renderHook };
