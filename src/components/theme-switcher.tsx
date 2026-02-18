"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeButtonProps {
  themeName: string;
  currentTheme: string | undefined;
  onClick: () => void;
  label: string;
}

const ThemeButton = ({
  themeName,
  currentTheme,
  onClick,
  label,
}: ThemeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        currentTheme === themeName
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {label}
    </button>
  );
};

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "103165-dazzletwo", label: "Dazzle Two" },
    { id: "103165-dazzle", label: "Dazzle" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {themes.map((t) => (
        <ThemeButton
          key={t.id}
          themeName={t.id}
          currentTheme={theme}
          onClick={() => setTheme(t.id)}
          label={t.label}
        />
      ))}
    </div>
  );
}
