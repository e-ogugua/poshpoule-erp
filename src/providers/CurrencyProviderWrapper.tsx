'use client';

import { ReactNode, useEffect, useState } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export default function CurrencyProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  // This ensures we only render the provider on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render the provider until we're on the client side
  if (!isMounted) {
    return <>{children}</>;
  }

  return <CurrencyProvider>{children}</CurrencyProvider>;
}
