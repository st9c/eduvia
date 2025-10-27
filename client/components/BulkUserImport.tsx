import { useState } from "react";
import { Upload, Download, X, CheckCircle, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";

interface BulkUserImportProps {
  onClose: () => void;
  onImport: (users: any[]) => void;
}

export function BulkUserImport({ onClose, onImport }: BulkUserImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv") {
        toast.error("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",").map(h => h.trim());
    
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length === headers.length) {
        const user: any = {};
        headers.forEach((header, index) => {
          user[header.toLowerCase()] = values[index];
        });
        users.push(user);
      }
    }
    return users;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const users = parseCSV(text);
      
      // Validate users
      const errors: string[] = [];
      const validUsers = users.filter((user, index) => {
        if (!user.name || !user.email || !user.role) {
          errors.push(`Row ${index + 2}: Missing required fields (name, email, role)`);
          return false;
        }
        if (!["student", "instructor"].includes(user.role.toLowerCase())) {
          errors.push(`Row ${index + 2}: Invalid role "${user.role}"`);
          return false;
        }
        return true;
      });

      setResults({
        success: validUsers.length,
        failed: errors.length,
        errors,
      });

      if (validUsers.length > 0) {
        onImport(validUsers);
        toast.success(`Successfully imported ${validUsers.length} users!`);
      }
    } catch (error) {
      toast.error("Failed to parse CSV file");
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = "name,email,role,password\nJohn Doe,john@example.com,student,password123\nJane Smith,jane@example.com,instructor,password123";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">Bulk User Import</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to import users:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Download the CSV template</li>
              <li>Fill in user information (name, email, role, password)</li>
              <li>Upload the completed CSV file</li>
              <li>Review and confirm the import</li>
            </ol>
          </div>

          {/* Download Template */}
          <button
            onClick={downloadTemplate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Download size={20} />
            Download CSV Template
          </button>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Success</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                    {results.success}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle size={20} />
                    <span className="font-semibold">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-2">
                    {results.failed}
                  </p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Errors:
                  </h4>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1 max-h-40 overflow-y-auto">
                    {results.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {importing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Import Users
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}