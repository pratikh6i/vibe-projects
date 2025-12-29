export type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  fontFamily: string;
  backgroundGradient: string;
};

const PALETTES = [
  {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    accent: '#ec4899', // Pink
    backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  },
  {
    primary: '#0ea5e9', // Sky
    secondary: '#2dd4bf', // Teal
    accent: '#f59e0b', // Amber
    backgroundGradient: 'linear-gradient(135deg, #082f49 0%, #064e3b 100%)',
  },
  {
    primary: '#ef4444', // Red
    secondary: '#f97316', // Orange
    accent: '#eab308', // Yellow
    backgroundGradient: 'linear-gradient(135deg, #450a0a 0%, #431407 100%)',
  },
  {
    primary: '#10b981', // Emerald
    secondary: '#3b82f6', // Blue
    accent: '#d946ef', // Fuchsia
    backgroundGradient: 'linear-gradient(135deg, #064e3b 0%, #172554 100%)',
  },
];

const FONTS = [
  'Inter, sans-serif',
  'Outfit, sans-serif',
  'Roboto, sans-serif',
  'Playfair Display, serif',
];

export function generateTheme(seed: string): Theme {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const paletteIndex = Math.abs(hash) % PALETTES.length;
  const fontIndex = Math.abs(hash >> 2) % FONTS.length;

  return {
    ...PALETTES[paletteIndex],
    fontFamily: FONTS[fontIndex],
  };
}
