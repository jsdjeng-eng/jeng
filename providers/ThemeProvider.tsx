"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type Preference = Theme | "system";

const STORAGE_KEY = "jeng-theme";

type ThemeContextValue = {
  /** The resolved theme actually applied to <html> (never "system"). */
  theme: Theme;
  /** The user's stored preference - may be "system". */
  preference: Preference;
  setPreference: (preference: Preference) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(preference: Preference): Theme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<Preference>("system");
  const [theme, setTheme] = useState<Theme>("light");

  // Hydrate from localStorage on first mount.
  /* eslint-disable react-hooks/set-state-in-effect --
   * Reading localStorage on mount is the documented React 19 pattern for
   * deferring browser-only state until after hydration. */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Preference | null;
      const initialPreference: Preference =
        stored === "light" || stored === "dark" || stored === "system"
          ? stored
          : "system";
      setPreferenceState(initialPreference);
      const resolved = resolveTheme(initialPreference);
      setTheme(resolved);
      applyTheme(resolved);
    } catch {
      // localStorage unavailable - fall back to system preference.
      const resolved = getSystemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // React to OS-level theme changes while preference === "system".
  useEffect(() => {
    if (preference !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = getSystemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  const setPreference = useCallback((next: Preference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore - private mode etc
    }
    const resolved = resolveTheme(next);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggle = useCallback(() => {
    const next: Preference = theme === "dark" ? "light" : "dark";
    setPreference(next);
  }, [theme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, preference, setPreference, toggle }),
    [theme, preference, setPreference, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be used within a <ThemeProvider>.");
  }
  return ctx;
}

/**
 * Sync the `dark` class on <html> before React hydrates so the first paint
 * matches the user's preference. Renders an inline <script> in the document
 * head; safe to include unconditionally.
 */
export function ThemeBootScript() {
  const code = `(() => {
  try {
    var stored = window.localStorage.getItem('${STORAGE_KEY}');
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var resolved = stored === 'light' || stored === 'dark' ? stored : system;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
