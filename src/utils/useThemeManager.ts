import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme } from "@/store";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const getSystemTheme = (): ResolvedTheme => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

const getStoredThemePreference = (): ThemeMode | null => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "system" || savedTheme === "dark"
      ? savedTheme
      : null;
};

export function useThemeManager() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.main);

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getSystemTheme());

  useEffect(() => {
    const savedTheme = getStoredThemePreference();
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      dispatch(setTheme("system"));
    }
  }, [dispatch]);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolved: ResolvedTheme =
          theme === "system" ? getSystemTheme() : theme;

      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.setAttribute("data-theme", resolved);
    };

    applyTheme();

    if (theme !== "system") return;

    const handleChange = () => applyTheme();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return resolvedTheme;
}