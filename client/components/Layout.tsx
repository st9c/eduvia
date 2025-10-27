import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationCenter } from "./NotificationCenter";
import { GlobalSearch } from "./GlobalSearch";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  LogOut,
  Bell,
  User,
  Moon,
  Sun,
  Award,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

interface CurrentUser {
  id: number;
  email: string;
  name: string;
  avatar_initials: string;
  role: string;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Different navigation for admin vs students/teachers
  const allNavItems = user?.role === "admin" 
    ? [
        { path: "/messages", icon: MessageSquare, label: "Messages" },
        { path: "/admin", icon: Shield, label: "Admin Dashboard" },
      ]
    : [
        { path: "/", icon: Home, label: "Feed" },
        { path: "/courses", icon: BookOpen, label: "Courses" },
        { path: "/calendar", icon: Calendar, label: "Assignments" },
        { path: "/grades", icon: Award, label: "Grades" },
        { path: "/messages", icon: MessageSquare, label: "Messages" },
      ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:static lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-bold text-sidebar-primary-foreground">
                  AC
                </span>
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">
                Academy
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent rounded p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-3 py-4">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                    isActive(item.path)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border px-3 py-4">
            {user && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
                <p className="text-xs text-sidebar-foreground/70 font-medium">
                  Logged in as
                </p>
                <p className="text-sm font-semibold text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
            )}
            <Link
              to="/profile"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors mt-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu size={20} className="text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {allNavItems.find((item) => isActive(item.path))?.label ||
                "Academy"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon size={20} className="text-foreground" />
              ) : (
                <Sun size={20} className="text-foreground" />
              )}
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-xs font-bold text-primary-foreground">
                {user?.avatar_initials || "AC"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="bg-background">{children}</div>
        </main>
      </div>
    </div>
  );
}
