import { Metadata } from 'next';
import PreorderPage from './PreorderPage';

export const metadata: Metadata = {
  title: 'Pre-Order | Posh Poule Farms',
  description: 'Pre-order fresh farm products from Posh Poule Farms',
};

export const dynamic = 'force-dynamic';

export default function PreorderPageWrapper() {
  return <PreorderPage />;
}
