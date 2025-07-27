'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SuccessLoadingScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function SuccessLoadingScreen({ isVisible, onComplete }: SuccessLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Show checkmark after a brief delay
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmark(true);
    }, 500);

    // Animate progress bar
    const progressTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete?.();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }, 800);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(progressTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center z-[9999]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-0"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-white/15 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-150"></div>
        <div className="absolute bottom-10 right-10 w-10 h-10 bg-white/5 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Main success content */}
      <div className="relative z-10 text-center">
        {/* Logo with success glow */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-full p-6 mx-auto w-32 h-32 flex items-center justify-center shadow-2xl">
            <Image
              src="/PGPGS Logo.png"
              alt="PGPGS Logo"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
          </div>
        </div>

        {/* Success checkmark animation */}
        <div className="mb-6 flex justify-center">
          <div className={`relative w-20 h-20 ${showCheckmark ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg 
                className="w-10 h-10 text-white animate-check-draw" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  className="animate-check-path"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Success text */}
        <div className="text-white mb-8">
          <h2 className="text-3xl font-bold mb-2 animate-fade-in-up">Welcome Back!</h2>
          <p className="text-lg text-white/80 mb-2 animate-fade-in-up-delayed">Login Successful</p>
          <p className="text-base text-white/60 animate-fade-in-up-delayed-2">
            Redirecting to your dashboard...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">Loading dashboard... {progress}%</p>
        </div>

        {/* Floating success elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl animate-float-success"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-float-success-delayed"></div>
      </div>

      {/* Success particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes check-path {
          0% { stroke-dasharray: 0 24; }
          100% { stroke-dasharray: 24 0; }
        }
        
        @keyframes float-success {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }
        
        @keyframes float-success-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-35px) scale(0.9); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
        
        .animate-check-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: check-path 0.6s ease-in-out 0.3s forwards;
        }
        
        .animate-float-success {
          animation: float-success 4s ease-in-out infinite;
        }
        
        .animate-float-success-delayed {
          animation: float-success-delayed 5s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
