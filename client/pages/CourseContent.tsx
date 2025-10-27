import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, FileText, Video, Link as LinkIcon, 
  Download, Trash2, Plus, Folder, File, Eye 
} from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: number;
  type: "pdf" | "video" | "link" | "document";
  title: string;
  description?: string;
  url: string;
  size?: string;
  uploadedAt: string;
  views: number;
}

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([
    {
      id: 1,
      type: "pdf",
      title: "Course Syllabus",
      description: "Complete course outline and grading policy",
      url: "/content/syllabus.pdf",
      size: "2.4 MB",
      uploadedAt: "Dec 1, 2024",
      views: 45,
    },
    {
      id: 2,
      type: "video",
      title: "Lecture 1: Introduction",
      description: "Overview of course topics and objectives",
      url: "https://youtube.com/watch?v=example",
      uploadedAt: "Dec 5, 2024",
      views: 38,
    },
    {
      id: 3,
      type: "pdf",
      title: "Chapter 1 Notes",
      description: "Detailed notes on algorithms and data structures",
      url: "/content/chapter1.pdf",
      size: "5.1 MB",
      uploadedAt: "Dec 8, 2024",
      views: 32,
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newContent, setNewContent] = useState({
    type: "pdf" as "pdf" | "video" | "link" | "document",
    title: "",
    description: "",
    url: "",
  });

  const handleUpload = () => {
    if (!newContent.title || !newContent.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    const item: ContentItem = {
      id: Date.now(),
      type: newContent.type,
      title: newContent.title,
      description: newContent.description,
      url: newContent.url,
      uploadedAt: new Date().toLocaleDateString(),
      views: 0,
    };

    setContent([item, ...content]);
    setShowUploadModal(false);
    setNewContent({ type: "pdf", title: "", description: "", url: "" });
    toast.success("Content uploaded successfully!");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setContent(content.filter(c => c.id !== id));
      toast.success("Content deleted");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText size={24} className="text-red-500" />;
      case "video":
        return <Video size={24} className="text-blue-500" />;
      case "link":
        return <LinkIcon size={24} className="text-green-500" />;
      default:
        return <File size={24} className="text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Course
            </button>
            <h1 className="text-4xl font-bold mb-2">Course Materials</h1>
            <p className="opacity-90">Introduction to Computer Science</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Upload Button */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">All Materials</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              Upload Material
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getIcon(item.type)}
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{item.uploadedAt}</span>
                  {item.size && <span>{item.size}</span>}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {item.views} views
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toast.info("Opening content...")}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => toast.info("Downloading...")}
                    className="px-3 py-2 border border-border text-foreground rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {content.length === 0 && (
            <div className="text-center py-12">
              <Folder size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No materials uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Upload Material</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content Type
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="link">External Link</option>
                  <option value="document">Document</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter title..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter description..."
                />
              </div>

              {/* URL/File */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {newContent.type === "link" ? "URL" : "File"} *
                </label>
                {newContent.type === "link" ? (
                  <input
                    type="url"
                    value={newContent.url}
                    onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewContent({ ...newContent, url: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                    className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}