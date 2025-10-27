import { Layout } from "@/components/Layout";
import { TrendingUp, Award, Target, BarChart3, Download, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportGradesToPDF, exportGradesToCSV } from "@/utils/export";
import { useState } from "react";

export default function Grades() {
  const [userName] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).name : "Student";
  });
  
  // Mock data
  const overallGPA = 3.8;
  const courses = [
    {
      id: "cs101",
      title: "Introduction to Computer Science",
      grade: "A-",
      gradeNumeric: 90,
      instructor: "Dr. Sarah Johnson",
      progress: 75,
    },
    {
      id: "math201",
      title: "Advanced Mathematics",
      grade: "B+",
      gradeNumeric: 87,
      instructor: "Prof. Michael Chen",
      progress: 60,
    },
    {
      id: "phys301",
      title: "Physics III",
      grade: "A",
      gradeNumeric: 95,
      instructor: "Dr. Emma Wilson",
      progress: 85,
    },
    {
      id: "eng101",
      title: "English Literature",
      grade: "A",
      gradeNumeric: 92,
      instructor: "Prof. James Brown",
      progress: 90,
    },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    if (grade >= 80) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    if (grade >= 70) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
  };

  const getGradeBar = (grade: number) => {
    if (grade >= 90) return "bg-green-500 dark:bg-green-400";
    if (grade >= 80) return "bg-blue-500 dark:bg-blue-400";
    if (grade >= 70) return "bg-amber-500 dark:bg-amber-400";
    return "bg-red-500 dark:bg-red-400";
  };

  const averageGrade =
    Math.round((courses.reduce((sum, c) => sum + c.gradeNumeric, 0) / courses.length) * 10) / 10;

  // Performance trend data
  const performanceTrend = [
    { month: "Sep", grade: 85 },
    { month: "Oct", grade: 88 },
    { month: "Nov", grade: 90 },
    { month: "Dec", grade: averageGrade },
  ];

  // Grade distribution
  const gradeDistribution = [
    { name: "A (90-100)", value: courses.filter(c => c.gradeNumeric >= 90).length, color: "#10b981" },
    { name: "B (80-89)", value: courses.filter(c => c.gradeNumeric >= 80 && c.gradeNumeric < 90).length, color: "#3b82f6" },
    { name: "C (70-79)", value: courses.filter(c => c.gradeNumeric >= 70 && c.gradeNumeric < 80).length, color: "#f59e0b" },
    { name: "D (60-69)", value: courses.filter(c => c.gradeNumeric >= 60 && c.gradeNumeric < 70).length, color: "#ef4444" },
  ].filter(item => item.value > 0);

  // Course performance comparison
  const coursePerformance = courses.map(c => ({
    name: c.title.split(' ').slice(0, 2).join(' '),
    grade: c.gradeNumeric,
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Grades & Performance</h1>
                <p className="opacity-90">
                  Track your academic progress and performance across all courses
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportGradesToPDF(courses, userName)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FileText size={18} />
                  Export PDF
                </button>
                <button
                  onClick={() => exportGradesToCSV(courses, userName)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall GPA */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Overall GPA</h3>
                <Award className="text-primary" size={20} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">{overallGPA}</span>
                <span className="text-sm text-muted-foreground mb-1">/4.0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Excellent academic standing
              </p>
            </div>

            {/* Average Grade */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Average Grade</h3>
                <TrendingUp className="text-accent" size={20} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">{averageGrade}</span>
                <span className="text-sm text-muted-foreground mb-1">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Based on current grades
              </p>
            </div>

            {/* Completed Courses */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                <Target className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">{courses.length}</span>
                <span className="text-sm text-muted-foreground mb-1">courses</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                All courses in progress
              </p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Course Grades</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${getGradeColor(
                            course.gradeNumeric
                          )}`}
                        >
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                            <div
                              className={getGradeBar(course.gradeNumeric)}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{course.progress}%</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{course.gradeNumeric}%</p>
                          <p className="text-xs text-muted-foreground">
                            {course.gradeNumeric >= 90
                              ? "Excellent"
                              : course.gradeNumeric >= 80
                                ? "Good"
                                : course.gradeNumeric >= 70
                                  ? "Average"
                                  : "Needs Improvement"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Performance Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">This Semester</span>
                  <span className="text-sm text-muted-foreground">Strong performance</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Last Semester</span>
                  <span className="text-sm text-muted-foreground">85% average</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Overall</span>
                  <span className="text-sm text-muted-foreground">3.8 GPA</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </Layout>
  );
}
