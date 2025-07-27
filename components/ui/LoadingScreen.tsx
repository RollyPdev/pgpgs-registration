'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingScreen({ isVisible, message = "Signing you in..." }: LoadingScreenProps) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-[9999]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-0"></div>
        <div className="absolute top-10 right-10 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-white/15 rounded-full animate-bounce delay-150"></div>
        <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-white/5 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Logo with pulse animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-6 mx-auto w-32 h-32 flex items-center justify-center">
            <Image
              src="/PGPGS Logo.png"
              alt="PGPGS Logo"
              width={80}
              height={80}
              className="rounded-full animate-spin-slow"
              priority
            />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            {/* Inner ring */}
            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-indigo-300 rounded-full animate-spin animate-reverse"></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2 animate-fade-in">PGPGS Admin Portal</h2>
          <p className="text-lg text-white/80 mb-4">Welcome to the Admin Dashboard</p>
          <p className="text-base text-white/60 font-medium min-h-[24px]">
            {message}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-80 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-loading-bar"></div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm">50th Golden Anniversary Registration System</p>
        <p className="text-white/40 text-xs mt-1">Powered by PGPGS</p>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}
