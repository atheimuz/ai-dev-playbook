"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ThemeToggle";

const NAV_ITEMS = [
    { href: "/", label: "홈" },
    { href: "/posts", label: "포스팅" }
] as const;

export function GlobalNav() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 justify-between border-b border-graphite-200 bg-white/80 backdrop-blur-sm dark:border-graphite-800 dark:bg-graphite-950/80">
            <div className="flex justify-between items-center mx-auto h-16 max-w-7xl  px-4">
                <nav className="flex items-center gap-10">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-bold text-graphite-900 dark:text-graphite-50"
                    >
                        <Bot className="h-6 w-6 text-celadon-500" />
                        <span>AI Dev Playbook</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            {NAV_ITEMS.map(({ href, label }) => {
                                const isActive =
                                    href === "/" ? pathname === "/" : pathname.startsWith(href);

                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-celadon-400",
                                                isActive
                                                    ? "text-celadon-500"
                                                    : "text-graphite-600 dark:text-graphite-400"
                                            )}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
}
