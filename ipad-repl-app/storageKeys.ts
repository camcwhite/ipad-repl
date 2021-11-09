import { DEFAULT_FONT_SIZE, DEFAULT_THEME } from "./themes";

export const EDITOR_FONT_SIZE = 'editorFontSize';
export const ACTIVE_THEME = 'activeTheme';
export const DEVICE_TOKEN = 'deviceToken';

export const defaults = new Map<string, string>([
  [ACTIVE_THEME, DEFAULT_THEME],
  [EDITOR_FONT_SIZE, `${DEFAULT_FONT_SIZE}`],
]);