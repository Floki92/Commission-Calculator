import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  X, 
  CheckCircle2, 
  ExternalLink,
  Share,
  PlusSquare,
  MoreVertical,
  Layers,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>(() => {
    if (isIOS) return 'ios';
    if (typeof window !== 'undefined' && /android/i.test(navigator.userAgent)) return 'android';
    return 'desktop';
  });

  // If already running as an installed PWA in standalone mode
  if (isInstalled) {
    return (
      <div 
        className="no-print hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
        title="App is installed and running in Standalone PWA mode"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <>
      <button
        onClick={handleClick}
        className="no-print flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-xs hover:shadow-sm active:scale-98"
        title="Install Commission App as a standalone Progressive Web App"
      >
        <Download className="w-3.5 h-3.5 text-red-400" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Installation Guide Modal */}
      {showGuideModal && (
        <div 
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShowGuideModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Install Commission Calculator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Works offline and launches instantly from your home screen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Native prompt button if browser supported it */}
            {isInstallable && (
              <div className="mt-4 p-3 bg-red-50/70 border border-red-100 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Direct install ready:</span> Click to trigger the browser prompt.
                </div>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="shrink-0 bg-[#E60000] hover:bg-[#CC0000] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  Install Now
                </button>
              </div>
            )}

            {/* If in an iframe (e.g. preview environment), note that opening standalone enables 1-click install */}
            {isInIframe && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold">Preview Mode Notice:</span> For native 1-click install, open the app in its own browser window.
                </div>
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 font-bold text-amber-900 underline hover:text-amber-950 mt-0.5"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Platform Selector Tabs */}
            <div className="mt-4 flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iOS (Safari)</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  activeTab === 'android'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Tab Instructions */}
            <div className="mt-4 space-y-2.5 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Open this page in <strong className="text-slate-900">Safari</strong> and tap the <strong className="text-slate-900">Share</strong> button at the bottom of the screen.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Scroll down in the share menu and select <strong className="text-slate-900">Add to Home Screen</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Tap <strong className="text-slate-900">Add</strong> in the top-right corner. The app icon will appear on your home screen!
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'android' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      In <strong className="text-slate-900">Chrome</strong>, tap the three dots (<strong className="text-slate-900">⋮</strong>) in the top-right corner.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Select <strong className="text-slate-900">Install app</strong> (or <strong className="text-slate-900">Add to Home screen</strong>).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Confirm installation. The app will launch like a native application with offline support.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'desktop' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      In <strong className="text-slate-900">Chrome</strong> or <strong className="text-slate-900">Edge</strong>, look for the <strong className="text-slate-900">Install icon</strong> (computer monitor with down arrow) on the right side of the address bar.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Or click the browser menu (<strong className="text-slate-900">⋮</strong>) &rarr; <strong className="text-slate-900">Install Commission Calculator</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E60000] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Click <strong className="text-slate-900">Install</strong> to add a desktop shortcut and dedicated window.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* PWA Advantages highlight */}
            <div className="mt-3 flex items-center gap-3 px-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Works Offline
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero App Store Lag
              </span>
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Auto Updates
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
