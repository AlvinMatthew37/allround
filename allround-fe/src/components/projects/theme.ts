// theme.ts
export function setTheme(theme: string) {
  if (theme === "default") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "default");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
}

export function loadTheme() {
  const saved = localStorage.getItem("theme") || "default";
  if (saved === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", saved);
  }
}
