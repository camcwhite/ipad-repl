import { getTheme, Theme, ThemeType, Color } from "./assets/themes";

const activeTheme = 'Dark 1';

export function getActiveTheme():Theme {
  return getTheme(activeTheme);
}

export function getPropertyFromActiveTheme(propName:string): Color|string|ThemeType {
  return getTheme(activeTheme)[propName];
}

export function getColorFromActiveTheme(propName:string): Color {
  const prop = getTheme(activeTheme)[propName];
  return prop as Color;
}