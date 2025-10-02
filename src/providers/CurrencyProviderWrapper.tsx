import { ReactNode } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Session } from 'next-auth';

interface CurrencyProviderWrapperProps {
  children: ReactNode;
  session: Session | null;
}

export default function CurrencyProviderWrapper({
  children,
  session,
}: CurrencyProviderWrapperProps) {
  return <CurrencyProvider session={session}>{children}</CurrencyProvider>;
}
