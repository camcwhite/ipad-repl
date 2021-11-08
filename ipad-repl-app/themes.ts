import React from "react";
export const DEFAULT_THEME = 'monokai';

type Color = string;

export type Theme = {
  name: string,
  dark: boolean,
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


const themes = new Map<string, Theme>([
  ['monokai', 
  {
    name: 'monokai',
    dark: true,
    colors: {
      backgroundPrimary: '#2e2e2e',
      backgroundSecondary: '#2e2e2e',
      fontPrimary: '#d6d6d6',
      textBackground: '#9e86c8',
      primary: '#b4d273',
      secondary: '#b05279',
      tertiary: '#6c99bb',
    }
  }],
  ['atomOneLight', {
    name: 'atomOneLight',
    dark: false,
    colors: {
      backgroundPrimary: '#FFFFFF',
      backgroundSecondary: '#EEEEEE',
      fontPrimary: '#383A42',
      textBackground: '#000000',
      primary: '#A626A4',
      secondary: '#50A14F',
      tertiary: '#C18401',
    }
  }],
]);

export const getTheme = (name: string): Theme => {
  const theme = themes.get(name);
  if (theme) { return theme }
  return getTheme(DEFAULT_THEME);
}

/**
 * Get an array of all ColorThemes in no particular order
 * @returns all color themes
 */
export const getAllThemes = (): Theme[] => {
  return [...themes.values()];
}

export const ThemeContext = React.createContext({activeTheme: getTheme(DEFAULT_THEME), changeTheme:(newThemeName: string) => { }});