'use client';

import { ReactNode } from 'react';
import CurrencyProviderWrapper from '@/providers/CurrencyProviderWrapper';
import { Session } from 'next-auth';

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
