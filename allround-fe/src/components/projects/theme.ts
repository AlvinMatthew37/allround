// theme.ts
export function setTheme(theme: string) {
  const normalizedTheme = theme === "dark" ? "deep-space" : theme;

  if (normalizedTheme === "default") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "default");
  } else {
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem("theme", normalizedTheme);
  }
}

export function loadTheme() {
  const saved = localStorage.getItem("theme") || "default";
  const normalizedTheme = saved === "dark" ? "deep-space" : saved;

  if (normalizedTheme === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem("theme", normalizedTheme);
  }
}
