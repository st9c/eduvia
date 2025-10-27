import { Clock, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseName: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue";
  description: string;
}

export function AssignmentsSidebar() {
  const upcomingAssignments: Assignment[] = [
    {
      id: "assign1",
      title: "Algorithm Design Project",
      course: "cs101",
      courseName: "Computer Science",
      dueDate: "Dec 15, 2024",
      status: "pending",
      description: "Implement a sorting algorithm",
    },
    {
      id: "assign2",
      title: "Calculus Problem Set #7",
      course: "math201",
      courseName: "Advanced Mathematics",
      dueDate: "Dec 12, 2024",
      status: "pending",
      description: "Solve differential equations",
    },
    {
      id: "assign3",
      title: "Lab Report: Quantum Mechanics",
      course: "phys301",
      courseName: "Physics III",
      dueDate: "Dec 10, 2024",
      status: "overdue",
      description: "Write a comprehensive lab report",
    },
    {
      id: "assign4",
      title: "Book Analysis Essay",
      course: "eng101",
      courseName: "English Literature",
      dueDate: "Dec 20, 2024",
      status: "submitted",
      description: "Analyze themes in modern literature",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={20} className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">Upcoming Assignments</h2>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {upcomingAssignments.map((assignment) => {
          const isOverdue = assignment.status === "overdue";
          const isSubmitted = assignment.status === "submitted";

          const statusIcon = isSubmitted ? (
            <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : isOverdue ? (
            <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          ) : (
            <Clock size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          );

          return (
            <div
              key={assignment.id}
              className={cn(
                "block p-4 rounded-lg border transition-all",
                isOverdue
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30"
                  : isSubmitted
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30"
                    : "bg-card border-border"
              )}
            >
              <div className="flex items-start gap-3">
                {statusIcon}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {assignment.courseName}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {assignment.dueDate}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded",
                        isOverdue
                          ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                          : isSubmitted
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      )}
                    >
                      {assignment.status === "submitted"
                        ? "Submitted"
                        : assignment.status === "overdue"
                          ? "Overdue"
                          : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <a
        href="/calendar"
        className="block text-center mt-6 px-4 py-2 text-primary hover:text-primary/80 font-semibold transition-colors"
      >
        View All Assignments →
      </a>
    </div>
  );
}
