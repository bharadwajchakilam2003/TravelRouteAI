import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GA_ID = 'G-SFRZEZQMK0';

function loadGA() {
  if (document.querySelector(`script[src*="${GA_ID}"]`)) return;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', GA_ID);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      loadGA();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGA();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-5 shadow-2xl border border-gray-700/50">
            <p className="text-sm text-gray-300 mb-4">
              We use cookies to improve your experience and analyze site traffic via Google Analytics.
              By clicking "Accept", you consent to our use of cookies.{' '}
              <a href="/privacy-policy" className="text-blue-400 hover:underline">Learn more</a>.
            </p>
            <div className="flex gap-3">
              <button onClick={accept} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Accept
              </button>
              <button onClick={decline} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}