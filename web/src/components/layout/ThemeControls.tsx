"use client";

import { useEffect, useState } from "react";
import { Moon, ScanEye, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark" | "sensor";

const classFor = (t: Theme) => (t === "sensor" ? "sensor-view" : t);

/** Two distinct controls: light/dark toggle + the signature LiDAR sensor-view toggle. */
export function ThemeControls({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [base, setBase] = useState<"light" | "dark">("light");

  useEffect(() => {
    const c = document.documentElement.classList;
    const current: Theme = c.contains("sensor-view") ? "sensor" : c.contains("dark") ? "dark" : "light";
    const storedBase = (localStorage.getItem("mt-base") as "light" | "dark" | null) ?? (current === "sensor" ? "dark" : current);
    setTheme(current);
    setBase(storedBase);
    setMounted(true);
  }, []);

  function apply(next: Theme) {
    const c = document.documentElement.classList;
    c.remove("light", "dark", "sensor-view");
    c.add(classFor(next));
    localStorage.setItem("mt-theme", next);
    setTheme(next);
    if (next !== "sensor") {
      setBase(next);
      localStorage.setItem("mt-base", next);
    }
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <button
        type="button"
        onClick={() => apply(base === "dark" ? "light" : "dark")}
        aria-label="Toggle light and dark mode"
        title="Light / dark"
        className="grid size-9 place-items-center rounded-md text-text-muted transition-colors hover:bg-bg-muted hover:text-text focus-visible:outline-2"
      >
        {mounted ? base === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" /> : <span className="size-[18px]" />}
      </button>
      <button
        type="button"
        onClick={() => apply(theme === "sensor" ? base : "sensor")}
        aria-pressed={mounted && theme === "sensor"}
        aria-label="Toggle LiDAR sensor view"
        title="Sensor view"
        className={cn(
          "grid size-9 place-items-center rounded-md transition-colors hover:bg-bg-muted focus-visible:outline-2",
          mounted && theme === "sensor" ? "text-eye" : "text-text-muted hover:text-text",
        )}
      >
        <ScanEye className="size-[18px]" />
      </button>
    </div>
  );
}
