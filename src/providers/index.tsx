'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { HeroProvider } from './hero-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <HeroProvider>{children}</HeroProvider>
    </QueryProvider>
  );
}

