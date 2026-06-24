import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function InstallApp({ isMobile = false }: { isMobile?: boolean }) {
  const { canShowInstall, install, isIOS, isPromptReady } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (!canShowInstall) return null;

  const handleClick = () => {
    if (isIOS) {
      setShowModal(true);
    } else if (isPromptReady) {
      install();
    } else {
      toast('Install option will appear shortly — keep exploring!', {
        icon: '📲',
        duration: 3000,
      });
    }
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={handleClick}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left"
        >
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
          </svg>
          <span>Install App</span>
        </button>
        <IOSModal show={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all"
        title="Install App"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
        </svg>
        Install
      </button>
      <IOSModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function IOSModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Install TravelRoute AI</h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span>Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">⎙</span> in Safari's toolbar.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span>Tap <strong>"Add"</strong> in the top right corner.</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
