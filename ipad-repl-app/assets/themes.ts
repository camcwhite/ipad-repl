export type Color = string;

export type Theme = {
  dark: boolean,
  name: string,
  colors: {
    backgroundPrimary: Color,
    backgroundSecondary: Color,
    fontPrimary: Color,
    primary: Color,
  }
};

const themes: Array<Theme> =
  [
    {
      dark: true,
      name: 'Dark 1',
      colors: {
        backgroundPrimary: '#39375B',
        backgroundSecondary: '#745C97',
        fontPrimary: '#F5B0CB',
        primary: '#F5B0CB',
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