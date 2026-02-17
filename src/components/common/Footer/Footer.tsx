import { Bot, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-graphite-200 bg-graphite-100 dark:border-graphite-800 dark:bg-graphite-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-graphite-500 dark:text-graphite-400">
            <Bot className="h-5 w-5" />
            <span className="text-sm">AI Dev Playbook</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite-500 dark:text-graphite-400 transition-colors hover:text-celadon-400"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-graphite-400 dark:text-graphite-500">
          &copy; {new Date().getFullYear()} AI Dev Playbook. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
