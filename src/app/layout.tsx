import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger } from '@/utils/debug';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  debugLogger.info('RootLayout rendering');
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            debugLogger.error('Root ErrorBoundary caught error', { 
              error: error.message,
              componentStack: errorInfo.componentStack 
            });
          }}
        >
          <CurrencyProviderWrapper>
            {children}
          </CurrencyProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
