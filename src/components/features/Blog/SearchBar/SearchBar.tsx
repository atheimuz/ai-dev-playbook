"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "포스팅 검색...",
    className
}: SearchBarProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400 dark:text-graphite-500" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 border-graphite-100 bg-white text-graphite-900 placeholder:text-graphite-400 dark:border-graphite-700 dark:bg-graphite-900 dark:text-graphite-100 dark:placeholder:text-graphite-500 pl-10 pr-10 focus:border-celadon-500 focus:ring-celadon-500/20"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onChange("")}
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-graphite-400 hover:text-graphite-700 dark:text-graphite-500 dark:hover:text-graphite-100"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">검색어 지우기</span>
                </Button>
            )}
        </div>
    );
}
