import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { AuthProvider } from '@/providers/AuthProvider';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://poshpoule-farms.vercel.app'),
  title: {
    default: 'PoshPOULE Farms - Organic Poultry & Fresh Produce',
    template: '%s | PoshPOULE Farms'
  },
  description: 'Premium organic poultry, fresh eggs, vegetables, and farm-fresh produce. Experience the taste of pure, healthy goodness from our sustainable farm.',
  keywords: 'organic farm, poultry, fresh eggs, vegetables, sustainable farmer, healthy food',
  authors: [{ name: 'PoshPOULE Farms Ltd' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't wrap admin routes with the default layout
  if (isAdminRoute()) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" className="h-full">
      <body className={`h-full ${isAdminRoute() ? 'bg-gray-50' : ''}`}>
        <AuthProvider session={session}>
          <CurrencyProviderWrapper>
            {children}
          </CurrencyProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
