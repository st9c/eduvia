import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, BookOpen, Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  type: "course" | "assignment" | "user" | "message";
  title: string;
  subtitle?: string;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - in real app, fetch from API
  const allData: SearchResult[] = [
    { id: "1", type: "course", title: "Introduction to Computer Science", subtitle: "Dr. Sarah Johnson", url: "/courses/cs101" },
    { id: "2", type: "course", title: "Advanced Mathematics", subtitle: "Prof. Michael Chen", url: "/courses/math201" },
    { id: "3", type: "assignment", title: "Algorithm Design Project", subtitle: "Due Dec 15", url: "/calendar" },
    { id: "4", type: "assignment", title: "Calculus Problem Set #7", subtitle: "Due Dec 12", url: "/calendar" },
    { id: "5", type: "user", title: "Dr. Sarah Johnson", subtitle: "Instructor", url: "/profile" },
    { id: "6", type: "user", title: "Emily Brown", subtitle: "Student", url: "/profile" },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen size={18} className="text-blue-500" />;
      case "assignment":
        return <FileText size={18} className="text-green-500" />;
      case "user":
        return <Users size={18} className="text-purple-500" />;
      case "message":
        return <MessageSquare size={18} className="text-amber-500" />;
      default:
        return <Search size={18} className="text-gray-500" />;
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:bg-background transition-colors"
      >
        <Search size={16} />
        <span>Search...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-background border border-border rounded">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Search size={20} className="text-foreground" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
            <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={20} className="text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, assignments, users..."
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                      >
                        {getIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Search size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Start typing to search...</p>
                    <p className="text-xs mt-2">Try searching for courses, assignments, or users</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border bg-muted flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↑↓</kbd> to navigate</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">Enter</kbd> to select</span>
                </div>
                <span>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}