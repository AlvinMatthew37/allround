export type ThemeName =
  | "carbon"
  | "blue"
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

export type ThemeDefinition = {
  name: ThemeName;
  label: string;
  colors: Record<ThemeColorKey, string>;
};

export const themeDefinitions: ThemeDefinition[] = [
  {
    name: "carbon",
    label: "carbon",
    colors: {
      color1: "#000000",
      color2: "#808080",
      color3: "#707070",
      color4: "#3d3d3d",
    },
  },
  {
    name: "blue",
    label: "blue",
    colors: {
      color1: "#1e3a8a",
      color2: "#00113f",
      color3: "#4d91f7",
      color4: "#e0f2fe",
    },
  },
  {
    name: "deep-space",
    label: "deep space",
    colors: {
      color1: "#f8fafc",
      color2: "#535bf2",
      color3: "#334155",
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
      color1: "#f7f6ef",
      color2: "#1f2a39",
      color3: "#8fa9c2",
      color4: "#a8c5d9",
    },
  },
  {
    name: "strawberry",
    label: "strawberry",
    colors: {
      color1: "#fff7f7",
      color2: "#ffe0e3",
      color3: "#ffd0d5",
      color4: "#f36f77",
    },
  },
  {
    name: "vscode",
    label: "vscode",
    colors: {
      color1: "#d4d4d4",
      color2: "#007acc",
      color3: "#3c3c3c",
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
      color1: "#385f56",
      color2: "#cad2c5",
      color3: "#84a98c",
      color4: "#6b9e92",
    },
  },
  {
    name: "taro",
    label: "taro",
    colors: {
      color1: "#6d6c8f",
      color2: "#0c0e23",
      color3: "#ffffff",
      color4: "#b3baff",
    },
  },
  {
    name: "peachy",
    label: "peachy",
    colors: {
      color1: "#e5989b",
      color2: "#b5838d",
      color3: "#ffb4a2",
      color4: "#ffcdb2",
    },
  },
  {
    name: "forest",
    label: "forest",
    colors: {
      color1: "#cad2c5",
      color2: "#84a98c",
      color3: "#52796f",
      color4: "#354f52",
    },
  },
  {
    name: "bubblegum",
    label: "bubblegum",
    colors: {
      color1: "#92e8d3",
      color2: "#f4b0ca",
      color3: "#31b79b",
      color4: "#ffffff",
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
      color1: "#333333",
      color2: "#555555",
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
  { cssVar: "--block", colorKey: "color2" as const },
  { cssVar: "--input", colorKey: "color3" as const },
] as const;

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
