import { CourseCard } from "./CourseCard";
import { AssignmentCard } from "./AssignmentCard";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  color: string;
  assignments: number;
  progress: number;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "overdue";
  description: string;
}

export function Dashboard() {
  // Mock data - in a real app, this would come from an API
  const myCourses: Course[] = [
    {
      id: "cs101",
      title: "Introduction to Computer Science",
      instructor: "Dr. Sarah Johnson",
      students: 128,
      color: "blue",
      assignments: 5,
      progress: 75,
    },
    {
      id: "math201",
      title: "Advanced Mathematics",
      instructor: "Prof. Michael Chen",
      students: 64,
      color: "purple",
      assignments: 8,
      progress: 60,
    },
    {
      id: "phys301",
      title: "Physics III",
      instructor: "Dr. Emma Wilson",
      students: 96,
      color: "green",
      assignments: 6,
      progress: 85,
    },
    {
      id: "eng101",
      title: "English Literature",
      instructor: "Prof. James Brown",
      students: 45,
      color: "pink",
      assignments: 4,
      progress: 90,
    },
  ];

  const upcomingAssignments: Assignment[] = [
    {
      id: "assign1",
      title: "Algorithm Design Project",
      course: "cs101",
      dueDate: "Dec 15, 2024",
      status: "pending",
      description: "Implement a sorting algorithm and analyze its complexity",
    },
    {
      id: "assign2",
      title: "Calculus Problem Set #7",
      course: "math201",
      dueDate: "Dec 12, 2024",
      status: "pending",
      description: "Solve differential equations and optimization problems",
    },
    {
      id: "assign3",
      title: "Lab Report: Quantum Mechanics",
      course: "phys301",
      dueDate: "Dec 10, 2024",
      status: "overdue",
      description: "Write a comprehensive lab report on quantum experiments",
    },
    {
      id: "assign4",
      title: "Book Analysis Essay",
      course: "eng101",
      dueDate: "Dec 20, 2024",
      status: "submitted",
      description: "Analyze themes in modern literature",
    },
  ];

  const stats = [
    { label: "Active Courses", value: myCourses.length, color: "blue" },
    {
      label: "Pending Assignments",
      value: upcomingAssignments.filter((a) => a.status === "pending").length,
      color: "amber",
    },
    {
      label: "Overall GPA",
      value: "3.8",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">
            Welcome back, John!
          </h1>
          <p className="text-lg opacity-90">
            You have 4 active courses and 2 pending assignments
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Courses Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
          <Link
            to="/courses"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View all <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {myCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              students={course.students}
              color={course.color}
              assignments={course.assignments}
              progress={course.progress}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Assignments Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Upcoming Assignments
          </h2>
          <Link
            to="/calendar"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View calendar <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              id={assignment.id}
              title={assignment.title}
              course={assignment.course}
              dueDate={assignment.dueDate}
              status={assignment.status}
              description={assignment.description}
            />
          ))}
        </div>
      </section>

      {/* Explore Courses CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-accent text-accent-foreground rounded-xl p-8 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Explore More Courses
              </h3>
              <p className="opacity-90">
                Discover new courses and expand your learning opportunities
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-accent-foreground text-accent px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Plus size={20} />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Padding bottom */}
      <div className="h-8" />
    </div>
  );
}
