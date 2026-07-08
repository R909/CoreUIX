export function applyTheme(cssVariables: Record<string, string>): void {
  const root = document.documentElement;

  Object.entries(cssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
