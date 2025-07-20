'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableColorScheme
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
