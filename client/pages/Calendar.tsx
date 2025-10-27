import { Layout } from "@/components/Layout";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AssignmentDetail } from "@/components/AssignmentDetail";
import { ChevronLeft, ChevronRight, List, Grid } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Calendar() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11));
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [userRole] = useState<"student" | "instructor" | "admin">(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.role;
    }
    return "student";
  });

  const [assignments, setAssignments] = useState([
    {
      id: "assign1",
      title: "Algorithm Design Project",
      course: "cs101",
      dueDate: "Dec 15, 2024",
      status: "pending" as const,
      description: "Implement a sorting algorithm and analyze its complexity",
      points: 100,
    },
    {
      id: "assign2",
      title: "Calculus Problem Set #7",
      course: "math201",
      dueDate: "Dec 12, 2024",
      status: "pending" as const,
      description: "Solve differential equations and optimization problems",
    },
    {
      id: "assign3",
      title: "Lab Report: Quantum Mechanics",
      course: "phys301",
      dueDate: "Dec 10, 2024",
      status: "overdue" as const,
      description: "Write a comprehensive lab report on quantum experiments",
    },
    {
      id: "assign4",
      title: "Book Analysis Essay",
      course: "eng101",
      dueDate: "Dec 20, 2024",
      status: "submitted" as const,
      description: "Analyze themes in modern literature",
    },
    {
      id: "assign5",
      title: "Chemistry Lab Experiment",
      course: "chem101",
      dueDate: "Dec 18, 2024",
      status: "pending" as const,
      description: "Conduct and document chemical reaction experiment",
    },
    {
      id: "assign6",
      title: "Data Structure Implementation",
      course: "cs101",
      dueDate: "Dec 8, 2024",
      status: "submitted" as const,
      description: "Build a linked list with all basic operations",
      points: 100,
      grade: 95,
      feedback: "Excellent work! Your implementation is clean and efficient.",
      submission: {
        file_name: "linked_list.cpp",
        submitted_at: "Dec 7, 2024 at 3:45 PM",
      },
    },
  ]);

  const handleSubmitAssignment = (file: File) => {
    if (selectedAssignment) {
      setAssignments(assignments.map(a => 
        a.id === selectedAssignment.id 
          ? { 
              ...a, 
              status: "submitted" as const,
              points: a.points || 100,
              grade: a.grade || 0,
              feedback: a.feedback || "",
              submission: {
                file_name: file.name,
                submitted_at: new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString(),
              }
            }
          : a
      ));
      toast.success("Assignment submitted successfully!");
    }
  };

  const monthDays = [
    { date: 1, assignments: 0 },
    { date: 2, assignments: 0 },
    { date: 3, assignments: 0 },
    { date: 4, assignments: 0 },
    { date: 5, assignments: 0 },
    { date: 6, assignments: 0 },
    { date: 7, assignments: 0 },
    { date: 8, assignments: 2 },
    { date: 9, assignments: 0 },
    { date: 10, assignments: 1 },
    { date: 11, assignments: 0 },
    { date: 12, assignments: 1 },
    { date: 13, assignments: 0 },
    { date: 14, assignments: 0 },
    { date: 15, assignments: 1 },
    { date: 16, assignments: 0 },
    { date: 17, assignments: 0 },
    { date: 18, assignments: 1 },
    { date: 19, assignments: 0 },
    { date: 20, assignments: 1 },
    { date: 21, assignments: 0 },
    { date: 22, assignments: 0 },
    { date: 23, assignments: 0 },
    { date: 24, assignments: 0 },
    { date: 25, assignments: 0 },
    { date: 26, assignments: 0 },
    { date: 27, assignments: 0 },
    { date: 28, assignments: 0 },
    { date: 29, assignments: 0 },
    { date: 30, assignments: 0 },
    { date: 31, assignments: 0 },
  ];

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Assignments</h1>
            <p className="opacity-90">
              View and manage your assignments in a calendar or list view
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "calendar"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                <Grid size={20} />
              </button>
            </div>

            {/* Filter Stats */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Submitted</span>
              </div>
            </div>
          </div>

          {viewMode === "list" ? (
            // List View
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  All Assignments
                </h2>
                <span className="text-sm text-muted-foreground">
                  {assignments.length} total
                </span>
              </div>
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  id={assignment.id}
                  title={assignment.title}
                  course={assignment.course}
                  dueDate={assignment.dueDate}
                  status={assignment.status}
                  description={assignment.description}
                  onClick={() => setSelectedAssignment(assignment)}
                />
              ))}
            </div>
          ) : (
            // Calendar View
            <div className="bg-card border border-border rounded-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                    )
                  }
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <h3 className="text-xl font-bold text-foreground">
                  {monthName}
                </h3>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                    )
                  }
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-foreground" />
                </button>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day) => (
                  <div
                    key={day.date}
                    className={`min-h-24 p-2 rounded-lg border transition-colors ${
                      day.assignments > 0
                        ? "bg-primary/10 border-primary"
                        : "bg-muted border-border"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {day.date}
                    </div>
                    {day.assignments > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {day.assignments} task{day.assignments > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetail
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onSubmit={handleSubmitAssignment}
          userRole={userRole}
        />
      )}
    </Layout>
  );
}
