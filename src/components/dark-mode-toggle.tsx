'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      }}
    >
      <SunIcon className="hidden h-6 w-6 [html.dark_&]:block" />
      <MoonIcon className="hidden h-6 w-6 [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
