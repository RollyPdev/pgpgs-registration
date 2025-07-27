'use client';
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these links:</p>
            <div className="mt-2 space-x-4">
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-800">
                Admin Login
              </Link>
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 