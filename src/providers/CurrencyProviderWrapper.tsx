'use client';

import { ReactNode, useEffect, useState } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger } from '@/utils/debug';

export default function CurrencyProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugLogger.info('CurrencyProviderWrapper mounting');
    
    try {
      setIsMounted(true);
      debugLogger.info('CurrencyProviderWrapper mounted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      debugLogger.error('CurrencyProviderWrapper mounting failed', err);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">💱</div>
          <h1 className="font-heading text-2xl font-heading-bold text-neutral-900 mb-2">
            Currency System Error
          </h1>
          <p className="text-body text-neutral-600 mb-6">
            There was an issue loading the currency system. The site will work with default settings.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full btn-primary"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-neutral-500">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-neutral-100 rounded text-xs overflow-auto">
                {error}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Don't render the provider until we're on the client side
  if (!isMounted) {
    debugLogger.info('CurrencyProviderWrapper waiting for client-side mount');
    return <>{children}</>;
  }

  debugLogger.info('CurrencyProviderWrapper rendering provider');
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        debugLogger.error('CurrencyProvider ErrorBoundary caught error', {
          error: error.message,
          componentStack: errorInfo.componentStack
        });
      }}
    >
      <CurrencyProvider>{children}</CurrencyProvider>
    </ErrorBoundary>
  );
}
