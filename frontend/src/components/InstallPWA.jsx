import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaApple } from 'react-icons/fa';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      return; // Already installed and running as app!
    }

    // Check if user previously dismissed in this session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) {
      return;
    }

    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS, show prompt after a short delay if not dismissed
    if (isIosDevice && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTip(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="অ্যাপ ইনস্টল প্রম্পট" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200/90 p-4 shadow-[0_15px_40px_rgba(2,132,199,0.18)]">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Radiation App" className="w-9 h-9 object-contain" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                PWA App
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                ● ১০০% ফ্রি
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">রেডিয়েশন কোচিং অ্যাপ</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              হোমস্ক্রিনে ইনস্টল করে যেকোনো সময় সরাসরি ও দ্রুত ব্যবহার করুন।
            </p>

            {/* iOS Tip Helper */}
            {showIOSTip && (
              <div className="mt-2.5 p-2 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-800 flex items-start gap-2">
                <FaApple className="text-sm mt-0.5 shrink-0" />
                <span>Safari-র নিচে <strong>Share (শেয়ার)</strong> বাটনে চাপ দিয়ে <strong>'Add to Home Screen'</strong> বেছে নিন।</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                <FaDownload className="text-[11px]" />
                অ্যাপ ইনস্টল করুন
              </button>
              <button
                onClick={handleDismiss}
                className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium hover:bg-slate-100 transition-all"
              >
                পরে
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="বন্ধ করুন"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default InstallPWA;
