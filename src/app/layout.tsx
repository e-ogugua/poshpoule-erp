import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { AuthProvider } from '@/providers/AuthProvider';
import { validateEnvironment } from '@/lib/env-validation';
import './globals.css';
import LayoutClient from '@/components/LayoutClient';

// Configure fonts with Next.js font optimization
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
});

// Define viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

// Check if the current route is under /admin
const isAdminRoute = async () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/admin');
  }
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    return pathname.startsWith('/admin');
  } catch (e) {
    // If we can't access headers, default to false
  }
};


export const metadata: Metadata = {
  title: {
    default: 'PoshPOULE Farms - Premium Organic Poultry & Fresh Produce',
    template: '%s | PoshPOULE Farms',
  },
  description: 'Premium organic poultry, fresh eggs, vegetables, and farm-fresh produce. Experience the taste of pure, healthy goodness from our sustainable farm.',
  keywords: 'organic farm, poultry, fresh eggs, vegetables, sustainable farmer, healthy food',
  authors: [{ name: 'PoshPOULE Farms Ltd' }],
  other: {
    'google-fonts': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@300;400;500;600;700&display=swap',
  },
};

export default async function RootLayout({
  children,
}: {
}) {
  // Validate environment variables early - this will throw if any are missing
  validateEnvironment();

  const session = await getServerSession(authOptions);
  const isAdmin = await isAdminRoute();
  const bodyClass = isAdmin ? 'min-h-screen bg-background font-sans antialiased bg-gray-100' : 'min-h-screen bg-background font-sans antialiased';

  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body className={bodyClass}>
        <AuthProvider session={session}>
          <LayoutClient session={session}>
            {children}
          </LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
