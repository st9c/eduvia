import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import express from "express";
import cors from "cors";
import { handleDemo } from "./server/routes/demo";
import { handleSignup, handleLogin, handleVerifyToken, handleLogout } from "./server/routes/auth";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollCourse,
} from "./server/routes/courses";
import {
  getAssignments,
  createAssignment,
  submitAssignment,
  getSubmission,
  gradeSubmission,
  getAssignmentSubmissions,
  deleteAssignment,
} from "./server/routes/assignments";
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} from "./server/routes/messages";
import { upload } from "./server/middleware/upload";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Create Express app directly for dev server
      const app = express();
      
      // Middleware
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // API routes
      app.get("/api/ping", (_req, res) => {
        res.json({ message: "pong" });
      });
      app.get("/api/demo", handleDemo);

      // Auth routes
      app.post("/api/auth/signup", handleSignup);
      app.post("/api/auth/login", handleLogin);
      app.post("/api/auth/verify", handleVerifyToken);
      app.post("/api/auth/logout", handleLogout);

      // Course routes
      app.get("/api/courses", getAllCourses);
      app.get("/api/courses/:id", getCourseById);
      app.post("/api/courses", createCourse);
      app.put("/api/courses/:id", updateCourse);
      app.post("/api/courses/:id/enroll", enrollCourse);

      // Assignments routes
      app.get("/api/courses/:courseId/assignments", getAssignments);
      app.post("/api/courses/:courseId/assignments", createAssignment);
      app.delete("/api/assignments/:assignmentId", deleteAssignment);
      app.post("/api/assignments/:assignmentId/submit", upload.single("file"), submitAssignment);
      app.get("/api/assignments/:assignmentId/submission", getSubmission);
      app.get("/api/assignments/:assignmentId/submissions", getAssignmentSubmissions);
      app.post("/api/submissions/:submissionId/grade", gradeSubmission);

      // Serve uploaded files
      app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

      // Messages routes
      app.get("/api/conversations", getConversations);
      app.post("/api/conversations", createConversation);
      app.get("/api/conversations/:conversationId/messages", getMessages);
      app.post("/api/conversations/:conversationId/messages", sendMessage);
      
      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
