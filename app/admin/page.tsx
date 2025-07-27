'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors and set loading state
    setError('');
    setIsLoading(true);
    
    console.log('Setting loading state to true');
    console.log('Attempting login with credentials:', { username: credentials.username, password: credentials.password ? '***' : 'empty' });
    
    try {
      console.log('Making API request to /api/auth');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);

      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful, user data:', { id: userData.id, name: userData.name, role: userData.role });
        
        // Store JWT token and user data
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userId', userData.id.toString());
        
        console.log('Stored auth data in localStorage, redirecting...');
        
        // Small delay to show the loading state before redirect
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      } else {
        const errorData = await response.json();
        console.log('Login error data:', errorData);
        setError(errorData.error || 'Invalid credentials');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Image
            src="/PGPGS Logo.png"
            alt="PGPGS Logo"
            width={80}
            height={80}
            className="mx-auto rounded-full mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">PGPGS Registration System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Use the credentials you created in the admin dashboard
        </div>
      </div>
    </div>
  );
}
