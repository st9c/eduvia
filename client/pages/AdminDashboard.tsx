import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { School, Users, BookOpen, Plus, Edit2, Trash2, Save, X, GraduationCap, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface School {
  id: number;
  name: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  student_count: number;
  school_code: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  school_id?: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id?: number;
  instructor_name?: string;
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"school" | "users" | "courses">("school");
  
  // School state
  const [school, setSchool] = useState<School | null>(null);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [editedSchool, setEditedSchool] = useState<Partial<School>>({});
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" as "student" | "instructor" });
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", instructor_id: "" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      
      // Load mock school data
      const mockSchool: School = {
        id: 1,
        name: "Central University",
        location: "New York, NY",
        contact_email: "admin@centraluniversity.edu",
        contact_phone: "+1-555-0100",
        student_count: 500,
        school_code: "SCH0001"
      };
      setSchool(mockSchool);
      setEditedSchool(mockSchool);
      
      // Load mock users
      setUsers([
        { id: 1, name: "John Doe", email: "student@example.com", role: "student", school_id: 1 },
        { id: 2, name: "Dr. Sarah Johnson", email: "instructor@example.com", role: "instructor", school_id: 1 },
        { id: 3, name: "Emily Brown", email: "emily@example.com", role: "student", school_id: 1 },
      ]);
      
      // Load mock courses
      setCourses([
        { id: "cs101", title: "Introduction to Computer Science", description: "Learn programming fundamentals", instructor_name: "Dr. Sarah Johnson" },
        { id: "math201", title: "Advanced Mathematics", description: "Calculus and linear algebra", instructor_name: "Dr. Sarah Johnson" },
      ]);
    }
  }, []);

  const handleSaveSchool = () => {
    if (editedSchool) {
      setSchool(editedSchool as School);
      setIsEditingSchool(false);
      toast.success("School information updated!");
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      school_id: school?.id
    };
    
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "student" });
    setShowAddUser(false);
    toast.success(`${newUser.role === "student" ? "Student" : "Teacher"} account created!`);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted");
    }
  };

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const course: Course = {
      id: `course${courses.length + 1}`,
      title: newCourse.title,
      description: newCourse.description,
      instructor_id: newCourse.instructor_id ? parseInt(newCourse.instructor_id) : undefined
    };
    
    setCourses([...courses, course]);
    setNewCourse({ title: "", description: "", instructor_id: "" });
    setShowAddCourse(false);
    toast.success("Course created!");
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success("Course deleted");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You must be an admin to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">School Admin Dashboard</h1>
            <p className="opacity-90">Manage your school, users, and courses</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">
                    {users.filter(u => u.role === "student").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Teachers</p>
                  <p className="text-3xl font-bold text-foreground">
                    {users.filter(u => u.role === "instructor").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-foreground">{courses.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="border-b border-border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("school")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "school"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <School size={18} className="inline mr-2" />
                  School Information
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "users"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Users size={18} className="inline mr-2" />
                  Manage Users
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "courses"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <BookOpen size={18} className="inline mr-2" />
                  Manage Courses
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* School Information Tab */}
              {activeTab === "school" && school && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">School Information</h2>
                    {!isEditingSchool ? (
                      <button
                        onClick={() => setIsEditingSchool(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditedSchool(school);
                            setIsEditingSchool(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveSchool}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Save size={18} />
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
                      {isEditingSchool ? (
                        <input
                          type="text"
                          value={editedSchool.name || ""}
                          onChange={(e) => setEditedSchool({ ...editedSchool, name: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-foreground">{school.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">School Code</label>
                      <p className="text-foreground font-mono">{school.school_code}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                      {isEditingSchool ? (
                        <input
                          type="text"
                          value={editedSchool.location || ""}
                          onChange={(e) => setEditedSchool({ ...editedSchool, location: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-foreground">{school.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
                      {isEditingSchool ? (
                        <input
                          type="email"
                          value={editedSchool.contact_email || ""}
                          onChange={(e) => setEditedSchool({ ...editedSchool, contact_email: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-foreground">{school.contact_email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Contact Phone</label>
                      {isEditingSchool ? (
                        <input
                          type="tel"
                          value={editedSchool.contact_phone || ""}
                          onChange={(e) => setEditedSchool({ ...editedSchool, contact_phone: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-foreground">{school.contact_phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Total Students</label>
                      <p className="text-foreground">{school.student_count}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Management Tab */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
                    <button
                      onClick={() => setShowAddUser(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <UserPlus size={18} />
                      Add User
                    </button>
                  </div>

                  {/* Add User Form */}
                  {showAddUser && (
                    <div className="bg-muted border border-border rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Create New User</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "student" | "instructor" })}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Teacher</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAddUser(false)}
                          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddUser}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Create User
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 text-sm text-foreground">{user.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                user.role === "instructor" 
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              }`}>
                                {user.role === "instructor" ? "Teacher" : "Student"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Courses Management Tab */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Manage Courses</h2>
                    <button
                      onClick={() => setShowAddCourse(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={18} />
                      Add Course
                    </button>
                  </div>

                  {/* Add Course Form */}
                  {showAddCourse && (
                    <div className="bg-muted border border-border rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Create New Course</h3>
                      <div className="space-y-4 mb-4">
                        <input
                          type="text"
                          placeholder="Course Title"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <textarea
                          placeholder="Course Description"
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                        <select
                          value={newCourse.instructor_id}
                          onChange={(e) => setNewCourse({ ...newCourse, instructor_id: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Instructor (Optional)</option>
                          {users.filter(u => u.role === "instructor").map(instructor => (
                            <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAddCourse(false)}
                          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCourse}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Create Course
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Courses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                            {course.instructor_name && (
                              <p className="text-xs text-muted-foreground">
                                Instructor: {course.instructor_name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}