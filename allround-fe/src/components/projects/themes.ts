export type ThemeName =
  | "carbon"
  | "blue"
  | "calsonic"
  | "deep-space"
  | "8088"
  | "mizu"
  | "strawberry"
  | "vscode"
  | "bushido"
  | "botanical"
  | "taro"
  | "peachy"
  | "forest"
  | "bubblegum"
  | "sandstone"
  | "monochrome-light";

export type ThemeColorKey = "color1" | "color2" | "color3" | "color4";

export type ThemeCssVar =
  | "--theme-text"
  | "--theme-title"
  | "--theme-text-focus"
  | "--theme-text-done"
  | "--theme-bg"
  | "--popover"
  | "--popover-foreground"
  | "--card-foreground"
  | "--accent"
  | "--border"
  | "--accent-foreground"
  | "--block"
  | "--input";

export type ThemeDefinition = {
  name: ThemeName;
  label: string;
  colors: Record<ThemeColorKey, string>;
  cssVariables?: Partial<Record<ThemeCssVar, ThemeColorKey>>;
  /** optional brighter colors just for the Settings preview dots */
  swatch?: [string, string, string];
};

export const themeDefinitions: ThemeDefinition[] = [
  {
    name: "carbon",
    label: "carbon",
    colors: {
      color1: "#e2e2e2",
      color2: "#9e9e9e",
      color3: "#8b8b8b",
      color4: "#3d3d3d",
    },
  },
  {
    name: "blue",
    label: "blue",
    colors: {
      color1: "#1e3a8a",
      color2: "#00113f",
      color3: "#2563eb",
      color4: "#e0f2fe",
    },
  },
  {
    name: "calsonic",
    label: "calsonic",
    colors: {
      color1: "#f4f8fb",
      color2: "#ffd84d",
      color3: "#dbeafe",
      color4: "#0a5fae",
    },
  },
  {
    name: "deep-space",
    label: "deep space",
    colors: {
      color1: "#f8fafc",
      color2: "#535bf2",
      color3: "#64748b",
      color4: "#0f172a",
    },
  },
  {
    name: "8088",
    label: "8088",
    colors: {
      color1: "#f3f7fb",
      color2: "#ff4f8b",
      color3: "#c7d0dd",
      color4: "#2e3642",
    },
  },
  {
    name: "mizu",
    label: "mizu",
    colors: {
      color1: "#1f2a39",
      color2: "#45607a",
      color3: "#2e4157",
      color4: "#a8c5d9",
    },
  },
  {
    name: "strawberry",
    label: "strawberry",
    colors: {
      color1: "#8a2f38",
      color2: "#b0424c",
      color3: "#e2525e",
      color4: "#ffe0e3",
    },
  },
  {
    name: "vscode",
    label: "vscode",
    colors: {
      color1: "#d4d4d4",
      color2: "#007acc",
      color3: "#808080",
      color4: "#1e1e1e",
    },
  },
  {
    name: "bushido",
    label: "bushido",
    colors: {
      color1: "#f7f0e9",
      color2: "#ff4d67",
      color3: "#ff8ea0",
      color4: "#2b2d31",
    },
  },
  {
    name: "botanical",
    label: "botanical",
    colors: {
      color1: "#cad2c5",
      color2: "#a5c3ab",
      color3: "#d8e5da",
      color4: "#385f56",
    },
  },
  {
    name: "taro",
    label: "taro",
    colors: {
      color1: "#0c0e23",
      color2: "#56548a",
      color3: "#3d3c66",
      color4: "#b3baff",
    },
  },
  {
    name: "peachy",
    label: "peachy",
    colors: {
      color1: "#5c3a30",
      color2: "#a04b3b",
      color3: "#bd5842",
      color4: "#ffcdb2",
    },
  },
  {
    name: "forest",
    label: "forest",
    colors: {
      color1: "#cad2c5",
      color2: "#84a98c",
      color3: "#8fae9f",
      color4: "#354f52",
    },
  },
  {
    name: "bubblegum",
    label: "bubblegum",
    colors: {
      color1: "#EC559E",
      color2: "#2AC9AC",
      color3: "#F595C0",
      color4: "#fff5fa",
    },
  },
  {
    name: "sandstone",
    label: "sandstone",
    colors: {
      color1: "#f1d1aa",
      color2: "#d4aa7d",
      color3: "#b58360",
      color4: "#272727",
    },
  },
  {
    name: "monochrome-light",
    label: "monochrome-light",
    colors: {
      color1: "#111111",
      color2: "#999999",
      color3: "#666666",
      color4: "#ffffff",
    },
  },
];

export const themeCssVariables = [
  { cssVar: "--theme-text", colorKey: "color1" as const },
  { cssVar: "--theme-title", colorKey: "color2" as const },
  { cssVar: "--theme-text-focus", colorKey: "color3" as const },
  { cssVar: "--theme-text-done", colorKey: "color2" as const },
  { cssVar: "--theme-bg", colorKey: "color4" as const },
  { cssVar: "--popover", colorKey: "color4" as const },
  { cssVar: "--popover-foreground", colorKey: "color1" as const },
  { cssVar: "--card-foreground", colorKey: "color1" as const },
  { cssVar: "--accent", colorKey: "color2" as const },
  { cssVar: "--border", colorKey: "color3" as const },
  { cssVar: "--accent-foreground", colorKey: "color4" as const },
  { cssVar: "--block", colorKey: "color3" as const },
  { cssVar: "--input", colorKey: "color3" as const },
] as const;

const defaultThemeColorKeysByCssVar = Object.fromEntries(
  themeCssVariables.map(({ cssVar, colorKey }) => [cssVar, colorKey]),
) as Record<ThemeCssVar, ThemeColorKey>;

export function getThemeColorKeyForCssVar(
  theme: ThemeDefinition,
  cssVar: ThemeCssVar,
): ThemeColorKey {
  return theme.cssVariables?.[cssVar] ?? defaultThemeColorKeysByCssVar[cssVar];
}

export function getThemeColorForCssVar(theme: ThemeDefinition, cssVar: ThemeCssVar) {
  return theme.colors[getThemeColorKeyForCssVar(theme, cssVar)];
}

export const themeNameSet = new Set<ThemeName>(themeDefinitions.map((theme) => theme.name));

export function normalizeThemeName(theme: string): ThemeName | "default" {
  if (theme === "default") {
    return "default";
  }

  if (theme === "dark") {
    return "deep-space";
  }

  return themeNameSet.has(theme as ThemeName) ? (theme as ThemeName) : "default";
}

export function getThemeByName(theme: string) {
  const normalized = normalizeThemeName(theme);
  if (normalized === "default") {
    return null;
  }

  return themeDefinitions.find((themeDefinition) => themeDefinition.name === normalized) ?? null;
}
