import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function connectDB() {
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in environment variables.");
    console.log("Please add MONGODB_URI to your Secrets/Settings in AI Studio.");
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB successfully");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Retry connection after 30 seconds
    setTimeout(connectDB, 30000);
    return false;
  }
}

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  isTrialActive: { type: Boolean, default: true },
  trialStartDate: { type: Date, default: Date.now },
  subscriptionPlan: { type: String, enum: ['monthly', '6months', '1year', null], default: null },
  subscriptionStartDate: { type: Date, default: null },
  subscriptionEndDate: { type: Date, default: null },
  hasCourseAccess: { type: Boolean, default: false },
  progress: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLectures: [{ type: String }] // Array of lecture IDs
  }],
  profile: {
    photo: String,
    banner: String,
    bio: String,
    headline: String,
    skills: [String],
    projects: [{
      title: String,
      description: String,
      link: String
    }],
    resumeUrl: String,
    placementStatus: { type: String, enum: ['searching', 'placed', 'not-looking'], default: 'searching' },
    badges: [String], // e.g., ['Beginner', 'Active Learner', 'Top Performer', 'Placed Student']
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  social: {
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  isBlocked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const lockedContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['placement', 'notes', 'jobs', 'hackathons', 'coding'], required: true },
  content: { type: String, required: true }, // Could be a URL or text
  created_at: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  image_url: String,
  modules_count: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  type: { type: String, enum: ['paid', 'free'], default: 'paid' },
  landing_page: {
    benefits: [String],
    requirements: [String],
    target_audience: [String],
    curriculum_overview: String,
    instructor_name: String,
    instructor_bio: String,
    instructor_image: String
  },
  modules: [{
    title: { type: String, required: true },
    description: String,
    order: { type: Number, default: 0 },
    visibility: { type: String, enum: ['published', 'draft'], default: 'published' },
    lectures: [{
      title: { type: String, required: true },
      type: { type: String, enum: ['live', 'recorded'], required: true },
      youtubeLiveUrl: String,
      youtubeRecordedUrl: String,
      scheduledAt: Date,
      duration: Number, // in minutes
      status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' }
    }]
  }],
  created_at: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], default: 'Full-time' },
  salary: String,
  description: String,
  apply_url: String,
  posted_at: { type: Date, default: Date.now }
});

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., '1 Month', '6 Months', '1 Year'
  features: [String],
  planId: { type: String, required: true, unique: true } // e.g., 'monthly', '6months', '1year'
});

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sections: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }],
  isPublished: { type: Boolean, default: true },
  isHomepage: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now }
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'header', 'footer'
  links: [{
    label: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 }
  }]
});

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const Page = mongoose.model("Page", pageSchema);
const Menu = mongoose.model("Menu", menuSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Job = mongoose.model("Job", jobSchema);
const LockedContent = mongoose.model("LockedContent", lockedContentSchema);
const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
const Settings = mongoose.model("Settings", settingsSchema);

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Seed Initial Data
async function seedData() {
  try {
    // Seed Site Settings
    const siteSettings = await Settings.findOne({ key: 'site_settings' });
    if (!siteSettings) {
      await Settings.create({
        key: 'site_settings',
        value: {
          logoUrl: "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png",
          siteName: "Shiddat Programming Institute"
        }
      });
      console.log("✅ Site settings seeded");
    }
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.create([
        {
          title: "Full Stack Web Development (MERN)",
          description: "Master MongoDB, Express, React, and Node.js with real-world projects and industry best practices.",
          price: 4999,
          image_url: "https://picsum.photos/seed/mern/800/450",
          modules_count: 12,
          isPublished: true,
          type: 'paid',
          landing_page: {
            benefits: ['Master MERN Stack', 'Build 5+ Real Projects', 'Industry Mentorship', 'Placement Assistance'],
            requirements: ['Basic Computer Knowledge', 'Passion for Coding'],
            target_audience: ['Students', 'Job Seekers', 'Working Professionals'],
            curriculum_overview: "This course takes you from zero to a professional Full Stack Developer. You'll learn frontend with React, backend with Node.js, and database management with MongoDB.",
            instructor_name: "Dr. Shahid Pathan",
            instructor_bio: "Founder of Shiddat Programming Institute with 10+ years of experience in Software Development.",
            instructor_image: "https://picsum.photos/seed/shahid/200/200"
          },
          modules: [
            { title: "Introduction to Web Development", description: "Basics of HTML, CSS, and JS", order: 0, lectures: [{ title: "What is Web Development?", type: "recorded", duration: 45, status: "completed" }] },
            { title: "React Fundamentals", description: "Hooks, Components, and Props", order: 1, lectures: [{ title: "Introduction to React", type: "recorded", duration: 60, status: "completed" }] }
          ]
        },
        {
          title: "Python for Data Science & AI",
          description: "Learn Python programming, data analysis, and machine learning from industry experts.",
          price: 5999,
          image_url: "https://picsum.photos/seed/python/800/450",
          modules_count: 15,
          isPublished: true,
          type: 'paid',
          landing_page: {
            benefits: ['Python Mastery', 'Data Analysis Skills', 'AI & ML Projects', 'Career Guidance'],
            requirements: ['Basic Mathematics', 'Logical Thinking'],
            target_audience: ['Data Aspirants', 'Engineers', 'Research Students'],
            curriculum_overview: "Dive into the world of Data Science. Learn how to process data, build models, and deploy AI solutions using Python.",
            instructor_name: "Expert Mentor",
            instructor_bio: "Data Scientist with extensive experience in AI and Machine Learning.",
            instructor_image: "https://picsum.photos/seed/mentor/200/200"
          },
          modules: [
            { title: "Python Basics", description: "Syntax, Loops, and Functions", order: 0, lectures: [{ title: "Python Setup & Basics", type: "recorded", duration: 50, status: "completed" }] }
          ]
        }
      ]);
      console.log("🌱 Initial courses seeded.");
    }
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.create([
        { 
          title: "Software Engineer", 
          company: "Tech Solutions", 
          location: "Pune", 
          salary: "₹6L - ₹12L", 
          type: "Full-time",
          apply_url: "#",
          description: "We are looking for a Software Engineer with strong problem-solving skills."
        },
        { 
          title: "React Developer", 
          company: "Web Innovators", 
          location: "Mumbai", 
          salary: "₹8L - ₹15L", 
          type: "Full-time",
          apply_url: "#",
          description: "Join our team to build modern web applications using React."
        }
      ]);
      console.log("🌱 Initial jobs seeded.");
    }

    const planCount = await SubscriptionPlan.countDocuments();
    if (planCount === 0) {
      await SubscriptionPlan.create([
        { planId: 'monthly', name: 'Monthly Plan', price: 100, duration: '1 Month', features: ['Placement Materials', 'Notes', 'Job Listings', 'Hackathons', 'Coding Challenges'] },
        { planId: '6months', name: '6-Month Plan', price: 500, duration: '6 Months', features: ['Placement Materials', 'Notes', 'Job Listings', 'Hackathons', 'Coding Challenges', 'Priority Support'] },
        { planId: '1year', name: 'Yearly Plan', price: 900, duration: '1 Year', features: ['Placement Materials', 'Notes', 'Job Listings', 'Hackathons', 'Coding Challenges', 'Priority Support', 'Resume Review'] }
      ]);
      console.log("🌱 Initial subscription plans seeded.");
    }

    // Seed Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Shiddat@2026", 10);
      await User.create({
        name: "Shiddat Admin",
        email: "admin@shiddat.institute",
        password: hashedPassword,
        role: "admin",
        hasCourseAccess: true
      });
      console.log("🌱 Default Admin created: admin@shiddat.institute / Shiddat@2026");
    }

    // Seed Default Homepage
    const homepageExists = await Page.findOne({ isHomepage: true });
    if (!homepageExists) {
      await Page.create({
        title: "Home",
        slug: "home",
        isHomepage: true,
        isPublished: true,
        sections: [
          { id: 'hero-1', type: 'hero', isVisible: true, order: 0, content: { title: "Shiddat Programming Institute", subtitle: "Karad Madhil IT Specialization Che Ekmev Center", primaryCtaText: "Explore Courses", secondaryCtaText: "Join Trial", imageUrl: "https://picsum.photos/seed/hero/1920/1080" } },
          { id: 'trust-1', type: 'trust', isVisible: true, order: 1, content: { stats: [{ label: "Students", value: "10,000+" }, { label: "Placements", value: "500+" }, { label: "Courses", value: "20+" }] } }
        ]
      });
      console.log("🌱 Default Homepage seeded.");
    }

    // Seed Default Menus
    const headerMenuExists = await Menu.findOne({ name: 'header' });
    if (!headerMenuExists) {
      await Menu.create({
        name: 'header',
        links: [
          { label: 'Home', url: '/', order: 0 },
          { label: 'Courses', url: '/courses', order: 1 },
          { label: 'Jobs', url: '/jobs', order: 2 },
          { label: 'About', url: '/about', order: 3 }
        ]
      });
      console.log("🌱 Default Header Menu seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));

  // Multer configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ error: "User not found" });
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Admin access required" });
    }
  };

  // Auth Routes
  app.post("/api/admin/upload", authenticate, isAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role: 'student' });
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
      if (mongoose.connection.readyState !== 1) {
        console.error("Login failed: Database not connected");
        return res.status(503).json({ error: "Database not connected" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`Login failed: User not found for ${email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Login failed: Password mismatch for ${email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      console.log(`Login successful for: ${email}`);
      res.json(user);
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    res.json(req.user);
  });

  // Request Logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      uri_present: !!MONGODB_URI
    });
  });

  // Settings Routes
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const settings = await Settings.findOne({ key: req.params.key });
      if (!settings) return res.status(404).json({ message: "Settings not found" });
      res.json(settings.value);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/admin/settings/:key", authenticate, isAdmin, async (req, res) => {
    try {
      const settings = await Settings.findOneAndUpdate(
        { key: req.params.key },
        { value: req.body },
        { upsert: true, new: true }
      );
      res.json(settings.value);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

// Helper to update lecture statuses based on time
const updateLectureStatuses = (course: any) => {
  const now = new Date();
  let changed = false;
  course.modules.forEach((module: any) => {
    module.lectures.forEach((lecture: any) => {
      if (!lecture.scheduledAt) return;
      const scheduledAt = new Date(lecture.scheduledAt);
      const durationMs = (lecture.duration || 60) * 60 * 1000;
      const endsAt = new Date(scheduledAt.getTime() + durationMs);

      let newStatus = lecture.status;
      if (now < scheduledAt) {
        newStatus = 'upcoming';
      } else if (now >= scheduledAt && now < endsAt) {
        newStatus = 'live';
      } else {
        newStatus = 'completed';
      }

      if (lecture.status !== newStatus) {
        lecture.status = newStatus;
        changed = true;
      }
    });
  });
  return changed;
};

  app.get("/api/courses", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please check MONGODB_URI and IP Whitelist." });
    }
    try {
      const token = req.cookies.token;
      let isAdmin = false;
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const user = await User.findById(decoded.userId);
          if (user && user.role === 'admin') isAdmin = true;
        } catch (e) {}
      }

      const query = isAdmin ? {} : { isPublished: true };
      const courses = await Course.find(query).sort({ created_at: -1 });
      // Update statuses on the fly for display
      courses.forEach(c => updateLectureStatuses(c));
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      if (updateLectureStatuses(course)) {
        await course.save();
      }
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const jobs = await Job.find();
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/locked-content", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const content = await LockedContent.find();
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/admin/locked-content", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const content = await LockedContent.create(req.body);
      res.status(201).json(content);
    } catch (err) {
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  // Locked Content Endpoints

  app.put("/api/admin/locked-content/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const content = await LockedContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!content) return res.status(404).json({ error: "Content not found" });
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/admin/locked-content/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const content = await LockedContent.findByIdAndDelete(req.params.id);
      if (!content) return res.status(404).json({ error: "Content not found" });
      res.json({ message: "Content deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Subscription Plans Endpoints
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.post("/api/admin/subscription-plans", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      const plan = await SubscriptionPlan.create(req.body);
      res.status(201).json(plan);
    } catch (err) {
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.put("/api/admin/subscription-plans/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(plan);
    } catch (err) {
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/admin/subscription-plans/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      await SubscriptionPlan.findByIdAndDelete(req.params.id);
      res.json({ message: "Plan deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  app.post("/api/subscription/purchase", authenticate, async (req: any, res) => {
    const { planId } = req.body;
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const plan = await SubscriptionPlan.findOne({ planId });
      if (!plan) return res.status(400).json({ error: "Invalid plan" });

      const options = {
        amount: Math.round(plan.price * 100), // amount in the smallest currency unit
        currency: "INR",
        receipt: `sub_${Date.now()}`, // Shortened receipt ID (max 40 chars)
      };

      const order = await razorpay.orders.create(options);
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        planId: planId
      });
    } catch (err) {
      console.error('Error creating subscription order:', err);
      res.status(500).json({ error: "Failed to create subscription order" });
    }
  });

  app.post("/api/subscription/verify", authenticate, async (req: any, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const userId = req.user._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const plan = await SubscriptionPlan.findOne({ planId });
        if (!plan) return res.status(400).json({ error: "Invalid plan" });

        const startDate = new Date();
        const endDate = new Date();
        if (planId === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
        else if (planId === '6months') endDate.setMonth(endDate.getMonth() + 6);
        else if (planId === '1year') endDate.setFullYear(endDate.getFullYear() + 1);
        else return res.status(400).json({ error: "Invalid plan duration logic" });

        user.subscriptionPlan = planId;
        user.subscriptionStartDate = startDate;
        user.subscriptionEndDate = endDate;
        user.isTrialActive = false;
        await user.save();

        res.json(user);
      } catch (err) {
        console.error('Error verifying subscription payment:', err);
        res.status(500).json({ error: "Failed to activate subscription" });
      }
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  });

  app.get("/api/admin/subscription-report", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      const activeSubscribers = await User.countDocuments({ subscriptionEndDate: { $gt: new Date() } });
      const trialUsers = await User.countDocuments({ isTrialActive: true });
      const expiredSubscribers = await User.countDocuments({ subscriptionEndDate: { $lt: new Date() }, subscriptionPlan: { $ne: null } });
      
      const planBreakdown = await User.aggregate([
        { $match: { subscriptionPlan: { $ne: null } } },
        { $group: { _id: "$subscriptionPlan", count: { $sum: 1 } } }
      ]);

      res.json({
        activeSubscribers,
        trialUsers,
        expiredSubscribers,
        planBreakdown
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.get("/api/admin/subscribed-users", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      // Return all users so admin can enable/disable for anyone
      const users = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/enable-subscription/:userId", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      const { plan } = req.body;
      const validPlans = ['monthly', '6months', '1year'];
      const selectedPlan = validPlans.includes(plan) ? plan : 'monthly';

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const startDate = new Date();
      const endDate = new Date();
      if (selectedPlan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
      else if (selectedPlan === '6months') endDate.setMonth(endDate.getMonth() + 6);
      else if (selectedPlan === '1year') endDate.setFullYear(endDate.getFullYear() + 1);

      user.subscriptionPlan = selectedPlan;
      user.subscriptionStartDate = startDate;
      user.subscriptionEndDate = endDate;
      await user.save();

      res.json({ message: "Subscription enabled successfully", user });
    } catch (err) {
      res.status(500).json({ error: "Failed to enable subscription" });
    }
  });

  app.post("/api/admin/disable-subscription/:userId", authenticate, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      console.log(`Unauthorized disable attempt by user: ${req.user.email}`);
      return res.status(403).json({ error: "Unauthorized" });
    }
    try {
      console.log(`Disabling subscription for user ID: ${req.params.userId}`);
      const user = await User.findById(req.params.userId);
      if (!user) {
        console.log(`User not found: ${req.params.userId}`);
        return res.status(404).json({ error: "User not found" });
      }

      user.subscriptionPlan = null;
      user.subscriptionEndDate = new Date(); // Expire it now
      await user.save();

      console.log(`Successfully disabled subscription for user: ${user.email}`);
      res.json({ message: "Subscription disabled successfully", user });
    } catch (err) {
      console.error("Error disabling subscription:", err);
      res.status(500).json({ error: "Failed to disable subscription" });
    }
  });

  app.get("/api/users", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const users = await User.find({ role: 'student' });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users/:userId/enroll", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const { userId } = req.params;
    const { courseId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const isEnrolled = user.progress.some((p: any) => p.courseId.toString() === courseId);
      if (!isEnrolled) {
        user.progress.push({ courseId, completedLectures: [] });
        await user.save();
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to enroll user" });
    }
  });

  app.get("/api/users/me", authenticate, (req: any, res) => {
    res.json(req.user);
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const { userId } = req.params;
    const { courseId, lectureId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      let courseProgress = user.progress.find((p: any) => p.courseId.toString() === courseId);
      if (!courseProgress) {
        user.progress.push({ courseId, completedLectures: [lectureId] });
      } else {
        const index = courseProgress.completedLectures.indexOf(lectureId);
        if (index === -1) {
          courseProgress.completedLectures.push(lectureId);
        } else {
          courseProgress.completedLectures.splice(index, 1);
        }
      }
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/placements", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const jobs = await Job.find().sort({ posted_at: -1 });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/placements", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const job = await Job.create(req.body);
      res.status(201).json(job);
    } catch (err) {
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/placements/:id", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/placements/:id", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const userCount = await User.countDocuments();
      const courseCount = await Course.countDocuments();
      const courses = await Course.find();
      const users = await User.find();
      
      let totalRevenue = 0;
      users.forEach(user => {
        user.progress.forEach((p: any) => {
          const course = courses.find(c => c._id.toString() === p.courseId.toString());
          if (course && course.type === 'paid') {
            totalRevenue += (course.price || 0);
          }
        });
      });
      
      res.json({
        totalUsers: userCount + 150,
        totalCourses: courseCount,
        revenue: totalRevenue
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Page Routes
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await Page.find({ isPublished: true });
      res.json(pages);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.get("/api/homepage", async (req, res) => {
    try {
      const page = await Page.findOne({ isHomepage: true, isPublished: true });
      res.json(page || { sections: [] });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch homepage" });
    }
  });

  // Admin Page Routes
  app.get("/api/admin/pages", authenticate, isAdmin, async (req, res) => {
    try {
      const pages = await Page.find().sort({ updated_at: -1 });
      res.json(pages);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/pages", authenticate, isAdmin, async (req, res) => {
    try {
      const { title, slug, sections, isPublished, isHomepage } = req.body;
      
      if (isHomepage) {
        await Page.updateMany({}, { isHomepage: false });
      }

      const page = await Page.create({ title, slug, sections, isPublished, isHomepage });
      res.status(201).json(page);
    } catch (err) {
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.put("/api/admin/pages/:id", authenticate, isAdmin, async (req, res) => {
    try {
      const { title, slug, sections, isPublished, isHomepage } = req.body;
      
      if (isHomepage) {
        await Page.updateMany({ _id: { $ne: req.params.id } }, { isHomepage: false });
      }

      const page = await Page.findByIdAndUpdate(
        req.params.id,
        { title, slug, sections, isPublished, isHomepage, updated_at: new Date() },
        { new: true }
      );
      res.json(page);
    } catch (err) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", authenticate, isAdmin, async (req, res) => {
    try {
      await Page.findByIdAndDelete(req.params.id);
      res.json({ message: "Page deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Menu Routes
  app.get("/api/menus", async (req, res) => {
    try {
      const menus = await Menu.find();
      res.json(menus);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch menus" });
    }
  });

  app.get("/api/menus/:name", async (req, res) => {
    try {
      const menu = await Menu.findOne({ name: req.params.name });
      res.json(menu || { name: req.params.name, links: [] });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  app.post("/api/admin/menus", authenticate, isAdmin, async (req, res) => {
    try {
      const { name, links } = req.body;
      const menu = await Menu.findOneAndUpdate(
        { name },
        { links },
        { upsert: true, new: true }
      );
      res.json(menu);
    } catch (err) {
      res.status(500).json({ error: "Failed to update menu" });
    }
  });

  // Razorpay Payment Routes
  app.post("/api/payments/create-order", authenticate, async (req: any, res) => {
    const { courseId } = req.body;
    try {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });

      const options = {
        amount: Math.round(course.price * 100), // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error("Razorpay Order Error:", err);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", authenticate, async (req: any, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user._id;

    try {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // Payment verified, enroll user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isEnrolled = user.progress.some((p: any) => p.courseId.toString() === courseId);
        if (!isEnrolled) {
          user.progress.push({ courseId, completedLectures: [] });
          await user.save();
        }
        res.json({ success: true, message: "Payment verified and enrollment successful" });
      } else {
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (err) {
      console.error("Verification Error:", err);
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  // Razorpay Webhook
  app.post("/api/payments/webhook", express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }), async (req: any, res) => {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (signature === expectedSignature) {
      const event = req.body.event;
      if (event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        const orderId = payment.order_id;
        const email = payment.email;

        // In a real app, you'd find the user by email and the course by order metadata
        // For this demo, we'll assume the client-side verification handles the enrollment
        // but we log it here for completeness.
        console.log(`✅ Webhook: Payment captured for order ${orderId} from ${email}`);
      }
      res.json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Invalid webhook signature" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please check MONGODB_URI." });
    }
    try {
      const course = await Course.create(req.body);
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  app.post("/api/courses/:id/modules", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      course.modules.push(req.body);
      course.modules_count = course.modules.length;
      await course.save();
      
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to add module" });
    }
  });

  app.put("/api/courses/:id/modules/:moduleId", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      const module = (course.modules as any).id(req.params.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      Object.assign(module, req.body);
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to update module" });
    }
  });

  app.delete("/api/courses/:id/modules/:moduleId", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      (course.modules as any).pull(req.params.moduleId);
      course.modules_count = course.modules.length;
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  // Lecture Management
  app.post("/api/courses/:id/modules/:moduleId/lectures", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      const module = (course.modules as any).id(req.params.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      module.lectures.push(req.body);
      await course.save();
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to add lecture" });
    }
  });

  app.put("/api/courses/:id/modules/:moduleId/lectures/:lectureId", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      const module = (course.modules as any).id(req.params.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      const lecture = module.lectures.id(req.params.lectureId);
      if (!lecture) return res.status(404).json({ error: "Lecture not found" });
      
      Object.assign(lecture, req.body);
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to update lecture" });
    }
  });

  app.delete("/api/courses/:id/modules/:moduleId/lectures/:lectureId", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      
      const module = (course.modules as any).id(req.params.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      module.lectures.pull(req.params.lectureId);
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to delete lecture" });
    }
  });

  // Menu Management Routes
  app.get("/api/admin/menus", authenticate, isAdmin, async (req, res) => {
    try {
      const menus = await Menu.find();
      res.json(menus);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch menus" });
    }
  });

  app.post("/api/admin/menus", authenticate, isAdmin, async (req, res) => {
    try {
      const menu = await Menu.create(req.body);
      res.status(201).json(menu);
    } catch (err) {
      res.status(500).json({ error: "Failed to create menu" });
    }
  });

  app.put("/api/admin/menus/:id", authenticate, isAdmin, async (req, res) => {
    try {
      const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!menu) return res.status(404).json({ error: "Menu not found" });
      res.json(menu);
    } catch (err) {
      res.status(500).json({ error: "Failed to update menu" });
    }
  });

  app.delete("/api/admin/menus/:id", authenticate, isAdmin, async (req, res) => {
    try {
      await Menu.findByIdAndDelete(req.params.id);
      res.json({ message: "Menu deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete menu" });
    }
  });

  app.put("/api/users/profile", authenticate, async (req: any, res) => {
    try {
      const { profile } = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, { profile }, { new: true });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Admin Stats Route
  app.get("/api/admin/stats", authenticate, isAdmin, async (req, res) => {
    try {
      const [totalStudents, activeCourses] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Course.countDocuments({ isPublished: true })
      ]);

      res.json({
        totalStudents,
        activeCourses,
        revenue: "₹0",
        usage: "100%",
        studentsTrend: "+0%",
        coursesTrend: "+0%",
        revenueTrend: "+0%",
        usageTrend: "0%",
        recentActivity: [],
        liveSession: {
          title: "No Live Session",
          viewers: "0"
        },
        nextMilestone: {
          title: "Next Goal",
          progress: 0,
          description: "Start your journey today!"
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/pages/:id/toggle-visibility", authenticate, isAdmin, async (req, res) => {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });
      page.isPublished = !page.isPublished;
      await page.save();
      res.json(page);
    } catch (err) {
      res.status(500).json({ error: "Failed to toggle visibility" });
    }
  });

  app.post("/api/admin/users/:id/subscription", authenticate, isAdmin, async (req, res) => {
    try {
      const { active } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      
      if (active) {
        user.subscriptionPlan = 'monthly';
        user.subscriptionStartDate = new Date();
        user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else {
        user.subscriptionPlan = null;
        user.subscriptionStartDate = null;
        user.subscriptionEndDate = null;
      }
      
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  app.delete("/api/admin/users/:id", authenticate, isAdmin, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // API 404 Catch-all
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(process.cwd(), "client"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "client/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: "Payload too large. Please upload smaller files." });
    }
    res.status(err.status || 500).json({ 
      error: err.message || "Internal Server Error" 
    });
  });

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Background DB connection to avoid startup delays
    const isConnected = await connectDB();
    if (isConnected) {
      await seedData();
    }
  });
}

startServer();
