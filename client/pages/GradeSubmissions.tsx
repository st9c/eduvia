import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle, Clock, User, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: number;
  student_name: string;
  student_email: string;
  file_name: string;
  submitted_at: string;
  status: "pending" | "submitted" | "graded";
  grade: number | null;
  feedback: string | null;
}

export default function GradeSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setSubmissions([
      {
        id: 1,
        student_name: "John Doe",
        student_email: "john@example.com",
        file_name: "algorithm_project.zip",
        submitted_at: "Dec 14, 2024 at 3:45 PM",
        status: "submitted",
        grade: null,
        feedback: null,
      },
      {
        id: 2,
        student_name: "Emily Brown",
        student_email: "emily@example.com",
        file_name: "sorting_algorithm.cpp",
        submitted_at: "Dec 13, 2024 at 2:30 PM",
        status: "graded",
        grade: 95,
        feedback: "Excellent work! Your implementation is very efficient.",
      },
      {
        id: 3,
        student_name: "Alex Martinez",
        student_email: "alex@example.com",
        file_name: "project_submission.pdf",
        submitted_at: "Dec 15, 2024 at 11:20 AM",
        status: "submitted",
        grade: null,
        feedback: null,
      },
    ]);
  }, [assignmentId]);

  const handleGradeSubmission = async () => {
    if (!selectedSubmission) return;
    
    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error("Please enter a valid grade between 0 and 100");
      return;
    }

    setIsGrading(true);
    try {
      // In real app, call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmissions(submissions.map(s =>
        s.id === selectedSubmission.id
          ? { ...s, grade: gradeNum, feedback, status: "graded" as const }
          : s
      ));
      
      toast.success("Submission graded successfully!");
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    } catch (error) {
      toast.error("Failed to grade submission");
    } finally {
      setIsGrading(false);
    }
  };

  const openGradingModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || "");
    setFeedback(submission.feedback || "");
  };

  const gradedCount = submissions.filter(s => s.status === "graded").length;
  const pendingCount = submissions.filter(s => s.status === "submitted").length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Assignments
            </button>
            <h1 className="text-4xl font-bold mb-2">Grade Submissions</h1>
            <p className="opacity-90">Algorithm Design Project</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-foreground">{submissions.length}</p>
                </div>
                <FileText size={24} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Graded</p>
                  <p className="text-3xl font-bold text-foreground">{gradedCount}</p>
                </div>
                <CheckCircle size={24} className="text-green-500" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <Clock size={24} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Student Submissions</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">File</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Submitted</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Grade</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {submission.student_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{submission.student_name}</p>
                            <p className="text-xs text-muted-foreground">{submission.student_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="text-sm text-foreground">{submission.file_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {submission.submitted_at}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {submission.grade !== null ? (
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {submission.grade}/100
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          submission.status === "graded"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        }`}>
                          {submission.status === "graded" ? "Graded" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toast.info("Download functionality coming soon")}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Download submission"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => openGradingModal(submission)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            {submission.status === "graded" ? "Edit Grade" : "Grade"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Grade Submission</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-primary" />
                  <span className="font-semibold text-foreground">{selectedSubmission.student_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText size={16} />
                  {selectedSubmission.file_name}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar size={16} />
                  Submitted: {selectedSubmission.submitted_at}
                </div>
              </div>

              {/* Grade Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter grade..."
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Provide feedback to the student..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGradeSubmission}
                  disabled={isGrading || !grade}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGrading ? "Saving..." : "Save Grade"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}