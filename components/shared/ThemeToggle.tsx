"use client";

import { ThemeContext } from "@/context/Theme";
import { useContext } from "react";

import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}

export default ThemeToggle;
