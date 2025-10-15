// File: server/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment");
  process.exit(1);
}

// Ensure uploads dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Basic middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(UPLOAD_DIR)));

// In-memory data stores (reset on server restart)
const roles = { PROFESSOR: "PROFESSOR", STUDENT: "STUDENT" };

const db = {
  users: [],           // { id, email, name, passwordHash, role }
  courses: [],         // { id, title, description, professorId }
  enrollments: [],     // { id, courseId, studentId }
  assignments: [],     // { id, courseId, title, description, dueDateISO }
  submissions: [],     // { id, assignmentId, studentId, filePath, originalName, mimeType, sizeBytes, createdAtISO }
  messages: []         // { id, createdAtISO, senderId, recipientId, content, courseId? }
};

let idCounter = 1;
const genId = () => String(idCounter++);

// Auth utils
function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}
function authMiddleware(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ error: "Missing Authorization" });
  const [type, token] = hdr.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ error: "Invalid Authorization" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
function ensureProfessor(req, res, next) {
  if (!req.user || req.user.role !== roles.PROFESSOR) {
    return res.status(403).json({ error: "Requires professor role" });
  }
  next();
}
function ensureStudent(req, res, next) {
  if (!req.user || req.user.role !== roles.STUDENT) {
    return res.status(403).json({ error: "Requires student role" });
  }
  next();
}
function isEnrolled(courseId, studentId) {
  return db.enrollments.some(e => e.courseId === courseId && e.studentId === studentId);
}

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Auth
app.post("/api/auth/register", async (req, res) => {
  const { email, name, password, role } = req.body || {};
  if (!email || !name || !password || !role) return res.status(400).json({ error: "Missing fields" });
  if (![roles.PROFESSOR, roles.STUDENT].includes(role)) return res.status(400).json({ error: "Invalid role" });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = { id: genId(), email, name, passwordHash, role };
  db.users.push(user);
  const token = signToken(user);
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(user);
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Courses
app.post("/api/courses", authMiddleware, ensureProfessor, (req, res) => {
  const { title, description } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: "Missing fields" });
  const course = { id: genId(), title, description, professorId: req.user.id };
  db.courses.push(course);
  return res.json(course);
});

app.get("/api/courses", authMiddleware, (req, res) => {
  const user = req.user;
  if (user.role === roles.PROFESSOR) {
    const courses = db.courses.filter(c => c.professorId === user.id);
    return res.json(courses);
  } else {
    const enrolledIds = db.enrollments.filter(e => e.studentId === user.id).map(e => e.courseId);
    const courses = db.courses.filter(c => enrolledIds.includes(c.id));
    return res.json(courses);
  }
});

app.post("/api/courses/enroll", authMiddleware, ensureStudent, (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId) return res.status(400).json({ error: "Missing courseId" });
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (isEnrolled(courseId, req.user.id)) return res.status(400).json({ error: "Already enrolled" });
  const enrollment = { id: genId(), courseId, studentId: req.user.id };
  db.enrollments.push(enrollment);
  return res.json(enrollment);
});

// Assignments
app.post("/api/assignments", authMiddleware, ensureProfessor, (req, res) => {
  const { courseId, title, description, dueDate } = req.body || {};
  if (!courseId || !title || !description || !dueDate) return res.status(400).json({ error: "Missing fields" });
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (course.professorId !== req.user.id) return res.status(403).json({ error: "Not allowed" });
  const assignment = { id: genId(), courseId, title, description, dueDateISO: new Date(dueDate).toISOString() };
  db.assignments.push(assignment);
  return res.json(assignment);
});

app.get("/api/assignments/by-course/:courseId", authMiddleware, (req, res) => {
  const courseId = req.params.courseId;
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (req.user.role === roles.PROFESSOR) {
    if (course.professorId !== req.user.id) return res.status(403).json({ error: "Not allowed" });
  } else {
    if (!isEnrolled(courseId, req.user.id)) return res.status(403).json({ error: "Not enrolled" });
  }
  const assignments = db.assignments.filter(a => a.courseId === courseId);
  return res.json(assignments);
});

