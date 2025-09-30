'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const PreorderClient = dynamic(
  () => import('./PreorderClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    ) 
  }
);

export default function PreorderPage() {
  return <PreorderClient />;
}
