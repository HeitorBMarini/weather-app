"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Um clique alterna entre claro e escuro (antes abria um menu).
export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // O tema só é conhecido no navegador; até lá o rótulo fica neutro para não divergir do HTML do servidor.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === "dark";
  const label = !mounted ? "Alternar tema" : dark ? "Usar tema claro" : "Usar tema escuro";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
