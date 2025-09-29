import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminLoading } from '@/components/admin/AdminLoading';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PoshPOULE Farms',
  description: 'Admin dashboard for PoshPOULE Farms management system',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=1" />
      </head>
      <body className="h-full bg-gray-50">
        <ErrorBoundary>
          <Suspense fallback={<AdminLoading />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}
