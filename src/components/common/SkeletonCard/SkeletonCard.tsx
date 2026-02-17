import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-graphite-200 bg-white dark:border-graphite-800 dark:bg-graphite-900 p-6",
        className
      )}
    >
      <div className="mb-4 h-4 w-16 rounded bg-graphite-200 dark:bg-graphite-700" />
      <div className="mb-2 h-6 w-3/4 rounded bg-graphite-200 dark:bg-graphite-700" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-graphite-100 dark:bg-graphite-800" />
        <div className="h-4 w-5/6 rounded bg-graphite-100 dark:bg-graphite-800" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-12 rounded bg-graphite-100 dark:bg-graphite-800" />
        <div className="h-5 w-16 rounded bg-graphite-100 dark:bg-graphite-800" />
      </div>
    </div>
  );
}
