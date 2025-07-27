import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-xl animate-pulse animation-delay-150"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse animation-delay-300"></div>
      </div>
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Logo with enhanced animations */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-full blur-2xl scale-150 animate-pulse"></div>
          <div className="relative overflow-hidden rounded-full">
            <Image
              src="/gold.png"
              alt="PGPGS Gold Logo"
              width={140}
              height={140}
              className="animate-[float_3s_ease-in-out_infinite]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] opacity-0"></div>
          </div>
          
          {/* Multiple spinning rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 border-4 border-amber-200/50 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute w-32 h-32 border-2 border-yellow-300/50 border-b-transparent rounded-full animate-spin animation-delay-150 animate-reverse"></div>
            <div className="absolute w-28 h-28 border border-amber-400/30 border-r-transparent rounded-full animate-spin animation-delay-300"></div>
          </div>
        </div>
        
        {/* Enhanced text with animations */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent animate-pulse">
            Pi Gamma Phi Gamma Sigma
          </h1>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">Loading Registration Portal</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-150"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-300"></div>
              </div>
              <p className="text-slate-600 ml-2">Preparing your experience</p>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
} 