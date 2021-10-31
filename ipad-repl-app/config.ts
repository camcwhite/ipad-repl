import { getTheme, Theme, Color } from "./assets/themes";

const activeTheme = 'Monokai';

export function getActiveTheme():Theme {
  return getTheme(activeTheme);
}