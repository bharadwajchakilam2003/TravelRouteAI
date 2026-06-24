import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, themes } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        title="Change Theme"
      >
        <div
          className="w-5 h-5 rounded-full shadow-md"
          style={{ background: theme.gradient }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-[100]"
            >
              <div className="px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Theme</h3>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                {themes.map(t => {
                  const active = theme.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setOpen(false); }}
                      className="flex flex-col items-center gap-1.5 group"
                      title={t.name}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl shadow-md transition-all duration-200 ${
                          active ? 'scale-110' : 'group-hover:scale-110 group-hover:shadow-lg'
                        }`}
                        style={{
                          background: t.gradient,
                          boxShadow: active ? `0 0 0 2px white, 0 0 0 4px ${t.primary}` : '',
                        }}
                      />
                      <span className={`text-[10px] font-medium text-center leading-tight ${
                        active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {t.icon} {t.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">{theme.icon}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{theme.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">
                    {theme.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
