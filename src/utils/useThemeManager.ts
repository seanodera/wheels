import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.ts";
import { setTheme } from "@/store/reducers/mainSlice.ts";

export function useThemeManager() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.main);

  // On mount → initialize from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      dispatch(setTheme(prefersDark ? "dark" : "light"));
    }
  }, [dispatch]);

  // Whenever theme changes → persist & update <html> class
  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return theme;
}
