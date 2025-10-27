import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue" | "graded";
  description: string;
  onClick?: () => void;
}

export function AssignmentCard({
  id,
  title,
  course,
  dueDate,
  status,
  description,
  onClick,
}: AssignmentCardProps) {
  const isOverdue = status === "overdue";
  const isSubmitted = status === "submitted";
  const isPending = status === "pending";

  const statusIcon =
    status === "submitted" ? (
      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
    ) : isOverdue ? (
      <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
    ) : (
      <Clock size={16} className="text-amber-600 dark:text-amber-400" />
    );

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer",
        "block p-4 rounded-lg border transition-all hover:shadow-md",
        isOverdue
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30"
          : isSubmitted
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30"
            : "bg-card border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <FileText
            size={20}
            className={cn(
              "flex-shrink-0 mt-1",
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : isSubmitted
                  ? "text-green-600 dark:text-green-400"
                  : "text-primary"
            )}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground line-clamp-2">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{course}</p>
          </div>
        </div>
        {statusIcon}
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Due: {dueDate}
        </span>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded",
            isOverdue
              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
              : isSubmitted
                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}
