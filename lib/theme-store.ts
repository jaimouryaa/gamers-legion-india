"use client";

import { useSyncExternalStore } from "react";

export type ThemePreference = "dark" | "light" | "system";
const STORAGE_KEY = "gli:theme";

function resolveSystem(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(pref: ThemePreference) {
  if (typeof document === "undefined") return;
  const resolved = pref === "system" ? resolveSystem() : pref;
  document.documentElement.setAttribute("data-theme", resolved);
}

let preference: ThemePreference =
  typeof window !== "undefined"
    ? ((window.localStorage.getItem(STORAGE_KEY) as ThemePreference) || "dark")
    : "dark";

const listeners = new Set<() => void>();

export const themeActions = {
  set(pref: ThemePreference) {
    preference = pref;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, pref);
    }
    apply(pref);
    listeners.forEach((l) => l());
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return preference;
}

function getServerSnapshot(): ThemePreference {
  return "dark";
}

export function useTheme() {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { preference: pref, setTheme: themeActions.set };
}

// Inline script injected in <head> so the correct theme applies before first
// paint (no flash of the wrong theme). Reads the same localStorage key.
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var pref = localStorage.getItem('${STORAGE_KEY}') || 'dark';
    var resolved = pref === 'system'
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : pref;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;
