import { useEffect, useState } from "react";
import { loadActiveTheme, saveActiveTheme } from "./config";

export type Color = string;

export type Theme = {
  dark: boolean,
  name: string,
  colors: {
    backgroundPrimary: Color,
    backgroundSecondary: Color,
    fontPrimary: Color,
    textBackground: Color,
    primary: Color,
    secondary: Color,
    tertiary: Color,
  }
};

const themes: Array<Theme> =
  [
    {
      dark: true,
      name: 'Monokai',
      colors: {
        backgroundPrimary: '#2e2e2e',
        backgroundSecondary: '#2e2e2e',
        fontPrimary: '#d6d6d6',
        textBackground: '#9e86c8',
        primary: '#b4d273',
        secondary: '#b05279',
        tertiary: '#6c99bb',
      }
    },
    {
      dark: false,
      name: 'Solarized Light',
      colors: {
        backgroundPrimary: '#FDF6E3',
        backgroundSecondary: '#ECE7D5',
        fontPrimary: '#657A81',
        textBackground: '#9e86c8',
        primary: '#586E75',
        secondary: '#B58900',
        tertiary: '#2AA198',
      }
    },
  ];

/**
 * Get a color theme
 * 
 * @param name name of the theme
 * @returns a Theme 
 */
export function getTheme(name: string): Theme {
  const theme = themes.filter((theme) => theme.name === name)[0];
  if (theme) return theme;
  else return getTheme('Monokai');
}

export const useTheme = ():Theme => {
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  useEffect(() => {
    loadActiveTheme()
      .then(setActiveTheme);
  }, [])

  return activeTheme;
}