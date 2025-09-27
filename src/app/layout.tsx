import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic';

// Dynamically import the CurrencyProviderWrapper with SSR disabled
const CurrencyProviderWrapper = dynamic(
  () => import('@/providers/CurrencyProviderWrapper'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'PoshPOULE Farms Ltd - Pure Goodness, Eat Fresh, Eat Healthy',
  description: 'Premium organic poultry, fresh eggs, vegetables, and farm-fresh produce. Experience the taste of pure, healthy goodness from our sustainable farm.',
  keywords: 'organic farm, poultry, fresh eggs, vegetables, sustainable farming, healthy food',
  authors: [{ name: 'PoshPOULE Farms Ltd' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body text-body bg-white">
        <CurrencyProviderWrapper>
          {children}
        </CurrencyProviderWrapper>
      </body>
    </html>
  )
}
