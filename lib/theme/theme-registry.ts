export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  previewColors: {
    bg: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Purple frost — modern, clean, balanced',
    isDark: false,
    previewColors: {
      bg: '#f4f2fb',
      primary: '#7950e8',
      secondary: '#807498',
      tertiary: '#6366f1'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Purple and sand on charcoal',
    isDark: true,
    previewColors: {
      bg: '#121110',
      primary: '#a48efa',
      secondary: '#7a7774',
      tertiary: 'hsl(220, 50%, 58%)'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Warm rosy-purple — soft, airy, gentle',
    isDark: false,
    previewColors: {
      bg: '#f8f4fc',
      primary: '#9040d0',
      secondary: '#8c7a9e',
      tertiary: '#7c5ccc'
    }
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    description: 'Deep violet-indigo — crisp, saturated, polished',
    isDark: false,
    previewColors: {
      bg: '#f5f2fb',
      primary: '#5b2ebd',
      secondary: '#706490',
      tertiary: '#5050c8'
    }
  },
  {
    id: 'legacy',
    name: 'Legacy',
    description: 'Original — warm sand neutrals on white',
    isDark: false,
    previewColors: {
      bg: '#f7f7f5',
      primary: '#6f42d6',
      secondary: '#7a7774',
      tertiary: 'hsl(220, 50%, 48%)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
