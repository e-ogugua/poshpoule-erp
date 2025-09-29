'use client';

import { CurrencyProvider } from '@/contexts/CurrencyContext';
import dynamic from 'next/dynamic';

// Dynamically import the page content component to avoid SSR issues
const PreorderPageContent = dynamic(
  () => import('./page-content'),
  { ssr: false }
);

export default function PreorderClient({
  searchParams,
}: {
  searchParams: { product?: string; quantity?: string };
}) {
  return (
    <CurrencyProvider>
      <PreorderPageContent searchParams={searchParams} />
    </CurrencyProvider>
  );
}
