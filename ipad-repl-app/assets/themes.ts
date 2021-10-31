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
        backgroundSecondary: '#2e2e2e',
        fontPrimary: '#d6d6d6',
        textBackground: '#9e86c8',
        primary: '#b4d273',
        secondary: '#b05279',
        tertiary: '#6c99bb',
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
  return themes.filter((theme) => theme.name === name)[0];
}