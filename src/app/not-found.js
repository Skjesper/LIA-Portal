'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

// Komponenten som använder useSearchParams
function NotFoundContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Sidan kunde inte hittas';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          404 - Sidan hittades inte
        </h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-5">
          <Link 
            href="/" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}

// Huvudkomponenten som wrappar innehållet med Suspense
export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900">
          404 - Sidan hittades inte
        </h1>
        <p className="mt-2 text-sm text-gray-600">Laddar...</p>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}