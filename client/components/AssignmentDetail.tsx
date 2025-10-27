import { useState } from "react";
import { X, Upload, FileText, Calendar, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

interface AssignmentDetailProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    course: string;
    status: "pending" | "submitted" | "graded" | "overdue";
    points?: number;
    grade?: number;
    feedback?: string;
    submission?: {
      file_name: string;
      submitted_at: string;
    };
  };
  onClose: () => void;
  onSubmit?: (file: File) => void;
  userRole: "student" | "instructor" | "admin";
}

export function AssignmentDetail({ assignment, onClose, onSubmit, userRole }: AssignmentDetailProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to submit");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would upload to the server
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      
      if (onSubmit) {
        onSubmit(selectedFile);
      }
      
      toast.success("Assignment submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch (assignment.status) {
      case "submitted":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "graded":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "overdue":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
    }
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case "submitted":
      case "graded":
        return <CheckCircle size={16} />;
      case "overdue":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{assignment.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>
              {getStatusIcon()}
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
            {assignment.points && (
              <span className="text-sm text-muted-foreground">
                Worth {assignment.points} points
              </span>
            )}
          </div>

          {/* Assignment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-foreground">Due: {assignment.dueDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-foreground">Course: {assignment.course}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-foreground leading-relaxed">{assignment.description}</p>
          </div>

          {/* Grade Display (if graded) */}
          {assignment.status === "graded" && assignment.grade !== undefined && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Grade</h3>
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {assignment.grade}/{assignment.points || 100}
                </span>
              </div>
              {assignment.feedback && (
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Feedback:</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{assignment.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Info (if submitted) */}
          {assignment.submission && (
            <div className="bg-muted border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Your Submission</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{assignment.submission.file_name}</span>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                  <Download size={14} />
                  Download
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Submitted on {assignment.submission.submitted_at}
              </p>
            </div>
          )}

          {/* File Upload (for students who haven't submitted) */}
          {userRole === "student" && assignment.status === "pending" && (
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Submit Your Work</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Overdue Warning */}
          {assignment.status === "overdue" && userRole === "student" && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle size={20} />
                <p className="font-semibold">This assignment is overdue</p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                You may still be able to submit with a late penalty. Contact your instructor for details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}