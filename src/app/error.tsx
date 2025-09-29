'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-700 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go to home
          </a>
        </div>
      </div>
    </div>
  );
}