// File uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  }
});
const allowedMimes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/zip"
]);
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.has(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

app.post("/api/submissions", authMiddleware, ensureStudent, upload.single("file"), (req, res) => {
  const { assignmentId } = req.body || {};
  if (!assignmentId) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Missing assignmentId" });
  }
  const assignment = db.assignments.find(a => a.id === assignmentId);
  if (!assignment) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "Assignment not found" });
  }
  if (!isEnrolled(assignment.courseId, req.user.id)) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(403).json({ error: "Not enrolled" });
  }
  if (!req.file) return res.status(400).json({ error: "Missing file" });

  // Allow one submission per assignment per student (simple rule)
  const existing = db.submissions.find(s => s.assignmentId === assignmentId && s.studentId === req.user.id);
  if (existing) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Already submitted" });
  }

  const sub = {
    id: genId(),
    assignmentId,
    studentId: req.user.id,
    filePath: req.file.path,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    createdAtISO: new Date().toISOString()
  };
  db.submissions.push(sub);
  return res.json(sub);
});

app.get("/api/submissions/by-assignment/:assignmentId", authMiddleware, ensureProfessor, (req, res) => {
  const assignmentId = req.params.assignmentId;
  const assignment = db.assignments.find(a => a.id === assignmentId);
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });
  const course = db.courses.find(c => c.id === assignment.courseId);
  if (!course || course.professorId !== req.user.id) return res.status(403).json({ error: "Not allowed" });

  const submissions = db.submissions
    .filter(s => s.assignmentId === assignmentId)
    .map(s => ({
      ...s,
      student: db.users.find(u => u.id === s.studentId) ? {
        id: s.studentId,
        name: db.users.find(u => u.id === s.studentId).name,
        email: db.users.find(u => u.id === s.studentId).email
      } : null,
      downloadUrl: `/uploads/${path.basename(s.filePath)}`
    }));
  return res.json(submissions);
});

// Messages
app.post("/api/messages", authMiddleware, (req, res) => {
  const { recipientId, content, courseId } = req.body || {};
  if (!recipientId || !content) return res.status(400).json({ error: "Missing fields" });
  const recipient = db.users.find(u => u.id === recipientId);
  if (!recipient) return res.status(404).json({ error: "Recipient not found" });

  if (courseId) {
    const course = db.courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (req.user.role === roles.PROFESSOR && course.professorId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }
    if (req.user.role === roles.STUDENT && !isEnrolled(courseId, req.user.id)) {
      return res.status(403).json({ error: "Not enrolled" });
    }
  }

  const msg = {
    id: genId(),
    createdAtISO: new Date().toISOString(),
    senderId: req.user.id,
    recipientId,
    content,
    courseId: courseId || null
  };
  db.messages.push(msg);
  return res.json(msg);
});

app.get("/api/messages/inbox", authMiddleware, (req, res) => {
  const messages = db.messages
    .filter(m => m.recipientId === req.user.id)
    .sort((a, b) => new Date(b.createdAtISO) - new Date(a.createdAtISO))
    .map(m => ({
      ...m,
      sender: db.users.find(u => u.id === m.senderId)
        ? { id: m.senderId, name: db.users.find(u => u.id === m.senderId).name, email: db.users.find(u => u.id === m.senderId).email, role: db.users.find(u => u.id === m.senderId).role }
        : null
    }));
  res.json(messages);
});

app.get("/api/messages/sent", authMiddleware, (req, res) => {
  const messages = db.messages
    .filter(m => m.senderId === req.user.id)
    .sort((a, b) => new Date(b.createdAtISO) - new Date(a.createdAtISO))
    .map(m => ({
      ...m,
      recipient: db.users.find(u => u.id === m.recipientId)
        ? { id: m.recipientId, name: db.users.find(u => u.id === m.recipientId).name, email: db.users.find(u => u.id === m.recipientId).email, role: db.users.find(u => u.id === m.recipientId).role }
        : null
    }));
  res.json(messages);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Uploads served from /uploads`);
});
