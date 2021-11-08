import { useEffect, useState } from "react";
import { loadString } from "../storage";
import { ACTIVE_THEME } from "../storageKeys";

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      backgroundPrimary: Color,
      backgroundSecondary: Color,
      fontPrimary: Color,
      textBackground: Color,
      primary: Color,
      secondary: Color,
      tertiary: Color,
    }

    interface Theme {
      name: string,
      dark: boolean,
      colors: ThemeColors,
    }
  }
}

export const DEFAULT_THEME = 'monokai';

type Color = string;

export type ColorTheme = {
  name: string,
  isDark: boolean,
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

export const Colors = {
  backgroundPrimary: '#2e2e2e',
  backgroundSecondary: '#2e2e2e',
  fontPrimary: '#d6d6d6',
  textBackground: '#9e86c8',
  primary: '#b4d273',
  secondary: '#b05279',
  tertiary: '#6c99bb',
};


const themes = new Map<string, ReactNativePaper.Theme>([
  ['monokai', {
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

// export const useTheme = (): ColorTheme => {
//   const [activeTheme, setActiveTheme] = useState(getTheme(DEFAULT_THEME));

//   useEffect(() => {
//     loadString(ACTIVE_THEME)
//       .then((theme) => setActiveTheme(getTheme(theme))); 
//   });

//   return activeTheme;
// }