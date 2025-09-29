import { Metadata } from 'next';
import PreorderPageComponent from './PreorderPage';

export const metadata: Metadata = {
  title: 'Pre-Order | Posh Poule Farms',
  description: 'Pre-order fresh farm products from Posh Poule Farms',
};

export default function PreorderPage({
  searchParams,
}: {
  searchParams: { product?: string; quantity?: string };
}) {
  return <PreorderPageComponent searchParams={searchParams} />;
}
