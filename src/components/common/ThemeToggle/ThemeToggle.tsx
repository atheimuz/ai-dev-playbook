"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-8 w-14" />;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className={cn(
                "relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celadon-500 focus-visible:ring-offset-2",
                isDark ? "bg-graphite-700" : "bg-graphite-100"
            )}
        >
            <span
                className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-transform",
                    isDark ? "translate-x-7 bg-graphite-900" : "translate-x-1 bg-white"
                )}
            >
                {isDark ? (
                    <Moon className="h-3 w-3 text-celadon-400" />
                ) : (
                    <Sun className="h-3 w-3 text-graphite-600" />
                )}
            </span>
        </button>
    );
}
