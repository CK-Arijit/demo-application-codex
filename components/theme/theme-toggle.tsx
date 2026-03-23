"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme: Theme = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant="surface"
      size="compact"
      shape="pill"
      className="hover:text-(--color-primary)"
      aria-label="Toggle theme"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-(--color-surface-soft) text-(--color-primary)">
        ◐
      </span>
      Theme
    </Button>
  );
}
