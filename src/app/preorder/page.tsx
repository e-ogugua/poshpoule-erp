import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Disable SSR for the preorder page to avoid hydration issues
const PreorderClient = dynamic(
  () => import('./PreorderClient'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Pre-Order | Posh Poule Farms',
  description: 'Pre-order fresh farm products from Posh Poule Farms',
};

export default function PreorderPage({
  searchParams,
}: {
  searchParams: { product?: string; quantity?: string };
}) {
  return <PreorderClient searchParams={searchParams} />;
}
