import { getTheme, Theme, Color } from "./themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_THEME_NAME = 'Monokai';


export function getActiveTheme(): Theme {
  return getTheme(DEFAULT_THEME_NAME);
}

export async function loadActiveTheme():Promise<Theme> {
  const activeThemeStr = await AsyncStorage.getItem('@active_theme');
  const activeTheme = activeThemeStr != null ? JSON.parse(activeThemeStr) : null;
  if (activeTheme !== null)
    return activeTheme as Theme;
  else {
    // const defaultTheme = getTheme(DEFAULT_THEME_NAME);
    try {
      await saveActiveTheme(DEFAULT_THEME_NAME);
    }
    catch (e) { 
      // saving error
    }
  }
}

export async function saveActiveTheme(themeName:string):Promise<void> {
  const newActiveTheme = getTheme(themeName);
  await AsyncStorage.setItem('@active_theme', JSON.stringify(newActiveTheme));
}