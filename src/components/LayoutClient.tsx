'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';

// Dynamically import the CurrencyProviderWrapper with SSR disabled
const CurrencyProviderWrapper = dynamic(
  () => import('@/providers/CurrencyProviderWrapper'),
  { ssr: false, loading: () => <div>Loading currency...</div> }
);

interface LayoutClientProps {
  children: ReactNode;
  session: Session | null;
}

export default function LayoutClient({ children, session }: LayoutClientProps) {
  return (
    <CurrencyProviderWrapper session={session}>
      {children}
    </CurrencyProviderWrapper>
  );
}
