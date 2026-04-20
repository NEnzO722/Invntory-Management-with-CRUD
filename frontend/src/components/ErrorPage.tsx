import React from 'react';

interface ErrorPageProps {
  code?: number | string;
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  code = 500, 
  message = "Something went wrong on our end.", 
  onRetry 
}) => {
  const getErrorTitle = (errCode: number | string) => {
    switch (errCode.toString()) {
      case '404': return 'Page Not Found';
      case '402': return 'Payment Required';
      case '403': return 'Access Forbidden';
      case '500': return 'Server Overload';
      default: return 'Unexpected Error';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-moonlight-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/premium_error_background_1776691176145.png" 
          alt="Error Background" 
          className="w-full h-full object-cover opacity-60 scale-110 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moonlight-950/20 via-moonlight-950/60 to-moonlight-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-8 text-center animate-scale-in">
        <div className="mb-8 inline-block">
          <div className="glass p-6 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl animate-float">
            <span className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-ethereal to-mocha/50 drop-shadow-2xl">
              {code}
            </span>
          </div>
        </div>

        <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
          {getErrorTitle(code)}
        </h1>
        
        <p className="text-xl text-mocha-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onRetry || (() => window.location.reload())}
            className="btn-primary px-12 h-18 text-lg min-w-[200px] justify-center"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          
          <button 
             onClick={() => window.history.back()}
             className="px-12 py-5 rounded-[1.5rem] font-bold text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-ethereal/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-mocha/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '-2s' }} />
    </div>
  );
};

export default ErrorPage;
