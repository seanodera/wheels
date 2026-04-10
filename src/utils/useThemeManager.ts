import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme} from "@/store";

const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const getStoredThemePreference = (): "light" | "system" | "dark" | null => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "light" || savedTheme === "system" || savedTheme === "dark" ? savedTheme : null;
};

export function useThemeManager() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.main);

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
      const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    };

    applyTheme();
    if (theme !== "system") {
      return;
    }

    const handleChange = () => applyTheme();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return theme === "system" ? getSystemTheme() : theme;
}
