import React from "react";
import { ImageSourcePropType } from "react-native";
import monokai_img from './assets/Monokai_sc.png';
import atom_img from './assets/Atom_One_Light_sc.png';

export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_THEME = 'monokai';

type Color = string;

export type Theme = {
  name: string,
  dark: boolean,
  preview: ImageSourcePropType,
  colors: {
    backgroundPrimary: Color,
    backgroundContrast: Color,
    fontPrimary: Color,
    primary: Color,
    secondary: Color,
    tertiary: Color,
  }
};


const themes = new Map<string, Theme>([
  ['monokai',
    {
      name: 'Monokai',
      dark: true,
      preview: monokai_img,
      colors: {
        backgroundPrimary: '#2e2e2e',
        backgroundContrast: '#797979',
        fontPrimary: '#d6d6d6',
        primary: '#b4d273',
        secondary: '#b05279',
        tertiary: '#6c99bb',
      }
    }],
  ['atomOneLight', {
    name: 'Atom One Light',
    dark: false,
    preview: atom_img,
    colors: {
      backgroundPrimary: '#FFFFFF',
      backgroundContrast: '#000000',
      fontPrimary: '#383A42',
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
 * Get a map of all themes (key:string -> Theme) in no particular order
 * @returns all color themes
 */
export const getAllThemes = (): Map<string, Theme> => {
  return new Map(themes);
}

export const ThemeContext = React.createContext({ activeTheme: getTheme(DEFAULT_THEME), activeThemeKey: DEFAULT_THEME, changeTheme: (newThemeName: string) => { } });

export const FontContext = React.createContext({ fontSize: DEFAULT_FONT_SIZE, setFontSize: (newFontSize: number) => { } })