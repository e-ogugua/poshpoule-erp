import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import dynamic from 'next/dynamic';

// Define viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

// Check if the current route is under /admin
const isAdminRoute = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/admin');
  }
  try {
    const headersList = headers();
    const pathname = headersList.get('x-pathname') || '';
    return pathname.startsWith('/admin');
  } catch (e) {
    // If we can't access headers, default to false
    return false;
  }
};

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
  // Don't wrap admin routes with the default layout
  if (isAdminRoute()) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="font-body text-body bg-white">
        <CurrencyProviderWrapper>
          {children}
        </CurrencyProviderWrapper>
      </body>
    </html>
  );
}
