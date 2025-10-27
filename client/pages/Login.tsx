import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate school code for non-admin users
    if (!isAdmin && !schoolCode) {
      setError("School code is required");
      toast.error("School code is required");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, schoolCode: isAdmin ? undefined : schoolCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-block h-12 w-12 rounded-lg bg-primary-foreground flex items-center justify-center mb-4">
            <span className="text-lg font-bold text-primary">AC</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Academy
          </h1>
          <p className="text-primary-foreground/80">
            Welcome back. Let's continue learning.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-3">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* School Code Field (hidden for admins) */}
            {!isAdmin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  School Code
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Format: 3 letters + 3 numbers (e.g., ABC123)
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Admin Toggle */}
          <div className="mt-4 flex items-center justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  if (e.target.checked) setSchoolCode("");
                }}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">
                I'm an administrator
              </span>
            </label>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 text-center font-medium">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-muted-foreground bg-muted p-3 rounded">
              <p>
                <strong>Admin Account</strong>
              </p>
              <p>Email: admin@example.com</p>
              <p>Password: password123</p>
              <p className="text-xs italic">(Check "I'm an administrator")</p>
              
              <p className="mt-2">
                <strong>Student Account</strong>
              </p>
              <p>Email: student@example.com</p>
              <p>Password: password123</p>
              <p>School Code: CEN001</p>
              
              <p className="mt-2">
                <strong>Instructor Account</strong>
              </p>
              <p>Email: instructor@example.com</p>
              <p>Password: password123</p>
              <p>School Code: CEN001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
