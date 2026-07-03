import type { CoreUIXTheme } from "./types"

export function applyTheme(theme: CoreUIXTheme) {

const root=document.documentElement

root.style.setProperty("--background",theme.colors.background)

root.style.setProperty("--foreground",theme.colors.foreground)

root.style.setProperty("--primary",theme.colors.primary)

root.style.setProperty("--primary-foreground",theme.colors.primaryForeground)

root.style.setProperty("--secondary",theme.colors.secondary)

root.style.setProperty("--secondary-foreground",theme.colors.secondaryForeground)

root.style.setProperty("--border",theme.colors.border)

root.style.setProperty("--ring",theme.colors.ring)

root.style.setProperty("--muted",theme.colors.muted)

root.style.setProperty("--card",theme.colors.card)

root.style.setProperty("--card-foreground",theme.colors.cardForeground)

root.style.setProperty("--radius-sm",theme.radius.sm)

root.style.setProperty("--radius-md",theme.radius.md)

root.style.setProperty("--radius-lg",theme.radius.lg)

}