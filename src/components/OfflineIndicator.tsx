import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      reconnectTimer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  const handleRetryConnection = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        setIsOnline(true);
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    }, 800);
  };

  // Reconnected Toast
  if (showReconnected && isOnline) {
    return (
      <div className="no-print fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-900/90 text-white backdrop-blur-md px-3.5 py-2.5 text-xs font-semibold shadow-xl border border-emerald-700/80 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Connected — Back online</span>
      </div>
    );
  }

  // Offline Mode Toast
  if (!isOnline) {
    return (
      <div className="no-print fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-white font-bold leading-tight">Offline Mode</span>
            <span className="text-[10px] text-slate-300 font-normal">All calculations & saved data work offline</span>
          </div>
        </div>

        <button
          onClick={handleRetryConnection}
          disabled={isRetrying}
          className="ml-1 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-600 transition-colors text-[11px]"
          title="Check network connection"
        >
          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isRetrying ? 'Checking...' : 'Check'}</span>
        </button>
      </div>
    );
  }

  return null;
};
