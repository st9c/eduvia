import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Trash2, Bold, Italic, Underline, Link as LinkIcon, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FeedPost {
  id: number;
  author_id: number;
  author_name: string;
  avatar_initials: string;
  course_id: string;
  course_name: string;
  content: string;
  created_at: string;
  likes: number;
  replies: FeedReply[];
  liked_by_user: boolean;
  attachments?: string[];
}

interface FeedReply {
  id: number;
  author_name: string;
  avatar_initials: string;
  content: string;
  created_at: string;
  likes: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_initials: string;
}

export function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: 1,
      author_id: 2,
      author_name: "Dr. Sarah Johnson",
      avatar_initials: "SJ",
      course_id: "cs101",
      course_name: "Introduction to Computer Science",
      content:
        "Great progress on your assignments everyone! Remember the final project is due in 3 weeks. Make sure to start early and ask questions if you get stuck.",
      created_at: "2024-12-10T10:30:00Z",
      likes: 12,
      replies: [
        {
          id: 101,
          author_name: "John Doe",
          avatar_initials: "JD",
          content: "Thanks for the reminder! I'll start working on it this week.",
          created_at: "2024-12-10T11:00:00Z",
          likes: 2,
        },
      ],
      liked_by_user: false,
      attachments: [],
    },
    {
      id: 2,
      author_id: 1,
      author_name: "John Doe",
      avatar_initials: "JD",
      course_id: "cs101",
      course_name: "Introduction to Computer Science",
      content:
        "Can anyone help me understand the binary tree implementation? I'm stuck on the traversal methods.",
      created_at: "2024-12-09T14:20:00Z",
      likes: 5,
      replies: [
        {
          id: 102,
          author_name: "Dr. Sarah Johnson",
          avatar_initials: "SJ",
          content:
            "Great question! The key is understanding the recursive nature of tree traversal. I recommend checking out the algorithm visualization tool in the course materials.",
          created_at: "2024-12-09T15:30:00Z",
          likes: 8,
        },
      ],
      liked_by_user: false,
      attachments: [],
    },
    {
      id: 3,
      author_id: 3,
      author_name: "Emily Brown",
      avatar_initials: "EB",
      course_id: "math201",
      course_name: "Advanced Mathematics",
      content:
        "Just finished the calculus assignment! That final problem was really challenging but satisfying to solve. 💪",
      created_at: "2024-12-08T16:45:00Z",
      likes: 18,
      replies: [],
      liked_by_user: false,
      attachments: [],
    },
  ]);

  const [newPostContent, setNewPostContent] = useState("");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<Record<number, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Get current user from localStorage
  const currentUser = (() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })() as User | null;

  const isInstructor = currentUser?.role === "instructor";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:", "https://");
    if (url) {
      applyFormatting("createLink", url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = contentEditableRef.current?.innerText.trim();
    
    if (!content) {
      toast.error("Please write something before posting");
      return;
    }

    const newPost: FeedPost = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      author_id: currentUser?.id || 1,
      author_name: currentUser?.name || "John Doe",
      avatar_initials: currentUser?.avatar_initials || "JD",
      course_id: "cs101",
      course_name: "Introduction to Computer Science",
      content: content,
      created_at: new Date().toISOString(),
      likes: 0,
      replies: [],
      liked_by_user: false,
      attachments: attachments.map((f) => f.name),
    };

    setPosts([newPost, ...posts]);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
    }
    setAttachments([]);
    toast.success("Post created successfully!");
  };

  const handleClearFeed = () => {
    if (!isInstructor) {
      toast.error("Only instructors can clear the feed");
      return;
    }

    if (window.confirm("Are you sure you want to delete all posts? This cannot be undone.")) {
      setPosts([]);
      toast.success("Feed cleared successfully");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked_by_user: !post.liked_by_user,
            likes: post.liked_by_user ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleReplySubmit = (postId: number) => {
    const content = replyContent[postId];
    if (!content?.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [
              ...post.replies,
              {
                id: Math.max(...post.replies.map((r) => r.id), 100) + 1,
                author_name: currentUser?.name || "John Doe",
                avatar_initials: currentUser?.avatar_initials || "JD",
                content,
                created_at: new Date().toISOString(),
                likes: 0,
              },
            ],
          };
        }
        return post;
      })
    );

    setReplyContent({ ...replyContent, [postId]: "" });
    toast.success("Reply posted!");
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Share with the Community</h2>
          {isInstructor && (
            <button
              onClick={handleClearFeed}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 size={16} />
              Clear Feed
            </button>
          )}
        </div>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground">
              {currentUser?.avatar_initials || "AC"}
            </div>
            <div className="flex-1 space-y-3">
              {/* Text Formatting Toolbar */}
              <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => applyFormatting("bold")}
                  title="Bold"
                  className="p-2 hover:bg-background rounded transition-colors text-foreground"
                >
                  <Bold size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting("italic")}
                  title="Italic"
                  className="p-2 hover:bg-background rounded transition-colors text-foreground"
                >
                  <Italic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting("underline")}
                  title="Underline"
                  className="p-2 hover:bg-background rounded transition-colors text-foreground"
                >
                  <Underline size={18} />
                </button>
                <div className="w-px bg-border" />
                <button
                  type="button"
                  onClick={insertLink}
                  title="Add Link"
                  className="p-2 hover:bg-background rounded transition-colors text-foreground"
                >
                  <LinkIcon size={18} />
                </button>
                <div className="w-px bg-border" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File"
                  className="p-2 hover:bg-background rounded transition-colors text-foreground"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*"
                />
              </div>

              {/* Content Editor */}
              <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24 whitespace-pre-wrap break-words"
                onInput={(e) => {
                  // Keep track of content for validation
                  setNewPostContent((e.target as HTMLDivElement).innerText);
                }}
              />

              {/* Attachments Display */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Attachments:</p>
                  <div className="space-y-2">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-muted p-2 rounded border border-border"
                      >
                        <span className="text-sm text-foreground truncate">
                          📎 {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-1 hover:bg-background rounded transition-colors text-foreground"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (contentEditableRef.current) {
                  contentEditableRef.current.innerHTML = "";
                }
                setAttachments([]);
                setNewPostContent("");
              }}
              className="px-4 py-2 rounded-lg text-foreground border border-border hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {post.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{post.author_name}</h4>
                        <p className="text-xs text-muted-foreground">{post.course_name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 py-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {post.content}
                </p>
                {post.attachments && post.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {post.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-primary">
                        <Paperclip size={14} />
                        <span>{attachment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-3 border-t border-border flex items-center justify-between text-sm">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    post.liked_by_user 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Heart size={16} className={post.liked_by_user ? "fill-current" : ""} />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>{post.replies.length}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Share2 size={16} />
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                        {reply.avatar_initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">
                            {reply.author_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {expandedPost === post.id && (
                <div className="px-6 py-4 border-t border-border bg-muted/20">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground">
                      {currentUser?.avatar_initials || "AC"}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={replyContent[post.id] || ""}
                        onChange={(e) =>
                          setReplyContent({ ...replyContent, [post.id]: e.target.value })
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplySubmit(post.id);
                          }
                        }}
                        placeholder="Write a reply..."
                        className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => handleReplySubmit(post.id)}
                        disabled={!replyContent[post.id]?.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
