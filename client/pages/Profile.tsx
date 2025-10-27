import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Award, BookOpen, TrendingUp, Users, GraduationCap, School } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_initials: string;
  phone?: string;
  location?: string;
  bio?: string;
  joined_date?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const fullUser = {
        ...parsedUser,
        phone: parsedUser.phone || "+1 (555) 123-4567",
        location: parsedUser.location || "New York, NY",
        bio: parsedUser.bio || "Passionate learner exploring new technologies and expanding my knowledge.",
        joined_date: parsedUser.joined_date || "September 2024",
      };
      setUser(fullUser);
      setEditedUser(fullUser);
    }
  }, []);

  const handleSave = () => {
    if (editedUser) {
      localStorage.setItem("user", JSON.stringify(editedUser));
      setUser(editedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    toast.info("Changes cancelled");
  };

  // Different stats for admin vs students vs teachers
  const getStats = () => {
    if (user?.role === "admin") {
      // Load school data for admin stats
      const schoolUsers = JSON.parse(localStorage.getItem("school_users") || "[]");
      const schoolCourses = JSON.parse(localStorage.getItem("school_courses") || "[]");
      const studentCount = schoolUsers.filter((u: any) => u.role === "student").length;
      const teacherCount = schoolUsers.filter((u: any) => u.role === "instructor").length;
      
      return [
        { label: "Total Students", value: studentCount.toString(), icon: GraduationCap, color: "text-blue-500" },
        { label: "Total Teachers", value: teacherCount.toString(), icon: Users, color: "text-green-500" },
        { label: "Total Courses", value: schoolCourses.length.toString(), icon: School, color: "text-purple-500" },
      ];
    } else if (user?.role === "student") {
      // Student stats - academic performance
      return [
        { label: "Courses Enrolled", value: "4", icon: BookOpen, color: "text-blue-500" },
        { label: "Assignments Completed", value: "12", icon: Award, color: "text-green-500" },
        { label: "Average Grade", value: "A-", icon: TrendingUp, color: "text-purple-500" },
      ];
    } else {
      // Teacher/Instructor stats
      return [
        { label: "Courses Teaching", value: "3", icon: BookOpen, color: "text-blue-500" },
        { label: "Total Students", value: "85", icon: GraduationCap, color: "text-green-500" },
        { label: "Assignments Created", value: "24", icon: Award, color: "text-purple-500" },
      ];
    }
  };

  const stats = getStats();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 h-48 relative">
          <div className="absolute -bottom-16 left-0 right-0">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-background shadow-xl">
                    {user.avatar_initials}
                  </div>
                  <button 
                    onClick={() => toast.info("Avatar upload coming soon!")}
                    className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                      <p className="text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Save size={18} />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                {isEditing ? (
                  <textarea
                    value={editedUser?.bio || ""}
                    onChange={(e) => setEditedUser({ ...editedUser!, bio: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-foreground leading-relaxed">{user.bio}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                      <Mail size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser?.email || ""}
                          onChange={(e) => setEditedUser({ ...editedUser!, email: e.target.value })}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedUser?.phone || ""}
                          onChange={(e) => setEditedUser({ ...editedUser!, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Location</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser?.location || ""}
                          onChange={(e) => setEditedUser({ ...editedUser!, location: e.target.value })}
                          className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground">{user.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Details */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Account Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar size={16} className="text-primary" />
                      {user.joined_date}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                    <p className="text-sm font-medium text-foreground capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">User ID</p>
                    <p className="text-sm font-medium text-foreground">#{user.id}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button 
                    onClick={() => toast.info("Change password feature coming soon!")}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => toast.info("Privacy settings coming soon!")}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Privacy Settings
                  </button>
                  <button 
                    onClick={() => toast.info("Notification preferences coming soon!")}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Notification Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}