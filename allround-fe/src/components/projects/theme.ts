import {
  getThemeByName,
  normalizeThemeName,
  themeCssVariables,
  type ThemeDefinition,
} from "./themes";

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.name);

  for (const { cssVar, colorKey } of themeCssVariables) {
    root.style.setProperty(cssVar, theme.colors[colorKey]);
  }
}

function clearTheme() {
  const root = document.documentElement;
  root.removeAttribute("data-theme");

  for (const { cssVar } of themeCssVariables) {
    root.style.removeProperty(cssVar);
  }
}

export function setTheme(theme: string) {
  const normalizedTheme = normalizeThemeName(theme);

  if (normalizedTheme === "default") {
    clearTheme();
    localStorage.setItem(THEME_STORAGE_KEY, "default");
    return;
  }

  const themeDefinition = getThemeByName(normalizedTheme);

  if (!themeDefinition) {
    clearTheme();
    localStorage.setItem(THEME_STORAGE_KEY, "default");
    return;
  }

  applyTheme(themeDefinition);
  localStorage.setItem(THEME_STORAGE_KEY, themeDefinition.name);
}

export function loadTheme() {
  const savedTheme = normalizeThemeName(localStorage.getItem(THEME_STORAGE_KEY) || "default");

  if (savedTheme === "default") {
    clearTheme();
    return;
  }

  const themeDefinition = getThemeByName(savedTheme);

  if (!themeDefinition) {
    clearTheme();
    localStorage.setItem(THEME_STORAGE_KEY, "default");
    return;
  }

  applyTheme(themeDefinition);
  localStorage.setItem(THEME_STORAGE_KEY, themeDefinition.name);
}
