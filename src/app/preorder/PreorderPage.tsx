'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const PreorderClient = dynamic(
  () => import('./PreorderClient'),
  { ssr: false }
);

interface PreorderPageProps {
  searchParams: {
    product?: string;
    quantity?: string;
  };
}

export default function PreorderPage({ searchParams }: PreorderPageProps) {
  return <PreorderClient searchParams={searchParams} />;
}
