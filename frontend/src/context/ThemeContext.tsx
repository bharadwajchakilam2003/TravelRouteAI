import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  mode: 'dark' | 'light';
  icon: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  borderRadius: string;
  cardBg: string;
  cardBorder: string;
  containerWidth: string;
  textColor: string;
  mutedColor: string;
}

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Deep Blue',
    mode: 'dark',
    icon: '🌙',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: 'rgba(59, 130, 246, 0.15)',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    gradientFrom: '#3b82f6',
    gradientTo: '#6366f1',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    fontSize: '16px',
    borderRadius: '16px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(55, 65, 81, 0.3)',
    containerWidth: '88rem',
    textColor: '#e0e7ff',
    mutedColor: '#94a3b8',
  },
  {
    id: 'light',
    name: 'Light Blue',
    mode: 'light',
    icon: '☀️',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: 'rgba(37, 99, 235, 0.12)',
    gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    gradientFrom: '#2563eb',
    gradientTo: '#7c3aed',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    fontSize: '16px',
    borderRadius: '16px',
    cardBg: 'rgba(255, 255, 255, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    containerWidth: '88rem',
    textColor: '#1e293b',
    mutedColor: '#64748b',
  },
  {
    id: 'orange',
    name: 'Orange Glow',
    mode: 'dark',
    icon: '🍊',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: 'rgba(249, 115, 22, 0.18)',
    gradient: 'linear-gradient(135deg, #f97316, #f59e0b)',
    gradientFrom: '#f97316',
    gradientTo: '#f59e0b',
    fontFamily: "'Outfit', system-ui, sans-serif",
    headingFont: "'Outfit', system-ui, sans-serif",
    fontSize: '16.5px',
    borderRadius: '14px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(120, 80, 30, 0.3)',
    containerWidth: '88rem',
    textColor: '#fef3c7',
    mutedColor: '#d6a354',
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    mode: 'dark',
    icon: '🌅',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    primaryLight: 'rgba(245, 158, 11, 0.18)',
    gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
    gradientFrom: '#f59e0b',
    gradientTo: '#eab308',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    headingFont: "'DM Sans', system-ui, sans-serif",
    fontSize: '16px',
    borderRadius: '14px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(130, 100, 30, 0.3)',
    containerWidth: '88rem',
    textColor: '#fef9c3',
    mutedColor: '#c8a84e',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    mode: 'dark',
    icon: '🌊',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    primaryLight: 'rgba(6, 182, 212, 0.18)',
    gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
    gradientFrom: '#06b6d4',
    gradientTo: '#14b8a6',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    headingFont: "'Space Grotesk', system-ui, sans-serif",
    fontSize: '15.5px',
    borderRadius: '14px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(20, 100, 120, 0.3)',
    containerWidth: '88rem',
    textColor: '#cffafe',
    mutedColor: '#5eead4',
  },
  {
    id: 'forest',
    name: 'Forest',
    mode: 'dark',
    icon: '🌲',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    primaryLight: 'rgba(34, 197, 94, 0.18)',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    gradientFrom: '#22c55e',
    gradientTo: '#10b981',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    fontSize: '15.5px',
    borderRadius: '12px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(30, 120, 50, 0.3)',
    containerWidth: '88rem',
    textColor: '#dcfce7',
    mutedColor: '#86efac',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    mode: 'dark',
    icon: '🌇',
    primary: '#ec4899',
    primaryHover: '#db2777',
    primaryLight: 'rgba(236, 72, 153, 0.18)',
    gradient: 'linear-gradient(135deg, #ec4899, #a855f7)',
    gradientFrom: '#ec4899',
    gradientTo: '#a855f7',
    fontFamily: "'Playfair Display', Georgia, serif",
    headingFont: "'Playfair Display', Georgia, serif",
    fontSize: '16px',
    borderRadius: '14px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(150, 50, 100, 0.3)',
    containerWidth: '88rem',
    textColor: '#fce7f3',
    mutedColor: '#f9a8d4',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    mode: 'dark',
    icon: '🌌',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: 'rgba(99, 102, 241, 0.18)',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    gradientFrom: '#6366f1',
    gradientTo: '#8b5cf6',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    headingFont: "'Space Grotesk', system-ui, sans-serif",
    fontSize: '16px',
    borderRadius: '16px',
    cardBg: 'rgba(17, 24, 39, 0.75)',
    cardBorder: 'rgba(80, 60, 150, 0.3)',
    containerWidth: '88rem',
    textColor: '#e0e7ff',
    mutedColor: '#a5b4fc',
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes[0],
  setTheme: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--gradient-primary', theme.gradient);
  root.style.setProperty('--gradient-from', theme.gradientFrom);
  root.style.setProperty('--gradient-to', theme.gradientTo);
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--heading-font', theme.headingFont);
  root.style.setProperty('--font-size', theme.fontSize);
  root.style.setProperty('--border-radius', theme.borderRadius);
  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--card-border', theme.cardBorder);
  root.style.setProperty('--container-width', theme.containerWidth);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--muted-color', theme.mutedColor);
  root.style.setProperty('--heading-color', theme.textColor);
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('travelroute_theme', theme.id);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('travelroute_theme');
    if (stored) {
      const found = themes.find(t => t.id === stored);
      if (found) return found;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const legacy = localStorage.getItem('dark_mode');
    if (legacy === 'false') return themes.find(t => t.id === 'light') || themes[1];
    return prefersDark ? themes[0] : themes[1];
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (id: string) => {
    const found = themes.find(t => t.id === id);
    if (found) setThemeState(found);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
