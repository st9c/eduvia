import { Layout } from "@/components/Layout";
import { CourseCard } from "@/components/CourseCard";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["cs101", "math201", "phys301", "eng101"]);

  const allCourses = [
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
    {
      id: "chem101",
      title: "Chemistry I",
      instructor: "Dr. Robert Davis",
      students: 72,
      color: "amber",
      assignments: 7,
      progress: 50,
    },
    {
      id: "bio201",
      title: "Biology II",
      instructor: "Prof. Lisa Anderson",
      students: 88,
      color: "cyan",
      assignments: 5,
      progress: 70,
    },
  ];

  const myCourses = allCourses.filter((c) => enrolledCourses.includes(c.id));
  const availableCourses = allCourses.filter((c) => !enrolledCourses.includes(c.id));

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Courses</h1>
            <p className="opacity-90">
              Browse and enroll in courses to expand your knowledge
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search courses by name or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* My Courses Section */}
          {myCourses.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                My Courses
              </h2>
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
          )}

          {/* Available Courses Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Available Courses
              </h2>
              <span className="text-sm text-muted-foreground">
                {searchTerm
                  ? `${filteredCourses.length} results`
                  : `${availableCourses.length} courses`}
              </span>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="relative group"
                  >
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      students={course.students}
                      color={course.color}
                      assignments={course.assignments}
                      progress={course.progress}
                    />
                    {!enrolledCourses.includes(course.id) && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEnrolledCourses([...enrolledCourses, course.id]);
                          toast.success(`Enrolled in ${course.title}!`);
                        }}
                        className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                        title="Enroll in this course"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No courses found matching your search.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="h-8" />
      </div>
    </Layout>
  );
}
