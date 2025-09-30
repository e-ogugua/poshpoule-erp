'use client';

import { CurrencyProvider } from '@/contexts/CurrencyContext';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the page content component to avoid SSR issues
const PreorderPageContent = dynamic(
  () => import('./page-content'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export default function PreorderClient() {
  const searchParams = useSearchParams();
  
  // Get search params safely
  const product = searchParams?.get('product') || '';
  const quantity = searchParams?.get('quantity') || '';

  return (
    <CurrencyProvider>
      <PreorderPageContent searchParams={{ product, quantity }} />
    </CurrencyProvider>
  );
}
