"use client";

import { useEffect } from "react";

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-secondary)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      aria-label="Toggle theme"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-surface-soft)] text-[var(--color-primary)]">
        ◐
      </span>
      Theme
    </button>
  );
}
