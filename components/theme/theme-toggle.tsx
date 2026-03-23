"use client";

import { useEffect } from "react";

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
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-medium text-(--color-text) transition hover:border-(--color-secondary) hover:text-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)"
      aria-label="Toggle theme"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-(--color-surface-soft) text-(--color-primary)">
        ◐
      </span>
      Theme
    </button>
  );
}
