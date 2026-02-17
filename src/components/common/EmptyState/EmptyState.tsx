import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "포스팅이 없습니다",
  description = "조건에 맞는 포스팅을 찾을 수 없습니다.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-graphite-100 dark:bg-graphite-800 p-4">
        <FileText className="h-8 w-8 text-graphite-400 dark:text-graphite-500" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-graphite-900 dark:text-graphite-200">{title}</h3>
      <p className="text-sm text-graphite-500 dark:text-graphite-400">{description}</p>
    </div>
  );
}
