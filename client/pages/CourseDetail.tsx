import { Layout } from "@/components/Layout";
import { useParams } from "react-router-dom";
import { Users, Calendar, FileText, MessageSquare, Settings } from "lucide-react";
import { AssignmentCard } from "@/components/AssignmentCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [postContent, setPostContent] = useState("");
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Mock course data
  const course = {
    id: courseId,
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    description:
      "A comprehensive introduction to computer science fundamentals, covering algorithms, data structures, and programming best practices.",
    startDate: "Sep 1, 2024",
    endDate: "Dec 20, 2024",
    students: 128,
    color: "blue",
    assignments: 5,
    progress: 75,
    syllabus:
      "This course covers the fundamentals of computer science including basic programming concepts, data structures, algorithms, and problem-solving techniques.",
  };

  const assignments = [
    {
      id: "assign1",
      title: "Algorithm Design Project",
      course: courseId || "",
      dueDate: "Dec 15, 2024",
      status: "pending" as const,
      description: "Implement a sorting algorithm and analyze its complexity",
    },
    {
      id: "assign2",
      title: "Data Structure Implementation",
      course: courseId || "",
      dueDate: "Dec 8, 2024",
      status: "submitted" as const,
      description: "Build a linked list with all basic operations",
    },
    {
      id: "assign3",
      title: "Programming Challenge",
      course: courseId || "",
      dueDate: "Nov 30, 2024",
      status: "submitted" as const,
      description: "Solve algorithmic challenges on an online judge",
    },
  ];

  useEffect(() => {
    setFeedPosts([
      {
        id: 1,
        author: "Dr. Sarah Johnson",
        avatar: "SJ",
        timestamp: "2 hours ago",
        content:
          "Great progress on your assignments everyone! Remember the final project is due in 3 weeks.",
        likes: 12,
        liked: false,
      },
      {
        id: 2,
        author: "Emily Brown",
        avatar: "EB",
        timestamp: "1 day ago",
        content:
          "Can anyone help me understand the binary tree implementation? I'm stuck on the traversal methods.",
        likes: 5,
        replies: 3,
        liked: false,
      },
      {
        id: 3,
        author: "Alex Martinez",
        avatar: "AM",
        timestamp: "2 days ago",
        content:
          "Just finished the sorting algorithm assignment. The quicksort implementation was challenging but fun!",
        likes: 18,
        replies: 7,
        liked: false,
      },
    ]);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-100 mb-4">{course.instructor}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {course.startDate} - {course.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{course.students} students</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  About This Course
                </h2>
                <p className="text-foreground mb-4">{course.description}</p>
                <p className="text-muted-foreground">{course.syllabus}</p>
              </div>

              {/* Assignments */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Assignments
                </h2>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
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
              </div>

              {/* Course Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Course Feed
                  </h2>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <MessageSquare size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* New Post */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground">
                        JS
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Share something with your classmates..."
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          className="w-full bg-muted border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button 
                            onClick={() => {
                              setPostContent("");
                              toast.info("Post cancelled");
                            }}
                            className="px-4 py-2 rounded-lg text-foreground border border-border hover:bg-muted transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              if (!postContent.trim()) {
                                toast.error("Please write something before posting");
                                return;
                              }
                              const newPost = {
                                id: Date.now(),
                                author: currentUser?.name || "You",
                                avatar: currentUser?.avatar_initials || "YO",
                                timestamp: "Just now",
                                content: postContent,
                                likes: 0,
                                liked: false,
                              };
                              setFeedPosts([newPost, ...feedPosts]);
                              setPostContent("");
                              toast.success("Post created successfully!");
                            }}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feed Posts */}
                  {feedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                          {post.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {post.author}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-foreground mt-2">{post.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <button 
                              onClick={() => {
                                setFeedPosts(feedPosts.map(p => 
                                  p.id === post.id 
                                    ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
                                    : p
                                ));
                                toast.success(post.liked ? "Like removed" : "Post liked!");
                              }}
                              className={`hover:text-primary transition-colors flex items-center gap-1 ${
                                post.liked ? "text-primary font-semibold" : ""
                              }`}
                            >
                              {post.liked ? "👍" : "👍"} {post.likes}
                            </button>
                            {post.replies && (
                              <button className="hover:text-primary transition-colors">
                                {post.replies} replies
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Course Progress
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Grade: A- (90%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Course Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Instructor
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {course.instructor}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Students
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {course.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Assignments
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {assignments.length} total
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Message Instructor
                </button>
                <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <Settings size={16} />
                  Course Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
