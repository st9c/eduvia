import { Link } from "react-router-dom";
import { BookOpen, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  students: number;
  color: string;
  assignments: number;
  progress: number;
}

const colorClasses = {
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
  purple:
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30",
  green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
  pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/30",
  amber:
    "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30",
  cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/30",
};

const colorAccents = {
  blue: "bg-blue-500 dark:bg-blue-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  green: "bg-green-500 dark:bg-green-400",
  pink: "bg-pink-500 dark:bg-pink-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
};

export function CourseCard({
  id,
  title,
  instructor,
  students,
  color,
  assignments,
  progress,
}: CourseCardProps) {
  const colorClass =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  const accentClass =
    colorAccents[color as keyof typeof colorAccents] || colorAccents.blue;

  return (
    <Link
      to={`/courses/${id}`}
      className={cn(
        "group block rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer",
        colorClass
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn("h-12 w-12 rounded-lg flex items-center justify-center", accentClass)}
        >
          <BookOpen size={24} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          {students} students
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{instructor}</p>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText size={16} />
          <span>{assignments} assignments</span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-bold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-white/40 dark:bg-black/20 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", accentClass)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
