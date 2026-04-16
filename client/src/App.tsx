import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { 
  BookOpen, Users, LayoutDashboard, Briefcase, 
  GraduationCap, Settings, Bell, Search, 
  PlayCircle, FileText, Code, Trophy,
  ChevronRight, Star, Clock, CheckCircle2, AlertCircle,
  ChevronUp, ChevronDown, Layout,
  Menu, X, LogIn, CreditCard, Sparkles,
  Plus,
  Edit,
  Trash2,
  Layers,
  Home,
  Smartphone,
  Lock,
  ShieldCheck,
  User,
  Target,
  Video,
  MapPin,
  DollarSign,
  Calendar,
  Zap,
  Rocket,
  Cpu,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  Map,
  HelpCircle,
  Laptop,
  Award,
  Check,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  Upload,
  ArrowLeft,
  Brain,
  BarChart3,
  Quote,
  Cloud,
  Menu as MenuIcon,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  Heart,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface LockedContent {
  _id: string;
  title: string;
  type: 'placement' | 'notes' | 'jobs' | 'hackathons' | 'coding';
  content: string;
  created_at: string;
}

// ... existing types ...
interface Lecture {
  _id: string;
  title: string;
  type: 'live' | 'recorded';
  youtubeLiveUrl?: string;
  youtubeRecordedUrl?: string;
  scheduledAt?: string;
  duration?: number;
  status: 'upcoming' | 'live' | 'completed';
}

interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  visibility: 'published' | 'draft';
  lectures: Lecture[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  modules_count: number;
  isPublished: boolean;
  type: 'paid' | 'free';
  landing_page?: {
    benefits: string[];
    requirements: string[];
    target_audience: string[];
    curriculum_overview: string;
    instructor_name: string;
    instructor_bio: string;
    instructor_image: string;
  };
  modules: Module[];
}

interface Stats {
  totalUsers: number;
  totalCourses: number;
  revenue: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  progress: {
    courseId: string;
    completedLectures: string[];
  }[];
  isTrialActive: boolean;
  trialStartDate: string;
  subscriptionPlan: 'monthly' | '6months' | '1year' | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  hasCourseAccess: boolean;
  profile?: {
    photo?: string;
    banner?: string;
    bio?: string;
    headline?: string;
    skills?: string[];
    projects?: { title: string; description: string; link: string }[];
    resumeUrl?: string;
    placementStatus?: 'searching' | 'placed' | 'not-looking';
    badges?: string[];
    points?: number;
    streak?: number;
  };
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description?: string;
  apply_url?: string;
  posted_at: string;
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  planId: string;
}

function CourseLandingPage({ 
  course, 
  onBack, 
  onEnroll, 
  isEnrolled, 
  onContinueLearning,
  isAdmin
}: { 
  course: Course, 
  onBack: () => void, 
  onEnroll: (id: string, type: 'paid' | 'free') => void, 
  isEnrolled: boolean,
  onContinueLearning: () => void,
  isAdmin?: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors group"
      >
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Hero Section */}
          <div>
            <h1 className="text-5xl font-black text-slate-800 mb-6 leading-tight">{course.title}</h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 4.8+ Rating
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> Industry Recognized
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" /> Self-Paced Learning
              </div>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-600" /> What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(course.landing_page?.benefits || ['Master core concepts', 'Build real-world projects', 'Industry best practices', 'Career guidance']).map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Overview */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600" /> Curriculum Overview
            </h2>
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200 mb-8">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {course.landing_page?.curriculum_overview || 'This comprehensive course covers everything from fundamentals to advanced topics. You will work on hands-on projects, participate in live sessions, and gain practical skills required in the industry.'}
              </p>
            </div>

            {/* Detailed Curriculum */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Course Content</h3>
              {course.modules.map((module, idx) => (
                <div key={module._id || idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{module.title}</h4>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          {module.lectures?.length || 0} Lectures
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {module.lectures?.map((lecture, lIdx) => (
                      <div key={lecture._id || lIdx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                          <span className="text-sm font-medium text-slate-600">{lecture.title}</span>
                        </div>
                        {!isEnrolled && (
                          <Lock className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-8 p-10 bg-indigo-900 rounded-[40px] text-white">
            <img 
              src={course.landing_page?.instructor_image || "https://picsum.photos/seed/instructor/200/200"} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white/20" 
              alt="Instructor"
            />
            <div>
              <p className="text-indigo-300 font-black uppercase tracking-widest text-xs mb-2">Lead Instructor</p>
              <h3 className="text-2xl font-bold mb-3">{course.landing_page?.instructor_name || 'Dr. Shahid Pathan'}</h3>
              <p className="text-indigo-100/80 text-sm leading-relaxed">
                {course.landing_page?.instructor_bio || 'Expert developer with 10+ years of industry experience. Passionate about teaching and building scalable applications.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-200/20 sticky top-8">
            <div className="aspect-video rounded-3xl overflow-hidden mb-8">
              <img src={course.image_url} className="w-full h-full object-cover" alt="Course" />
            </div>
            
            <div className="mb-8">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Course Fee</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800">
                  {course.type === 'free' ? 'FREE' : `₹${course.price}`}
                </span>
                {course.type === 'paid' && (
                  <span className="text-slate-400 line-through font-bold">₹{course.price * 2}</span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {isEnrolled ? (
                <button 
                  onClick={onContinueLearning}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  {isAdmin ? 'Manage Modules' : 'Continue Learning'}
                </button>
              ) : (
                <button 
                  onClick={() => onEnroll(course._id, course.type)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  {course.type === 'free' ? 'Enroll Now' : 'Buy Course Now'}
                </button>
              )}
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> 30-Day Money Back Guarantee
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Course Includes:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <PlayCircle className="w-4 h-4 text-indigo-500" /> {course.modules_count * 4}+ Lectures
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <FileText className="w-4 h-4 text-indigo-500" /> Downloadable Resources
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Trophy className="w-4 h-4 text-indigo-500" /> Certificate of Completion
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Smartphone className="w-4 h-4 text-indigo-500" /> Access on Mobile & TV
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[40px] text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> Target Audience
            </h4>
            <ul className="space-y-3">
              {(course.landing_page?.target_audience || ['Beginners', 'Career Switchers', 'Students']).map((target, i) => (
                <li key={i} className="text-slate-400 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {target}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface LandingPageSection {
  id: string;
  _id?: string;
  type: string;
  content: any;
  isVisible: boolean;
  order: number;
}

interface PageConfig {
  _id?: string;
  title: string;
  slug: string;
  sections: LandingPageSection[];
  isPublished: boolean;
  isHomepage: boolean;
}

interface MenuLink {
  label: string;
  url: string;
  order: number;
}

interface MenuConfig {
  name: string;
  links: MenuLink[];
}

const Hero = ({ content, onRegister, setView }: any) => (
  <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center">
    {/* Background Animation */}
    <div className="absolute inset-0 -z-10 bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2], 
              scale: [1, 1.2, 1],
              x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
            className="absolute text-indigo-200"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          >
            {i % 4 === 0 ? <Code size={24} /> : i % 4 === 1 ? <Cpu size={24} /> : i % 4 === 2 ? <Globe size={24} /> : <Zap size={24} />}
          </motion.div>
        ))}
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Sticker */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-200 animate-bounce-slow">
          <Sparkles size={16} />
          {content?.sticker || 'Offline-Online Training'}
        </div>

        {/* Main Title / Tagline */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
          {content?.title || 'Shiddat'} <br className="hidden md:block" />
          <span className="text-indigo-600">{content?.subtitle || 'Programming Institute'}</span>
        </h1>
        
        <p className="text-2xl md:text-3xl font-bold text-slate-700 max-w-3xl leading-relaxed">
          {content?.tagline || 'IT Software Training & AI Center'}
        </p>

        {/* Highlighted Marathi Text */}
        <div className="bg-indigo-50 border-2 border-indigo-100 px-8 py-4 rounded-2xl shadow-inner">
          <p className="text-xl md:text-2xl font-black text-indigo-800">
            {content?.highlight || 'Karad मधील IT Specialization चे एकमेव Center'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 pt-8">
          <button 
            onClick={() => setView('courses')}
            className="bg-rose-600 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2"
          >
            {content?.primaryCtaText || 'Explore Courses'} <ChevronRight size={20} />
          </button>
          <button 
            onClick={onRegister}
            className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-black shadow-lg hover:bg-slate-50 hover:border-indigo-200 transition-all active:scale-95 flex items-center gap-2"
          >
            {content?.secondaryCtaText || 'Join Free Trial'} <Target size={20} className="text-indigo-600" />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <img 
                key={i}
                src={`https://i.pravatar.cc/100?img=${i+20}`} 
                className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                alt="Student"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center text-xs font-black text-white shadow-md">
              +1k
            </div>
          </div>
          <p className="text-base text-slate-600 font-bold">{content?.trustText || 'Trusted by 1000+ Students'}</p>
        </div>
      </motion.div>
    </div>
  </section>
);

const TrustSection = ({ content, stats }: any) => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {(content?.stats || [
          { label: 'Total Students', value: stats?.totalUsers ? `${stats.totalUsers}+` : '500+' },
          { label: 'Active Courses', value: stats?.totalCourses ? `${stats.totalCourses}+` : '15+' },
          { label: 'Expert Mentors', value: '20+' },
          { label: 'Partner Companies', value: '100+' }
        ]).map((stat: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="text-center space-y-2"
          >
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Specialization = ({ content }: any) => (
  <section className="py-32 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
            Our Expertise
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            {content?.title || 'Master the Most In-Demand'} <br />
            <span className="text-indigo-600">IT Specializations</span>
          </h2>
        </div>
        <p className="text-slate-500 font-medium max-w-md">
          {content?.description || 'We focus on practical, project-based learning to ensure you are industry-ready from day one.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(content?.specs || [
          { title: 'Full Stack Development', desc: 'Master MERN stack with real-world projects.', icon: Code },
          { title: 'AI & Machine Learning', desc: 'Learn Python, TensorFlow and Neural Networks.', icon: Brain },
          { title: 'Cloud Computing', desc: 'AWS, Azure and DevOps specialization.', icon: Cloud },
          { title: 'Cyber Security', desc: 'Ethical hacking and network security.', icon: ShieldCheck },
          { title: 'Data Science', desc: 'Big data analysis and visualization.', icon: BarChart3 },
          { title: 'Mobile App Dev', desc: 'React Native and Flutter development.', icon: Smartphone }
        ]).map((spec: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              {spec.icon ? <spec.icon size={32} /> : <Code size={32} />}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{spec.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{spec.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PlacementShowcase = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Our Students Work At</h2>
        <p className="text-slate-500 font-medium">Join our alumni working at top tech giants globally.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Infosys', 'Wipro'].map(company => (
          <div key={company} className="text-2xl font-black text-slate-400 hover:text-slate-900 cursor-default transition-colors">
            {company}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UpcomingBatches = ({ content }: any) => (
  <section className="py-32 bg-indigo-600 rounded-[64px] mx-6 my-20 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    <div className="max-w-7xl mx-auto px-12 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-black leading-tight tracking-tight">
            {content?.title || 'New Batches Starting'} <br />
            <span className="text-indigo-200">{content?.subtitle || 'Every Monday!'}</span>
          </h2>
          <p className="text-xl text-indigo-100 font-medium leading-relaxed">
            {content?.description || "Don't wait for the right time. The right time is now. Join our upcoming cohorts and start your IT journey."}
          </p>
          <div className="space-y-4">
            {(content?.batches || ['Morning Batch: 8:00 AM - 10:00 AM', 'Evening Batch: 6:00 PM - 8:00 PM', 'Weekend Special: Sat-Sun']).map((batch: string) => (
              <div key={batch} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <span className="font-bold">{batch}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[48px] text-slate-900 shadow-2xl">
          <h3 className="text-2xl font-black mb-8">{content?.formTitle || 'Reserve Your Seat'}</h3>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
              <input type="tel" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Enter your mobile number" />
            </div>
            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              {content?.buttonText || 'Get Free Counseling'}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const OnlineOffline = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src={content?.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"} 
            className="rounded-[48px] shadow-2xl"
            alt="Classroom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-8 -right-8 bg-rose-600 text-white p-8 rounded-[32px] shadow-2xl rotate-6">
            <p className="text-4xl font-black mb-1">{content?.badgeValue || '100%'}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{content?.badgeText || 'Practical Learning'}</p>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            {content?.title || 'Learn Anywhere,'} <br />
            <span className="text-indigo-600">{content?.subtitle || 'Anytime.'}</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Globe size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900">{content?.onlineTitle || 'Online Classes'}</h4>
              <p className="text-slate-500 font-medium">{content?.onlineDesc || 'Live interactive sessions with recorded backups for flexible learning.'}</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <MapPin size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900">{content?.offlineTitle || 'Offline Center'}</h4>
              <p className="text-slate-500 font-medium">{content?.offlineDesc || 'State-of-the-art lab facilities at our Karad center for hands-on practice.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Gallery = ({ content }: any) => (
  <section className="py-32 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">{content?.title || 'Life at Shiddat'}</h2>
        <p className="text-slate-500 font-medium">{content?.description || 'Glimpses of our batches, celebrations, and learning environment.'}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(content?.images || [1,2,3,4,5,6,7,8]).map((img: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
            className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white"
          >
            <img 
              src={typeof img === 'string' ? img : `https://picsum.photos/seed/shiddat-${img}/800/800`} 
              className="w-full h-full object-cover"
              alt="Gallery"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">{content?.title || 'Success Stories'}</h2>
        <p className="text-slate-500 font-medium">{content?.description || 'Hear from our students who transformed their careers.'}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {(content?.testimonials || [
          { name: 'Amit Sharma', role: 'Full Stack Developer at Infosys', text: 'The MERN stack course was comprehensive and practical. The projects helped me build a strong portfolio.' },
          { name: 'Priya Patil', role: 'Data Scientist at Accenture', text: 'The Python and AI course gave me the skills I needed to transition into data science. Highly recommended!' },
          { name: 'Sameer Khan', role: 'Software Engineer at Wipro', text: 'Excellent teaching and great support. The placement assistance was crucial in landing my first job.' }
        ]).map((testimonial: any, i: number) => (
          <div key={i} className="bg-slate-50 p-10 rounded-[40px] relative group hover:bg-indigo-600 transition-all duration-500">
            <Quote className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-400 transition-colors" size={48} />
            <div className="flex items-center gap-4 mb-8">
              <img src={testimonial.image || `https://i.pravatar.cc/100?img=${i+15}`} className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg" alt="Student" referrerPolicy="no-referrer" />
              <div>
                <h4 className="font-black text-slate-900 group-hover:text-white transition-colors">{testimonial.name}</h4>
                <p className="text-sm font-bold text-indigo-600 group-hover:text-indigo-200 transition-colors">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed group-hover:text-indigo-50 transition-colors">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Subscription = ({ content }: any) => (
  <section className="py-32 bg-slate-900 text-white rounded-[64px] mx-6 my-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.1),transparent_50%)]"></div>
    <div className="max-w-7xl mx-auto px-12 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
        <h2 className="text-6xl font-black tracking-tight leading-none">
          Ready to Start Your <br />
          <span className="text-indigo-400">IT Journey?</span>
        </h2>
        <p className="text-xl text-slate-400 font-medium">Choose the plan that fits your career goals.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl p-12 rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group">
          <h3 className="text-2xl font-black mb-2">Free Trial</h3>
          <p className="text-slate-400 mb-8 font-medium">Get a taste of our teaching style.</p>
          <div className="text-5xl font-black mb-8">₹0 <span className="text-lg text-slate-500 font-bold">/ 7 Days</span></div>
          <ul className="space-y-4 mb-10">
            {['Access to Basic Modules', 'Live Demo Class', 'Career Roadmap', 'Doubt Support'].map(f => (
              <li key={f} className="flex items-center gap-3 text-slate-300 font-bold">
                <CheckCircle2 size={20} className="text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-indigo-500 hover:text-white transition-all">Start Free Trial</button>
        </div>
        <div className="bg-indigo-600 p-12 rounded-[48px] shadow-2xl shadow-indigo-500/20 relative">
          <div className="absolute -top-4 right-8 bg-rose-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
          <h3 className="text-2xl font-black mb-2">Premium Specialization</h3>
          <p className="text-indigo-100 mb-8 font-medium">Complete career transformation program.</p>
          <div className="text-5xl font-black mb-8">₹14,999 <span className="text-lg text-indigo-200 font-bold">/ Course</span></div>
          <ul className="space-y-4 mb-10">
            {['Full Curriculum Access', '1-on-1 Mentorship', 'Placement Assistance', 'Industry Projects', 'Certificate'].map(f => (
              <li key={f} className="flex items-center gap-3 text-white font-bold">
                <CheckCircle2 size={20} className="text-indigo-200" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all">Enroll Now</button>
        </div>
      </div>
    </div>
  </section>
);

const SortableSectionItem = ({ section, index, onEdit, onDelete, onToggleVisibility }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id || section._id || `section-${index}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="p-6 bg-white border border-slate-100 rounded-2xl mb-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-slate-500">
          <MenuIcon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 capitalize">{section.type.replace('-', ' ')}</h3>
            {!section.isVisible && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Hidden</span>}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">{section.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleVisibility(section.id || section._id)} className={`p-2 rounded-lg transition-colors ${section.isVisible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}>
            {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button onClick={() => onEdit(section)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(section.id || section._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionEditor = ({ section, onSave, isNew, sectionTypes }: { 
  section: LandingPageSection, 
  onSave: (s: LandingPageSection) => void,
  isNew: boolean,
  sectionTypes: { type: string, label: string }[]
}) => {
  const [formData, setFormData] = useState<LandingPageSection>(section);

  const handleContentChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [key]: value
      }
    });
  };

  const renderContentFields = () => {
    switch (formData.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Input label="Sticker" value={formData.content.sticker || ''} onChange={(v: string) => handleContentChange('sticker', v)} />
            <Input label="Main Heading" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <Input label="Subtitle" value={formData.content.subtitle || ''} onChange={(v: string) => handleContentChange('subtitle', v)} />
            <Input label="Tagline" value={formData.content.tagline || ''} onChange={(v: string) => handleContentChange('tagline', v)} />
            <Input label="Highlight Text" value={formData.content.highlight || ''} onChange={(v: string) => handleContentChange('highlight', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Primary Button Text" value={formData.content.primaryCtaText || ''} onChange={(v: string) => handleContentChange('primaryCtaText', v)} />
              <Input label="Secondary Button Text" value={formData.content.secondaryCtaText || ''} onChange={(v: string) => handleContentChange('secondaryCtaText', v)} />
            </div>
            <Input label="Trust Text" value={formData.content.trustText || ''} onChange={(v: string) => handleContentChange('trustText', v)} />
          </div>
        );
      case 'trust':
        return (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800">Stats (JSON Format)</h4>
            <TextArea 
              label="Stats Array" 
              value={JSON.stringify(formData.content.stats || [], null, 2)} 
              onChange={(v: string) => {
                try {
                  handleContentChange('stats', JSON.parse(v));
                } catch (e) {}
              }} 
              placeholder='[{"label": "Students", "value": "10,000+"}]'
            />
          </div>
        );
      case 'specialization':
        return (
          <div className="space-y-4">
            <Input label="Section Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <TextArea label="Description" value={formData.content.description || ''} onChange={(v: string) => handleContentChange('description', v)} />
            <h4 className="font-bold text-slate-800 mt-6">Specializations (JSON Format)</h4>
            <TextArea 
              label="Specs Array" 
              value={JSON.stringify(formData.content.specs || [], null, 2)} 
              onChange={(v: string) => {
                try {
                  handleContentChange('specs', JSON.parse(v));
                } catch (e) {}
              }} 
            />
          </div>
        );
      case 'placements':
        return (
          <div className="space-y-4">
            <Input label="Section Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <TextArea label="Description" value={formData.content.description || ''} onChange={(v: string) => handleContentChange('description', v)} />
          </div>
        );
      case 'gallery':
        return (
          <div className="space-y-4">
            <Input label="Section Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <TextArea 
              label="Images (One URL per line)" 
              value={(formData.content.images || []).join('\n')} 
              onChange={(v: string) => handleContentChange('images', v.split('\n').filter(url => url.trim()))} 
            />
          </div>
        );
      case 'batches':
        return (
          <div className="space-y-4">
            <Input label="Section Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <Input label="Subtitle" value={formData.content.subtitle || ''} onChange={(v: string) => handleContentChange('subtitle', v)} />
            <TextArea label="Description" value={formData.content.description || ''} onChange={(v: string) => handleContentChange('description', v)} />
            <Input label="Form Title" value={formData.content.formTitle || ''} onChange={(v: string) => handleContentChange('formTitle', v)} />
            <Input label="Button Text" value={formData.content.buttonText || ''} onChange={(v: string) => handleContentChange('buttonText', v)} />
            <TextArea 
              label="Batches (One per line)" 
              value={(formData.content.batches || []).join('\n')} 
              onChange={(v: string) => handleContentChange('batches', v.split('\n').filter(b => b.trim()))} 
            />
          </div>
        );
      case 'testimonials':
        return (
          <div className="space-y-4">
            <Input label="Section Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <TextArea 
              label="Testimonials (JSON Array)" 
              value={JSON.stringify(formData.content.testimonials || [], null, 2)} 
              onChange={(v: string) => {
                try {
                  handleContentChange('testimonials', JSON.parse(v));
                } catch (e) {}
              }} 
            />
          </div>
        );
      case 'online-offline':
        return (
          <div className="space-y-4">
            <Input label="Image URL" value={formData.content.imageUrl || ''} onChange={(v: string) => handleContentChange('imageUrl', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Badge Value" value={formData.content.badgeValue || ''} onChange={(v: string) => handleContentChange('badgeValue', v)} />
              <Input label="Badge Text" value={formData.content.badgeText || ''} onChange={(v: string) => handleContentChange('badgeText', v)} />
            </div>
            <Input label="Title" value={formData.content.title || ''} onChange={(v: string) => handleContentChange('title', v)} />
            <Input label="Subtitle" value={formData.content.subtitle || ''} onChange={(v: string) => handleContentChange('subtitle', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Online Title" value={formData.content.onlineTitle || ''} onChange={(v: string) => handleContentChange('onlineTitle', v)} />
              <Input label="Offline Title" value={formData.content.offlineTitle || ''} onChange={(v: string) => handleContentChange('offlineTitle', v)} />
            </div>
            <TextArea label="Online Description" value={formData.content.onlineDesc || ''} onChange={(v: string) => handleContentChange('onlineDesc', v)} />
            <TextArea label="Offline Description" value={formData.content.offlineDesc || ''} onChange={(v: string) => handleContentChange('offlineDesc', v)} />
          </div>
        );
      default:
        return (
          <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-500 font-medium italic">This section type uses default content or is managed elsewhere.</p>
            <p className="text-xs text-slate-400 mt-2">You can still control its visibility and order.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {isNew && (
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">Section Type</label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
          >
            {sectionTypes.map(st => (
              <option key={st.type} value={st.type}>{st.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Section Content</h3>
        {renderContentFields()}
      </div>

      <div className="flex gap-4 pt-8 border-t border-slate-100">
        <button 
          onClick={() => onSave(formData)}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Save Section
        </button>
      </div>
    </div>
  );
};

const PageBuilder = ({ page, onSave, onCancel }: { page: PageConfig, onSave: (p: PageConfig) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<PageConfig>(page);
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formData.sections.findIndex((s: any, i: number) => (s.id || s._id || `section-${i}`) === active.id);
      const newIndex = formData.sections.findIndex((s: any, i: number) => (s.id || s._id || `section-${i}`) === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(formData.sections, oldIndex, newIndex).map((s: LandingPageSection, i: number) => ({ ...s, order: i }));
        setFormData({ ...formData, sections: newSections });
      }
    }
  };

  const handleSaveSection = (section: LandingPageSection) => {
    let newSections;
    const sectionId = section.id || section._id;
    const existingIndex = formData.sections.findIndex(s => (s.id || s._id) === sectionId);
    
    // Ensure content is not empty for new sections
    if (isAddingSection && Object.keys(section.content).length === 0) {
      const defaultContents: any = {
        hero: { title: 'Welcome to Shiddat', subtitle: 'Programming Institute', tagline: 'IT Software Training & AI Center', sticker: 'Offline-Online Training', highlight: 'Karad मधील IT Specialization चे एकमेव Center', primaryCtaText: 'Explore Courses', secondaryCtaText: 'Join Free Trial', trustText: 'Trusted by 1000+ Students' },
        trust: { stats: [{ label: 'Students', value: '1000+' }, { label: 'Courses', value: '15+' }, { label: 'Mentors', value: '20+' }, { label: 'Partners', value: '100+' }] },
        specialization: { title: 'Our Expertise', description: 'We focus on practical, project-based learning.', specs: [{ title: 'Full Stack', desc: 'Master MERN stack.', icon: 'Code' }] },
        gallery: { title: 'Life at Shiddat', description: 'Glimpses of our batches.', images: [1, 2, 3, 4] },
        batches: { title: 'New Batches Starting', subtitle: 'Every Monday!', description: "Join our upcoming cohorts.", batches: ['Morning Batch', 'Evening Batch'], formTitle: 'Reserve Your Seat', buttonText: 'Get Counseling' },
        testimonials: { title: 'Success Stories', description: 'Hear from our students.', testimonials: [{ name: 'John Doe', role: 'Developer', text: 'Great experience!' }] },
        'online-offline': { title: 'Learn Anywhere,', subtitle: 'Anytime.', onlineTitle: 'Online Classes', offlineTitle: 'Offline Center', onlineDesc: 'Live interactive sessions.', offlineDesc: 'Hands-on practice.', badgeValue: '100%', badgeText: 'Practical' }
      };
      section.content = defaultContents[section.type] || {};
    }

    if (existingIndex !== -1) {
      newSections = [...formData.sections];
      newSections[existingIndex] = section;
    } else {
      newSections = [...formData.sections, { ...section, order: formData.sections.length }];
    }
    setFormData({ ...formData, sections: newSections });
    setEditingSection(null);
    setIsAddingSection(false);
  };

  const sectionTypes = [
    { type: 'hero', label: 'Hero Section' },
    { type: 'trust', label: 'Trust/Stats Section' },
    { type: 'specialization', label: 'Specialization Section' },
    { type: 'placements', label: 'Placements Showcase' },
    { type: 'gallery', label: 'Gallery' },
    { type: 'batches', label: 'Upcoming Batches' },
    { type: 'online-offline', label: 'Online/Offline Info' },
    { type: 'testimonials', label: 'Testimonials' },
    { type: 'subscription', label: 'Subscription/Pricing' }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Page Builder: {formData.title}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Slug: /{formData.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${previewMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {previewMode ? <EyeOff size={18} /> : <Eye size={18} />} {previewMode ? 'Exit Preview' : 'Live Preview'}
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <Save size={18} /> Save Page
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-8">
        {/* Editor Side */}
        <div className={`flex-1 overflow-y-auto pr-4 custom-scrollbar ${previewMode ? 'hidden' : 'block'}`}>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Settings size={20} className="text-indigo-600" /> Page Settings</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Page Title" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
                <Input label="Page Slug" value={formData.slug} onChange={(v: string) => setFormData({...formData, slug: v})} />
              </div>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPublished ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} />
                  <span className="text-sm font-bold text-slate-700">Published</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full transition-all relative ${formData.isHomepage ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isHomepage ? 'left-7' : 'left-1'}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.isHomepage} onChange={(e) => setFormData({...formData, isHomepage: e.target.checked})} />
                  <span className="text-sm font-bold text-slate-700">Set as Homepage</span>
                </label>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Layers size={20} className="text-indigo-600" /> Page Sections</h2>
                <button 
                  onClick={() => setIsAddingSection(true)}
                  className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={formData.sections.map((s, i) => s.id || s._id || `section-${i}`)} strategy={verticalListSortingStrategy}>
                  {formData.sections.map((section, index) => (
                    <SortableSectionItem 
                      key={section.id || section._id || `section-${index}`} 
                      section={section} 
                      index={index} 
                      onEdit={setEditingSection}
                      onDelete={(id: string) => setFormData({...formData, sections: formData.sections.filter(s => (s.id || s._id || id) !== id)})}
                      onToggleVisibility={(id: string) => setFormData({...formData, sections: formData.sections.map(s => (s.id || s._id || id) === id ? {...s, isVisible: !s.isVisible} : s)})}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {formData.sections.length === 0 && (
                <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <Plus size={32} />
                  </div>
                  <p className="text-slate-400 font-medium">No sections added yet. Start building your page!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className={`flex-1 bg-slate-50 rounded-[32px] border border-slate-200 overflow-hidden relative ${previewMode ? 'block' : 'hidden lg:block'}`}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            Live Preview
          </div>
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="bg-white min-h-full">
              {formData.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order).map(section => {
                const sectionComponents: any = {
                  hero: Hero,
                  trust: TrustSection,
                  specialization: Specialization,
                  placements: PlacementShowcase,
                  gallery: Gallery,
                  batches: UpcomingBatches,
                  'online-offline': OnlineOffline,
                  testimonials: Testimonials,
                  subscription: Subscription
                };
                const Component = sectionComponents[section.type];
                if (!Component) return null;
                return <Component key={section.id} content={section.content} />;
              })}
              {formData.sections.filter(s => s.isVisible).length === 0 && (
                <div className="flex items-center justify-center h-full text-slate-300 italic font-medium">
                  Preview will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Section Modal */}
      {(editingSection || isAddingSection) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setEditingSection(null); setIsAddingSection(false); }} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white p-8 rounded-[32px] shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">
                {isAddingSection ? 'Add New Section' : `Edit ${editingSection?.type} Section`}
              </h2>
              <button onClick={() => { setEditingSection(null); setIsAddingSection(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <SectionEditor 
              section={editingSection || { id: `section-${Date.now()}`, type: 'hero', content: {}, isVisible: true, order: 0 }} 
              onSave={handleSaveSection}
              isNew={isAddingSection}
              sectionTypes={sectionTypes}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const PageManager = ({ pages, onEdit, onCreate, onDelete }: { pages: PageConfig[], onEdit: (p: PageConfig) => void, onCreate: () => void, onDelete: (id: string) => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Page Management</h1>
          <p className="text-slate-500 font-medium">Create and manage multiple pages for your website.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page, pIdx) => (
          <div key={page._id || pIdx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            {page.isHomepage && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl">
                Homepage
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-800 mb-1">{page.title}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">/{page.slug}</p>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${page.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {page.isPublished ? 'Published' : 'Draft'}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {page.sections.length} Sections
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onEdit(page)}
                className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Edit size={18} /> Edit Builder
              </button>
              <button 
                onClick={() => onDelete(page._id!)}
                className="p-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuManager = () => {
  const [headerMenu, setHeaderMenu] = useState<MenuConfig>({ name: 'header', links: [] });
  const [footerMenu, setFooterMenu] = useState<MenuConfig>({ name: 'footer', links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(API_URL + '/api/menus');
      const data = await res.json();
      const header = data.find((m: any) => m.name === 'header');
      const footer = data.find((m: any) => m.name === 'footer');
      if (header) setHeaderMenu(header);
      if (footer) setFooterMenu(footer);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMenu = async (menu: MenuConfig) => {
    try {
      const res = await fetch(API_URL + '/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
        credentials: 'include'
      });
      if (res.ok) {
        // We can't easily use setNotification here if it's not passed down
        // For now, let's just log it or we could pass a notify function
        console.log(`${menu.name} menu updated successfully!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addLink = (menuName: 'header' | 'footer') => {
    const setMenu = menuName === 'header' ? setHeaderMenu : setFooterMenu;
    const menu = menuName === 'header' ? headerMenu : footerMenu;
    setMenu({
      ...menu,
      links: [...menu.links, { label: 'New Link', url: '/', order: menu.links.length }]
    });
  };

  const updateLink = (menuName: 'header' | 'footer', index: number, field: keyof MenuLink, value: any) => {
    const setMenu = menuName === 'header' ? setHeaderMenu : setFooterMenu;
    const menu = menuName === 'header' ? headerMenu : footerMenu;
    const newLinks = [...menu.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setMenu({ ...menu, links: newLinks });
  };

  const removeLink = (menuName: 'header' | 'footer', index: number) => {
    const setMenu = menuName === 'header' ? setHeaderMenu : setFooterMenu;
    const menu = menuName === 'header' ? headerMenu : footerMenu;
    const newLinks = menu.links.filter((_, i) => i !== index);
    setMenu({ ...menu, links: newLinks });
  };

  if (loading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading Menus...</div>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Navigation Management</h1>
        <p className="text-slate-500 font-medium">Manage your website's header and footer links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Header Menu */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Globe size={20} className="text-indigo-600" /> Header Menu</h2>
            <button onClick={() => addLink('header')} className="text-indigo-600 font-bold text-sm flex items-center gap-1"><Plus size={16} /> Add Link</button>
          </div>
          <div className="space-y-4 mb-8">
            {headerMenu.links.map((link, index) => (
              <div key={index} className="flex gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <Input label="Label" value={link.label} onChange={(v: string) => updateLink('header', index, 'label', v)} />
                  <Input label="URL" value={link.url} onChange={(v: string) => updateLink('header', index, 'url', v)} />
                </div>
                <button onClick={() => removeLink('header', index)} className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors mb-1 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => handleSaveMenu(headerMenu)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Header Menu</button>
        </div>

        {/* Footer Menu */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Layout size={20} className="text-indigo-600" /> Footer Menu</h2>
            <button onClick={() => addLink('footer')} className="text-indigo-600 font-bold text-sm flex items-center gap-1"><Plus size={16} /> Add Link</button>
          </div>
          <div className="space-y-4 mb-8">
            {footerMenu.links.map((link, index) => (
              <div key={index} className="flex gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <Input label="Label" value={link.label} onChange={(v: string) => updateLink('footer', index, 'label', v)} />
                  <Input label="URL" value={link.url} onChange={(v: string) => updateLink('footer', index, 'url', v)} />
                </div>
                <button onClick={() => removeLink('footer', index)} className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors mb-1 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => handleSaveMenu(footerMenu)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Footer Menu</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [headerMenu, setHeaderMenu] = useState<MenuConfig>({ name: 'header', links: [] });
  const [footerMenu, setFooterMenu] = useState<MenuConfig>({ name: 'footer', links: [] });
  const [currentPage, setCurrentPage] = useState<PageConfig | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscriptionReport, setSubscriptionReport] = useState<any>(null);
  const [subscribedUsers, setSubscribedUsers] = useState<User[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isStudentViewOpen, setIsStudentViewOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingEnrollment, setPendingEnrollment] = useState<{ id: string, type: 'paid' | 'free' } | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [placements, setPlacements] = useState<Job[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, duration: '', features: '', planId: '' });
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobDateFilter, setJobDateFilter] = useState('');
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', apply_url: '', description: '' });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [siteSettings, setSiteSettings] = useState({ logoUrl: '', siteName: '' });
  
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const checkAccess = (user: User | null) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.hasCourseAccess) return true;
    
    // Check trial
    const trialExpiry = new Date(user.trialStartDate);
    trialExpiry.setDate(trialExpiry.getDate() + 3);
    if (new Date() < trialExpiry) return true;
    
    // Check subscription
    if (user.subscriptionPlan && user.subscriptionEndDate) {
      if (new Date() < new Date(user.subscriptionEndDate)) return true;
    }
    
    return false;
  };

  const [lockedContent, setLockedContent] = useState<any[]>([]);
  
  useEffect(() => {
    const safeFetch = async (url: string, setter: (data: any) => void) => {
      try {
        const res = await fetch(url);
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          setter(data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${url}`, err);
      }
    };

    safeFetch(API_URL + '/api/homepage', setCurrentPage);
    
    fetch(API_URL + '/api/menus')
      .then(res => res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const header = data.find((m: any) => m.name === 'header');
          const footer = data.find((m: any) => m.name === 'footer');
          if (header) setHeaderMenu(header);
          if (footer) setFooterMenu(footer);
        }
      })
      .catch(err => console.error('Failed to fetch menus', err));

    safeFetch(API_URL + '/api/locked-content', setLockedContent);
    safeFetch(API_URL + '/api/placements', setPlacements);
    safeFetch(API_URL + '/api/subscription-plans', setSubscriptionPlans);
  }, [currentUser]);
  
  const [moduleForm, setModuleForm] = useState({ 
    title: '', 
    description: '', 
    order: 0, 
    visibility: 'published' 
  });

  const SubscriptionTimer = () => {
    if (!currentUser || currentUser.role === 'admin' || checkAccess(currentUser)) return null;
    
    const trialExpiry = new Date(currentUser.trialStartDate);
    trialExpiry.setDate(trialExpiry.getDate() + 3);
    const now = new Date();
    const timeLeft = trialExpiry.getTime() - now.getTime();
    
    if (timeLeft <= 0) return (
      <div className="fixed bottom-0 left-0 right-0 bg-rose-600 text-white p-4 text-center font-bold z-50">
        Your free access has expired. Subscribe to continue.
      </div>
    );
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 text-center font-bold z-50">
        Free access ends in {days}d {hours}h. Subscribe to unlock premium content!
      </div>
    );
  };

  const LockedContentOverlay = ({ children }: { children: React.ReactNode }) => {
    if (!currentUser || currentUser.role === 'admin' || checkAccess(currentUser)) return <>{children}</>;
    
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-200">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Subscribe to Unlock</h2>
            <p className="text-slate-500 mb-6">This content is premium. Subscribe to get full access.</p>
            <button 
              onClick={() => setActiveTab('subscription')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [lectureForm, setLectureForm] = useState({
    title: '',
    type: 'recorded',
    youtubeLiveUrl: '',
    youtubeRecordedUrl: '',
    scheduledAt: '',
    duration: 60
  });
  
  // Form States
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    modules_count: '',
    isPublished: false,
    type: 'paid' as 'paid' | 'free',
    landing_page: {
      benefits: '',
      requirements: '',
      target_audience: '',
      curriculum_overview: '',
      instructor_name: '',
      instructor_bio: '',
      instructor_image: ''
    }
  });

  const [lockedContents, setLockedContents] = useState<LockedContent[]>([]);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<LockedContent | null>(null);
  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'placement' as 'placement' | 'notes' | 'jobs' | 'hackathons' | 'coding',
    content: ''
  });
  const [viewingCourseLanding, setViewingCourseLanding] = useState<Course | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'basic' | 'landing'>('basic');
  const [dbStatus, setDbStatus] = useState<'Connected' | 'Disconnected' | 'Connecting'>('Connecting');

  useEffect(() => {
    fetchData();
    fetchUser();
    const interval = setInterval(checkHealth, 5000);

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      clearInterval(interval);
      document.body.removeChild(script);
    };
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(API_URL + '/api/health', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.database);
      }
    } catch (err) {
      setDbStatus('Disconnected');
    }
  };

  const fetchData = async () => {
    try {
      const [coursesRes, statsRes, studentsRes, placementsRes, lockedContentsRes, subReportRes, subUsersRes, pagesRes, settingsRes] = await Promise.all([
        fetch(API_URL + '/api/courses', { credentials: 'include' }),
        fetch(API_URL + '/api/stats', { credentials: 'include' }),
        fetch(API_URL + '/api/users', { credentials: 'include' }),
        fetch(API_URL + '/api/placements', { credentials: 'include' }),
        fetch(API_URL + '/api/locked-content', { credentials: 'include' }),
        fetch(API_URL + '/api/admin/subscription-report', { credentials: 'include' }),
        fetch(API_URL + '/api/admin/subscribed-users', { credentials: 'include' }),
        fetch(API_URL + '/api/admin/pages', { credentials: 'include' }),
        fetch(API_URL + '/api/settings/site_settings', { credentials: 'include' })
      ]);
      
      const getJson = async (res: Response) => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return await res.json();
        }
        return null;
      };

      const coursesData = await getJson(coursesRes);
      const statsData = await getJson(statsRes);
      const studentsData = await getJson(studentsRes);
      const placementsData = await getJson(placementsRes);
      const lockedContentsData = await getJson(lockedContentsRes);
      const subReportData = await getJson(subReportRes);
      const subUsersData = await getJson(subUsersRes);
      const pagesData = await getJson(pagesRes);
      const settingsData = await getJson(settingsRes);

      if (coursesData) setCourses(coursesData);
      if (statsData) setStats(statsData);
      if (studentsData) setStudents(studentsData);
      if (placementsData) setPlacements(placementsData);
      if (lockedContentsData) setLockedContents(lockedContentsData);
      if (subReportData) setSubscriptionReport(subReportData);
      if (subUsersData) setSubscribedUsers(subUsersData);
      if (pagesData) setPages(pagesData);
      if (settingsData) setSiteSettings(settingsData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(API_URL + '/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        return data;
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      setCurrentUser(null);
    }
    return null;
  };

  const handleLogin = async (data: any) => {
    const res = await fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (res.ok) {
      const user = await res.json();
      setCurrentUser(user);
      setShowAuthModal(false);
      fetchData();
      
      // Handle pending enrollment
      if (pendingEnrollment) {
        enrollInCourse(pendingEnrollment.id, pendingEnrollment.type, user);
        setPendingEnrollment(null);
      }
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
  };

  const handleRegister = async (data: any) => {
    const res = await fetch(API_URL + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (res.ok) {
      const user = await res.json();
      setCurrentUser(user);
      setShowAuthModal(false);
      fetchData();

      // Handle pending enrollment
      if (pendingEnrollment) {
        enrollInCourse(pendingEnrollment.id, pendingEnrollment.type, user);
        setPendingEnrollment(null);
      }
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    await fetch(API_URL + '/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const toggleProgress = async (courseId: string, lectureId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(API_URL + `/api/users/${currentUser._id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lectureId })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLectureCompleted = (courseId: string, lectureId: string) => {
    const progress = currentUser?.progress?.find(p => p.courseId === courseId);
    return progress?.completedLectures?.includes(lectureId) || false;
  };

  const getCourseProgress = (courseId: string) => {
    const progress = currentUser?.progress?.find(p => p.courseId === courseId);
    if (!progress) return 0;
    
    const course = courses.find(c => c._id === courseId);
    if (!course) return 0;
    
    const totalLectures = course.modules.reduce((sum, m) => sum + (m.lectures?.length || 0), 0);
    if (totalLectures === 0) return 0;
    
    return Math.round((progress.completedLectures.length / totalLectures) * 100);
  };

  const getStudentOverallProgress = (student: User) => {
    if (!student.progress || student.progress.length === 0) return 0;
    
    let totalCompleted = 0;
    let totalLectures = 0;
    
    student.progress.forEach(p => {
      const course = courses.find(c => c._id === p.courseId);
      if (course) {
        totalCompleted += p.completedLectures.length;
        totalLectures += course.modules.reduce((sum, m) => sum + (m.lectures?.length || 0), 0);
      }
    });
    
    if (totalLectures === 0) return 0;
    return Math.round((totalCompleted / totalLectures) * 100);
  };

  const handleContentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = editingContent ? `/api/admin/locked-content/${editingContent._id}` : '/api/admin/locked-content';
      const method = editingContent ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm),
        credentials: 'include'
      });
      if (res.ok) {
        setIsContentModalOpen(false);
        setEditingContent(null);
        setContentForm({ title: '', type: 'placement', content: '' });
        fetchData();
      } else {
        throw new Error('Failed to save content');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      const res = await fetch(API_URL + `/api/admin/locked-content/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
      } else {
        throw new Error('Failed to delete content');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete content');
    }
  };

  const enrollInCourse = async (courseId: string, type: 'paid' | 'free', userOverride?: User) => {
    const user = userOverride || currentUser;
    if (!user) {
      setPendingEnrollment({ id: courseId, type });
      setAuthType('login');
      setShowAuthModal(true);
      return;
    }
    
    if (type === 'paid') {
      const course = courses.find(c => c._id === courseId);
      setSelectedCourseForPayment(course);
      setIsPaymentModalOpen(true);
      return;
    }

    try {
      const res = await fetch(API_URL + `/api/users/${user._id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
        credentials: 'include'
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        setViewingCourseLanding(null);
        alert('Successfully enrolled in the course!');
        setActiveTab('my-learning');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscriptionPurchase = async (planId: string) => {
    if (!currentUser) return;

    try {
      // 1. Create order on server
      const orderRes = await fetch(API_URL + '/api/subscription/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
        credentials: 'include'
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        throw new Error(error.error || 'Failed to create subscription order');
      }

      const order = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shiddat Programming Institute",
        description: `Subscribe to ${planId} plan`,
        image: "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png",
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify payment on server
          const verifyRes = await fetch(API_URL + '/api/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId
            }),
            credentials: 'include'
          });

          if (verifyRes.ok) {
            const updatedUser = await verifyRes.json();
            setCurrentUser(updatedUser);
            alert('Subscription activated successfully!');
            fetchData();
          } else {
            const error = await verifyRes.json();
            alert(error.error || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Error purchasing subscription:', error);
      alert(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleRazorpayPayment = async (course: Course) => {
    if (!currentUser) return;

    try {
      // 1. Create order on server
      const orderRes = await fetch(API_URL + '/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
        credentials: 'include'
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shiddat Programming Institute",
        description: `Purchase ${course.title}`,
        image: "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png",
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify payment on server
          const verifyRes = await fetch(API_URL + '/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id
            }),
            credentials: 'include'
          });

          if (verifyRes.ok) {
            const updatedUser = await fetch(API_URL + '/api/auth/me', { credentials: 'include' }).then(r => r.json());
            setCurrentUser(updatedUser);
            setIsPaymentModalOpen(false);
            setSelectedCourseForPayment(null);
            setViewingCourseLanding(null);
            alert('Payment successful! You are now enrolled.');
            setActiveTab('my-learning');
            fetchData();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: "#4f46e5",
        },
        config: {
          display: {
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong with the payment process.");
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedCourseForPayment || !currentUser) return;
    
    try {
      const res = await fetch(API_URL + `/api/users/${currentUser._id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: selectedCourseForPayment._id })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        setIsPaymentModalOpen(false);
        setSelectedCourseForPayment(null);
        setViewingCourseLanding(null);
        alert('Payment successful! You are now enrolled.');
        setActiveTab('my-learning');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlan = async (e: FormEvent) => {
    e.preventDefault();
    const featuresArray = planForm.features.split(',').map(f => f.trim()).filter(f => f);
    const payload = { ...planForm, features: featuresArray };
    
    try {
      if (editingPlan) {
        const res = await fetch(API_URL + `/api/admin/subscription-plans/${editingPlan._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setSubscriptionPlans(subscriptionPlans.map(p => p._id === updated._id ? updated : p));
          setIsPlanModalOpen(false);
          setEditingPlan(null);
          setPlanForm({ name: '', price: 0, duration: '', features: '', planId: '' });
        }
      } else {
        const res = await fetch(API_URL + '/api/admin/subscription-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setSubscriptionPlans([...subscriptionPlans, created]);
          setIsPlanModalOpen(false);
          setPlanForm({ name: '', price: 0, duration: '', features: '', planId: '' });
        }
      }
    } catch (err) {
      console.error("Failed to save plan:", err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(API_URL + `/api/admin/subscription-plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setSubscriptionPlans(subscriptionPlans.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  const handleDisableSubscription = async (userId: string) => {
    console.log(`Attempting to disable subscription for user: ${userId}`);
    try {
      const res = await fetch(API_URL + `/api/admin/disable-subscription/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.ok) {
        setNotification({ message: "Subscription disabled successfully", type: 'success' });
        fetchData(); // Refresh data
        setTimeout(() => setNotification(null), 3000);
      } else {
        const data = await res.json();
        setNotification({ message: data.error || "Failed to disable subscription", type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Error disabling subscription:", err);
      setNotification({ message: "An error occurred while disabling subscription", type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEnableSubscription = async (userId: string, plan: string = 'monthly') => {
    try {
      const res = await fetch(API_URL + `/api/admin/enable-subscription/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
        credentials: 'include'
      });
      if (res.ok) {
        setNotification({ message: `Subscription enabled (${plan}) successfully`, type: 'success' });
        fetchData(); // Refresh data
        setTimeout(() => setNotification(null), 3000);
      } else {
        const data = await res.json();
        setNotification({ message: data.error || "Failed to enable subscription", type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Error enabling subscription:", err);
      setNotification({ message: "An error occurred while enabling subscription", type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSavePage = async (page: PageConfig) => {
    // Basic slug validation
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(page.slug)) {
      setNotification({ message: 'Slug can only contain lowercase letters, numbers, and hyphens', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const url = page._id ? `${API_URL}/api/admin/pages/${page._id}` : `${API_URL}/api/admin/pages`;
      const method = page._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
        credentials: 'include'
      });
      if (res.ok) {
        setEditingPage(null);
        fetchData();
        setNotification({ message: 'Page saved successfully', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        const data = await res.json();
        setNotification({ message: data.error || 'Failed to save page', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'An error occurred', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/pages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setNotification({ message: 'Page deleted successfully', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        const data = await res.json();
        setNotification({ message: data.error || 'Failed to delete page', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'An error occurred', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = editingJob ? `/api/placements/${editingJob._id}` : '/api/placements';
      const method = editingJob ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      });
      if (res.ok) {
        setIsJobModalOpen(false);
        setEditingJob(null);
        setJobForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', apply_url: '', description: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const res = await fetch(API_URL + `/api/placements/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCourse ? `/api/courses/${editingCourse._id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseForm,
          price: Number(courseForm.price),
          modules_count: Number(courseForm.modules_count),
          landing_page: {
            ...courseForm.landing_page,
            benefits: courseForm.landing_page.benefits.split('\n').filter(b => b.trim()),
            requirements: courseForm.landing_page.requirements.split('\n').filter(r => r.trim()),
            target_audience: courseForm.landing_page.target_audience.split('\n').filter(t => t.trim())
          }
        })
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (res.ok) {
          setIsCreateModalOpen(false);
          setEditingCourse(null);
          setCourseForm({ 
            title: '', 
            description: '', 
            price: '', 
            image_url: '', 
            modules_count: '', 
            isPublished: false, 
            type: 'paid',
            landing_page: {
              benefits: '',
              requirements: '',
              target_audience: '',
              curriculum_overview: '',
              instructor_name: '',
              instructor_bio: '',
              instructor_image: ''
            }
          });
          fetchData();
        } else {
          alert(`Error: ${data.error || 'Failed to process course'}`);
        }
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        if (text.includes("Please wait while your application starts")) {
          alert('Server is still warming up. Please wait 5-10 seconds and try again.');
        } else {
          alert('Database Connection Error: Please ensure your MongoDB Atlas IP Whitelist is set to 0.0.0.0/0');
        }
      }
    } catch (err) {
      console.error('Failed to process course', err);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(API_URL + `/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
      else alert('Failed to delete course');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch(API_URL + '/api/admin/settings/site_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
        credentials: 'include'
      });
      if (res.ok) {
        setNotification({ message: 'Settings saved successfully', type: 'success' });
      } else {
        setNotification({ message: 'Failed to save settings', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'Error saving settings', type: 'error' });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(API_URL + '/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setSiteSettings({ ...siteSettings, logoUrl: API_URL + data.url });
        setNotification({ message: 'Logo uploaded successfully', type: 'success' });
      } else {
        setNotification({ message: 'Failed to upload logo', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'Error uploading logo', type: 'error' });
    }
  };

  const handleAddModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const url = editingModule 
        ? `/api/courses/${selectedCourse._id}/modules/${editingModule._id}`
        : `/api/courses/${selectedCourse._id}/modules`;
      const method = editingModule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      });
      if (res.ok) {
        setModuleForm({ title: '', description: '', order: 0, visibility: 'published' });
        setEditingModule(null);
        const updatedCourse = await res.json();
        setSelectedCourse(updatedCourse);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedCourse || !confirm('Delete this module?')) return;
    try {
      const res = await fetch(API_URL + `/api/courses/${selectedCourse._id}/modules/${moduleId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updatedCourse = await res.json();
        setSelectedCourse(updatedCourse);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLecture = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule) return;
    try {
      const url = editingLecture
        ? `/api/courses/${selectedCourse._id}/modules/${selectedModule._id}/lectures/${editingLecture._id}`
        : `/api/courses/${selectedCourse._id}/modules/${selectedModule._id}/lectures`;
      const method = editingLecture ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lectureForm)
      });
      if (res.ok) {
        setLectureForm({ title: '', type: 'recorded', youtubeLiveUrl: '', youtubeRecordedUrl: '', scheduledAt: '', duration: 60 });
        setEditingLecture(null);
        setIsLectureModalOpen(false);
        const updatedCourse = await res.json();
        setSelectedCourse(updatedCourse);
        // Refresh selected module to show new lecture
        const updatedModule = updatedCourse.modules.find((m: any) => m._id === selectedModule._id);
        setSelectedModule(updatedModule);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!selectedCourse || !selectedModule || !confirm('Delete this lecture?')) return;
    try {
      const res = await fetch(API_URL + `/api/courses/${selectedCourse._id}/modules/${selectedModule._id}/lectures/${lectureId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updatedCourse = await res.json();
        setSelectedCourse(updatedCourse);
        const updatedModule = updatedCourse.modules.find((m: any) => m._id === selectedModule._id);
        setSelectedModule(updatedModule);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    if (viewingCourseLanding) {
      return (
        <div className="min-h-screen bg-slate-50">
          <CourseLandingPage 
            course={viewingCourseLanding} 
            onBack={() => setViewingCourseLanding(null)} 
            onEnroll={enrollInCourse}
            isEnrolled={false}
            onContinueLearning={() => {}}
          />
          {showAuthModal && (
            <AuthForm 
              type={authType}
              onClose={() => setShowAuthModal(false)}
              onSwitch={() => setAuthType(authType === 'login' ? 'register' : 'login')}
              onSubmit={authType === 'login' ? handleLogin : handleRegister}
            />
          )}
        </div>
      );
    }

    return (
      <>
        <LandingPage 
          courses={courses}
          placements={placements}
          stats={stats}
          onLogin={() => { setAuthType('login'); setShowAuthModal(true); }} 
          onRegister={() => { setAuthType('register'); setShowAuthModal(true); }} 
          onEnroll={enrollInCourse}
          onViewLanding={setViewingCourseLanding}
          config={currentPage}
          headerMenu={headerMenu}
          footerMenu={footerMenu}
          setCurrentPage={setCurrentPage}
          siteSettings={siteSettings}
        />
        {showAuthModal && (
          <AuthForm 
            type={authType}
            onClose={() => setShowAuthModal(false)}
            onSwitch={() => setAuthType(authType === 'login' ? 'register' : 'login')}
            onSubmit={authType === 'login' ? handleLogin : handleRegister}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Notification Toast */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </motion.div>
      )}
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center gap-3">
          <img 
            src={siteSettings.logoUrl || "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png"} 
            alt={siteSettings.siteName || "Shiddat Logo"} 
            className={`transition-all duration-300 ${isSidebarOpen ? 'h-12' : 'h-8'} w-auto object-contain`}
            referrerPolicy="no-referrer"
          />
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-800 leading-none">{siteSettings.siteName?.split(' ')[0] || "Shiddat"}</span>
              <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">{siteSettings.siteName?.split(' ').slice(1).join(' ') || "Programming"}</span>
            </div>
          )}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} collapsed={!isSidebarOpen} />
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} />
          {currentUser?.role === 'admin' && (
            <>
              <NavItem icon={<BookOpen />} label="Manage Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Layout />} label="Page Management" active={activeTab === 'landing-page'} onClick={() => setActiveTab('landing-page')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Globe />} label="Navigation" active={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')} collapsed={!isSidebarOpen} />
              <NavItem icon={<FileText />} label="Content Management" active={activeTab === 'content-management'} onClick={() => setActiveTab('content-management')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Users />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Briefcase />} label="Placements" active={activeTab === 'placements'} onClick={() => setActiveTab('placements')} collapsed={!isSidebarOpen} />
              <NavItem icon={<CreditCard />} label="Manage Plans" active={activeTab === 'manage-plans'} onClick={() => setActiveTab('manage-plans')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Settings />} label="Site Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} />
            </>
          )}
          {currentUser?.role === 'student' && (
            <>
              <NavItem icon={<GraduationCap />} label="My Learning" active={activeTab === 'my-learning'} onClick={() => setActiveTab('my-learning')} collapsed={!isSidebarOpen} />
              <NavItem icon={<FileText />} label="Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Search />} label="Jobs" active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} collapsed={!isSidebarOpen} />
              <NavItem icon={<Sparkles />} label="Hackathons" active={activeTab === 'hackathons'} onClick={() => setActiveTab('hackathons')} collapsed={!isSidebarOpen} />
            </>
          )}
          <NavItem icon={<CreditCard />} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Code />} label="Coding Lab" active={activeTab === 'coding'} onClick={() => setActiveTab('coding')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Trophy />} label="Tests & Exams" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} collapsed={!isSidebarOpen} />
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Database</p>
              <p className="text-xs font-bold text-slate-700">{dbStatus}</p>
            </div>
            {dbStatus !== 'Connected' && (
              <button onClick={checkHealth} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <Search className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            
            {/* Logo for mobile when sidebar is hidden */}
            <div className="md:hidden flex items-center gap-2">
              <img 
                src={siteSettings.logoUrl || "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png"} 
                alt={siteSettings.siteName || "Shiddat Logo"} 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search courses, students..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 relative hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
              {currentUser?.name.charAt(0)}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-red-600 transition-all"
              title="Logout"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Payment Modal */}
            {isPaymentModalOpen && selectedCourseForPayment && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white p-8 rounded-[32px] shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Secure Checkout</h2>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500 font-medium">Course</span>
                      <span className="font-bold text-slate-800">{selectedCourseForPayment.title}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Total Amount</span>
                      <span className="text-2xl font-black text-indigo-600">₹{selectedCourseForPayment.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div 
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={`flex items-center gap-4 p-4 border rounded-2xl transition-all cursor-pointer group ${selectedPaymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50'}`}
                    >
                      <div className={`w-10 h-10 bg-white rounded-xl border flex items-center justify-center ${selectedPaymentMethod === 'card' ? 'border-indigo-200' : 'border-slate-200 group-hover:border-indigo-200'}`}>
                        <CreditCard className={`w-6 h-6 ${selectedPaymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Credit / Debit Card</p>
                        <p className="text-xs text-slate-400">Visa, Mastercard, RuPay</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'card' ? 'border-indigo-600' : 'border-slate-200'}`}>
                        {selectedPaymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                      </div>
                    </div>
                    <div 
                      onClick={() => setSelectedPaymentMethod('upi')}
                      className={`flex items-center gap-4 p-4 border rounded-2xl transition-all cursor-pointer group ${selectedPaymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50'}`}
                    >
                      <div className={`w-10 h-10 bg-white rounded-xl border flex items-center justify-center ${selectedPaymentMethod === 'upi' ? 'border-indigo-200' : 'border-slate-200 group-hover:border-indigo-200'}`}>
                        <Smartphone className={`w-6 h-6 ${selectedPaymentMethod === 'upi' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">UPI Payment</p>
                        <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'upi' ? 'border-indigo-600' : 'border-slate-200'}`}>
                        {selectedPaymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => selectedCourseForPayment && handleRazorpayPayment(selectedCourseForPayment)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Pay with Razorpay
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> 256-bit SSL Secure Encryption
                  </p>
                </motion.div>
              </div>
            )}

            {activeTab === 'home' && !viewingCourseLanding && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="home">
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-slate-800 mb-2">Explore Courses</h1>
                  <p className="text-slate-500">Pick a course that matches your interests and start your learning journey today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course, cIdx) => (
                    <div 
                      key={course._id || cIdx} 
                      onClick={() => setViewingCourseLanding(course)}
                      className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {course.type === 'free' ? (
                            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Free</span>
                          ) : (
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Premium</span>
                          )}
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                          <p className="font-black text-indigo-600 text-lg">
                            {course.type === 'free' ? 'FREE' : `₹${course.price}`}
                          </p>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Layers className="w-4 h-4" />
                            {course.modules_count} Modules
                          </div>
                          <span className="text-indigo-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'home' && viewingCourseLanding && (
              <CourseLandingPage 
                course={viewingCourseLanding} 
                onBack={() => setViewingCourseLanding(null)} 
                onEnroll={enrollInCourse}
                isEnrolled={currentUser?.role === 'admin' || currentUser?.progress?.some(p => p.courseId === viewingCourseLanding._id) || false}
                isAdmin={currentUser?.role === 'admin'}
                onContinueLearning={() => {
                  setSelectedCourse(viewingCourseLanding);
                  if (currentUser?.role === 'admin') {
                    setIsModuleModalOpen(true);
                  } else {
                    setIsStudentViewOpen(true);
                  }
                }}
              />
            )}

            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="dashboard">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800">Welcome back, {currentUser?.name}!</h1>
                    <p className="text-slate-500 mt-1">
                      {currentUser?.role === 'admin' 
                        ? "Here's what's happening with your institute today." 
                        : "Ready to continue your learning journey?"}
                    </p>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Generate Report
                    </button>
                  )}
                </div>

                {currentUser?.role === 'admin' ? (
                  <>
                    {/* Database Warning */}
                    {dbStatus !== 'Connected' && (
                      <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 text-rose-800">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">Database Connection Required</p>
                          <p className="text-sm opacity-80">Please ensure your MongoDB Atlas IP Whitelist is set to 0.0.0.0/0. Current Status: <strong>{dbStatus}</strong></p>
                        </div>
                        <button onClick={checkHealth} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors">
                          Retry Connection
                        </button>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <StatCard label="Total Students" value={stats?.totalUsers || 0} icon={<Users className="text-blue-600" />} trend="+12% this month" color="blue" />
                      <StatCard label="Active Courses" value={stats?.totalCourses || 0} icon={<BookOpen className="text-indigo-600" />} trend="2 new added" color="indigo" />
                      <StatCard label="Total Revenue" value={`₹${stats?.revenue?.toLocaleString() || 0}`} icon={<CreditCard className="text-emerald-600" />} trend="+8.4% growth" color="emerald" />
                    </div>

                    {/* Subscription Report */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium mb-1">Active Subscribers</p>
                        <h4 className="text-2xl font-bold text-slate-900">{subscriptionReport?.activeSubscribers || 0}</h4>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium mb-1">Trial Users</p>
                        <h4 className="text-2xl font-bold text-slate-900">{subscriptionReport?.trialUsers || 0}</h4>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium mb-1">Expired Subscriptions</p>
                        <h4 className="text-2xl font-bold text-slate-900">{subscriptionReport?.expiredSubscribers || 0}</h4>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-sm font-medium mb-1">Plan Breakdown</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {subscriptionReport?.planBreakdown?.map((p: any) => (
                            <span key={p._id} className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">
                              {p._id}: {p.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Recent Courses */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-lg">Top Selling Courses</h3>
                          <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                          {courses.map((course, cIdx) => (
                            <div key={course._id || cIdx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                              <img src={course.image_url} alt={course.title} className="w-16 h-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800">{course.title}</h4>
                                <p className="text-xs text-slate-500">{course.modules_count} Modules • {Math.floor(Math.random() * 500)} Students</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-indigo-600">₹{course.price}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase">Trending</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-indigo-900 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Ready to expand?</h3>
                          <p className="text-indigo-200 mb-8 max-w-xs">Create a new batch, upload notes, or schedule a live class in seconds.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <QuickAction icon={<PlayCircle />} label="Live Class" />
                            <QuickAction icon={<FileText />} label="Upload Notes" />
                            <QuickAction icon={<Users />} label="New Batch" />
                            <QuickAction icon={<Bell />} label="Broadcast" />
                          </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-8">
                    {/* Student Dashboard Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                        <h3 className="text-lg font-bold mb-2">My Progress</h3>
                        <p className="text-4xl font-black mb-4">{getStudentOverallProgress(currentUser)}%</p>
                        <p className="text-indigo-100 text-sm">Keep it up! You're doing great.</p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Enrolled Courses</h3>
                        <p className="text-4xl font-black text-indigo-600 mb-4">{currentUser?.progress?.length || 0}</p>
                        <button onClick={() => setActiveTab('my-learning')} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider">View All Courses →</button>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Upcoming Classes</h3>
                        <p className="text-4xl font-black text-rose-600 mb-4">2</p>
                        <p className="text-sm text-slate-500">Next class starts in 45 mins</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6">Continue Learning</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.filter(c => currentUser?.progress?.some(p => p.courseId === c._id)).slice(0, 2).map((course, cIdx) => (
                          <div key={course._id || cIdx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-center group hover:shadow-md transition-all">
                            <img src={course.image_url} className="w-24 h-24 rounded-2xl object-cover" alt={course.title} />
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 mb-2">{course.title}</h4>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                                <div className="bg-indigo-600 h-full" style={{ width: `${getCourseProgress(course._id)}%` }} />
                              </div>
                              <button 
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setIsStudentViewOpen(true);
                                }}
                                className="text-xs font-bold text-indigo-600 uppercase tracking-wider hover:underline"
                              >
                                Resume Course →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="courses">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>
                  <button 
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseForm({ 
                        title: '', 
                        description: '', 
                        price: '', 
                        image_url: '', 
                        modules_count: '',
                        isPublished: false,
                        type: 'paid',
                        landing_page: {
                          benefits: '',
                          requirements: '',
                          target_audience: '',
                          curriculum_overview: '',
                          instructor_name: '',
                          instructor_bio: '',
                          instructor_image: ''
                        }
                      });
                      setActiveModalTab('basic');
                      setIsCreateModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Course
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, cIdx) => (
                    <div key={course._id || cIdx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {course.type === 'free' ? (
                            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Free</span>
                          ) : (
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Premium</span>
                          )}
                          {currentUser?.role === 'admin' && (
                            <span className={`px-3 py-1 ${course.isPublished ? 'bg-blue-500' : 'bg-slate-500'} text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          )}
                        </div>
                        {currentUser?.role === 'admin' && (
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingCourse(course);
                                setCourseForm({
                                  title: course.title,
                                  description: course.description,
                                  price: String(course.price),
                                  image_url: course.image_url,
                                  modules_count: String(course.modules_count),
                                  isPublished: course.isPublished || false,
                                  type: course.type || 'paid',
                                  landing_page: {
                                    benefits: course.landing_page?.benefits?.join('\n') || '',
                                    requirements: course.landing_page?.requirements?.join('\n') || '',
                                    target_audience: course.landing_page?.target_audience?.join('\n') || '',
                                    curriculum_overview: course.landing_page?.curriculum_overview || '',
                                    instructor_name: course.landing_page?.instructor_name || '',
                                    instructor_bio: course.landing_page?.instructor_bio || '',
                                    instructor_image: course.landing_page?.instructor_image || ''
                                  }
                                });
                                setIsCreateModalOpen(true);
                              }}
                              className="p-2 bg-white/90 backdrop-blur rounded-lg text-indigo-600 hover:bg-white transition-colors shadow-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCourse(course._id)}
                              className="p-2 bg-white/90 backdrop-blur rounded-lg text-rose-600 hover:bg-white transition-colors shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg text-slate-800 leading-tight">{course.title}</h3>
                          <p className="font-bold text-indigo-600">
                            {course.type === 'free' ? 'FREE' : `₹${course.price}`}
                          </p>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{course.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                            <Layers className="w-4 h-4" />
                            {course.modules_count} Modules
                          </div>
                          <div className="flex items-center gap-3">
                            {currentUser?.role === 'admin' || currentUser?.progress?.some(p => p.courseId === course._id) ? (
                              <button 
                                onClick={() => {
                                  setSelectedCourse(course);
                                  if (currentUser?.role === 'admin') {
                                    setIsModuleModalOpen(true);
                                  } else {
                                    setIsStudentViewOpen(true);
                                  }
                                }}
                                className="text-indigo-600 text-sm font-bold hover:underline"
                              >
                                {currentUser?.role === 'admin' ? 'Manage Modules' : 'Start Learning'}
                              </button>
                            ) : (
                              <button 
                                onClick={() => enrollInCourse(course._id, course.type)}
                                className={`${course.type === 'free' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors`}
                              >
                                {course.type === 'free' ? 'Enroll Free' : 'Buy Course'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'landing-page' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="landing-page" className="h-full">
                {editingPage ? (
                  <PageBuilder 
                    page={editingPage} 
                    onSave={handleSavePage} 
                    onCancel={() => setEditingPage(null)} 
                  />
                ) : (
                  <PageManager 
                    pages={pages} 
                    onEdit={setEditingPage} 
                    onCreate={() => setEditingPage({ title: 'New Page', slug: 'new-page', sections: [], isPublished: false, isHomepage: false })}
                    onDelete={handleDeletePage}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'navigation' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="navigation">
                <MenuManager />
              </motion.div>
            )}

            {activeTab === 'content-management' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="content-management">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-800">Content Management</h1>
                  <button 
                    onClick={() => {
                      setEditingContent(null);
                      setContentForm({ title: '', type: 'placement', content: '' });
                      setIsContentModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Content
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lockedContents.map((content, cIdx) => (
                    <div key={content._id || cIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-slate-800">{content.title}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-widest rounded-full">{content.type}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-6">{content.content}</p>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingContent(content);
                            setContentForm({ title: content.title, type: content.type, content: content.content });
                            setIsContentModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContent(content._id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Modal */}
            <AnimatePresence>
              {isContentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingContent ? 'Edit Content' : 'Add Content'}</h2>
                    <form onSubmit={handleContentSubmit} className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Title" 
                        value={contentForm.title} 
                        onChange={e => setContentForm({...contentForm, title: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200"
                        required
                      />
                      <select 
                        value={contentForm.type} 
                        onChange={e => setContentForm({...contentForm, type: e.target.value as any})}
                        className="w-full p-3 rounded-xl border border-slate-200"
                      >
                        <option value="placement">Placement</option>
                        <option value="notes">Notes</option>
                        <option value="jobs">Jobs</option>
                        <option value="hackathons">Hackathons</option>
                        <option value="coding">Coding</option>
                      </select>
                      <textarea 
                        placeholder="Content" 
                        value={contentForm.content} 
                        onChange={e => setContentForm({...contentForm, content: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 h-32"
                        required
                      />
                      <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsContentModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Save</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {activeTab === 'my-learning' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="my-learning">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Learning</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.filter(c => currentUser?.progress?.some(p => p.courseId === c._id)).map((course, cIdx) => (
                    <div key={course._id || cIdx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsStudentViewOpen(true);
                            }}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                          >
                            <PlayCircle className="w-5 h-5" /> Start Learning
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{course.title}</h3>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${getCourseProgress(course._id)}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase">{getCourseProgress(course._id)}% Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Student View Modal */}
            {isStudentViewOpen && selectedCourse && (
              <div className="fixed inset-0 z-[150] bg-white flex flex-col md:flex-row">
                <div className="md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 line-clamp-1">{selectedCourse.title}</h2>
                    <button onClick={() => setIsStudentViewOpen(false)} className="md:hidden"><X /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedCourse.modules?.sort((a, b) => a.order - b.order).map((module, mIdx) => (
                      <div key={module._id || mIdx} className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">{module.title}</h3>
                        <div className="space-y-1">
                          {module.lectures?.map((lecture, lIdx) => (
                            <button 
                              key={lecture._id || lIdx}
                              onClick={() => setSelectedLecture(lecture)}
                              className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${selectedLecture?._id === lecture._id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-white text-slate-600'}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${lecture.status === 'live' ? 'bg-rose-500 animate-pulse' : lecture.status === 'upcoming' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{lecture.title}</p>
                                <p className={`text-[10px] font-bold uppercase ${selectedLecture?._id === lecture._id ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  {lecture.type} • {lecture.status}
                                </p>
                              </div>
                              {isLectureCompleted(selectedCourse._id, lecture._id) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setIsStudentViewOpen(false)} className="hidden md:block p-4 text-center text-sm font-bold text-slate-400 hover:text-slate-800 border-t border-slate-200">
                    Exit Learning View
                  </button>
                </div>
                <div className="flex-1 bg-white flex flex-col overflow-hidden">
                  {selectedLecture ? (
                    <div className="flex-1 flex flex-col">
                      <div className="aspect-video bg-black">
                        {selectedLecture.status === 'upcoming' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center">
                            <Clock className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-2xl font-bold mb-2">Lecture Starts Soon</h3>
                            <p className="text-slate-400">Scheduled at: {new Date(selectedLecture.scheduledAt!).toLocaleString()}</p>
                          </div>
                        ) : (
                          <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${getYoutubeId(selectedLecture.type === 'live' ? selectedLecture.youtubeLiveUrl! : selectedLecture.youtubeRecordedUrl!) || ''}?autoplay=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                      <div className="p-8 overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              {selectedLecture.status === 'live' && <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-pulse uppercase">🔴 Live</span>}
                              <h1 className="text-3xl font-bold text-slate-800">{selectedLecture.title}</h1>
                            </div>
                            <p className="text-slate-500">Duration: {selectedLecture.duration} minutes</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleProgress(selectedCourse._id, selectedLecture._id)}
                              className={`px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 ${
                                isLectureCompleted(selectedCourse._id, selectedLecture._id)
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                              }`}
                            >
                              {isLectureCompleted(selectedCourse._id, selectedLecture._id) ? (
                                <><CheckCircle2 className="w-4 h-4" /> Completed</>
                              ) : (
                                'Mark as Completed'
                              )}
                            </button>
                            <button className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors">
                              Download Notes
                            </button>
                          </div>
                        </div>
                        <div className="prose max-w-none text-slate-600">
                          <p>Welcome to this lecture! Here you will learn about the core concepts of the module. Make sure to take notes and complete the assignments linked below.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                      <PlayCircle className="w-20 h-20 mb-4 opacity-10" />
                      <h3 className="text-2xl font-bold mb-2">Select a lecture to start</h3>
                      <p className="max-w-xs">Pick a module from the sidebar and click on a lecture to begin your learning journey.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'students' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="students">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-800">Student Directory</h1>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(student => (
                        <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {student.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{student.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.from(new Set(student.progress.map(p => p.courseId))).map(courseId => {
                                const course = courses.find(c => c._id === courseId);
                                return course ? (
                                  <span key={courseId} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase">
                                    {course.title}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                                <div className="bg-emerald-500 h-full" style={{ width: `${getStudentOverallProgress(student)}%` }} />
                              </div>
                              <span className="text-xs font-bold text-slate-600">{getStudentOverallProgress(student)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'placements' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="placements">
                <LockedContentOverlay>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800">Placement Cell</h1>
                    <p className="text-slate-500 mt-1">Connect your students with top tech opportunities.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <input 
                        type="date" 
                        value={jobDateFilter}
                        onChange={(e) => setJobDateFilter(e.target.value)}
                        className="text-sm focus:outline-none bg-transparent"
                      />
                      {jobDateFilter && (
                        <button onClick={() => setJobDateFilter('')} className="text-slate-400 hover:text-slate-600">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {jobDateFilter && (
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                        {placements.filter(job => new Date(job.posted_at).toISOString().split('T')[0] === jobDateFilter).length} Jobs Found
                      </div>
                    )}
                    {currentUser?.role === 'admin' && (
                      <button 
                        onClick={() => {
                          setEditingJob(null);
                          setJobForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', apply_url: '', description: '' });
                          setIsJobModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 ml-auto md:ml-0"
                      >
                        <Plus className="w-4 h-4" /> Post New Job
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {placements
                    .filter(job => !jobDateFilter || new Date(job.posted_at).toISOString().split('T')[0] === jobDateFilter)
                    .map(job => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                            <p className="text-slate-500 text-sm">{job.company} • {job.location} • {job.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Active</span>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(job.posted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {job.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                            <CreditCard className="w-4 h-4" />
                            {job.salary}
                          </div>
                          {currentUser?.role === 'admin' && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  setEditingJob(job);
                                  setJobForm({
                                    title: job.title,
                                    company: job.company,
                                    location: job.location,
                                    type: job.type || 'Full-time',
                                    salary: job.salary,
                                    apply_url: job.apply_url || '',
                                    description: job.description || ''
                                  });
                                  setIsJobModalOpen(true);
                                }}
                                className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors"
                                title="Edit Job"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(job._id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-md transition-colors"
                                title="Delete Job"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => job.apply_url && window.open(job.apply_url, '_blank')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                </LockedContentOverlay>
                
                {/* Job Modal */}
                {isJobModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsJobModalOpen(false)} />
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                      <h2 className="text-2xl font-bold mb-6">{editingJob ? 'Edit Opportunity' : 'Post New Opportunity'}</h2>
                      <form onSubmit={handleCreateJob} className="space-y-4">
                        <Input label="Job Title" value={jobForm.title} onChange={(v: string) => setJobForm({...jobForm, title: v})} placeholder="e.g. Frontend Developer" />
                        <Input label="Company Name" value={jobForm.company} onChange={(v: string) => setJobForm({...jobForm, company: v})} placeholder="e.g. Google" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Location" value={jobForm.location} onChange={(v: string) => setJobForm({...jobForm, location: v})} placeholder="e.g. Remote / Bangalore" />
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Job Type</label>
                            <select 
                              value={jobForm.type}
                              onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Internship">Internship</option>
                              <option value="Contract">Contract</option>
                            </select>
                          </div>
                        </div>
                        <Input label="Salary Range" value={jobForm.salary} onChange={(v: string) => setJobForm({...jobForm, salary: v})} placeholder="e.g. ₹12L - ₹18L" />
                        <Input label="Apply Link" value={jobForm.apply_url} onChange={(v: string) => setJobForm({...jobForm, apply_url: v})} placeholder="e.g. https://careers.google.com/..." />
                        <TextArea label="Job Description" value={jobForm.description} onChange={(v: string) => setJobForm({...jobForm, description: v})} placeholder="Describe the role, requirements, and responsibilities..." />
                        <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsJobModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold">Cancel</button>
                          <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            {editingJob ? 'Update Job' : 'Post Job'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* Plan Modal */}
                {isPlanModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPlanModalOpen(false)} />
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                      <h2 className="text-2xl font-bold mb-6">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                      <form onSubmit={handleCreatePlan} className="space-y-4">
                        <Input label="Plan Name" value={planForm.name} onChange={(v: string) => setPlanForm({...planForm, name: v})} placeholder="e.g. Monthly Plan" />
                        <Input label="Plan ID" value={planForm.planId} onChange={(v: string) => setPlanForm({...planForm, planId: v})} placeholder="e.g. monthly" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Price (₹)" type="number" value={planForm.price} onChange={(v: string) => setPlanForm({...planForm, price: Number(v)})} placeholder="e.g. 100" />
                          <Input label="Duration" value={planForm.duration} onChange={(v: string) => setPlanForm({...planForm, duration: v})} placeholder="e.g. 1 Month" />
                        </div>
                        <TextArea label="Features (Comma separated)" value={planForm.features} onChange={(v: string) => setPlanForm({...planForm, features: v})} placeholder="Feature 1, Feature 2, Feature 3" />
                        <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsPlanModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold">Cancel</button>
                          <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            {editingPlan ? 'Update Plan' : 'Create Plan'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'jobs' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="jobs">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Job Portal</h1>
                    <p className="text-slate-500">Exclusive opportunities for our premium students.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <input 
                        type="date" 
                        value={jobDateFilter}
                        onChange={(e) => setJobDateFilter(e.target.value)}
                        className="text-sm focus:outline-none bg-transparent font-bold text-slate-700"
                      />
                      {jobDateFilter && (
                        <button onClick={() => setJobDateFilter('')} className="text-slate-400 hover:text-slate-600">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search jobs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                    >
                      <option value="All">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {placements
                    .filter(job => {
                      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           job.location.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesType = selectedType === 'All' || job.type === selectedType;
                      const matchesDate = !jobDateFilter || new Date(job.posted_at).toISOString().split('T')[0] === jobDateFilter;
                      return matchesSearch && matchesType && matchesDate;
                    })
                    .slice(0, (currentUser?.role === 'admin' || (currentUser?.subscriptionPlan && new Date() < new Date(currentUser.subscriptionEndDate!))) ? undefined : 3)
                    .map((job) => (
                      <div key={job._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl border border-slate-100">
                              {job.company.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                              <p className="text-slate-500 font-medium">{job.company}</p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <MapPin size={16} />
                              </div>
                              <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <Briefcase size={16} />
                              </div>
                              <span className="text-sm font-medium">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <DollarSign size={16} />
                              </div>
                              <span className="text-sm font-medium">{job.salary}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Posted {new Date(job.posted_at).toLocaleDateString()}
                            </span>
                            <a 
                              href={job.apply_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {!(currentUser?.role === 'admin' || (currentUser?.subscriptionPlan && new Date() < new Date(currentUser.subscriptionEndDate!))) && placements.filter(job => {
                  const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                       job.location.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesType = selectedType === 'All' || job.type === selectedType;
                  const matchesDate = !jobDateFilter || new Date(job.posted_at).toISOString().split('T')[0] === jobDateFilter;
                  return matchesSearch && matchesType && matchesDate;
                }).length > 3 && (
                  <div className="relative mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 blur-md grayscale opacity-40 pointer-events-none">
                      {placements
                        .filter(job => {
                          const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                               job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                               job.location.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesType = selectedType === 'All' || job.type === selectedType;
                          const matchesDate = !jobDateFilter || new Date(job.posted_at).toISOString().split('T')[0] === jobDateFilter;
                          return matchesSearch && matchesType && matchesDate;
                        })
                        .slice(3, 6)
                        .map((job) => (
                          <div key={job._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl border border-slate-100">
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-slate-900">{job.title}</h3>
                                <p className="text-slate-500 font-medium">{job.company}</p>
                              </div>
                            </div>
                            <div className="space-y-3 mb-8">
                              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-12 bg-white/10 backdrop-blur-[2px] rounded-[40px] border-2 border-dashed border-indigo-200">
                      <div className="bg-indigo-600 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-200">
                        <Lock size={40} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">Unlock Premium Opportunities</h3>
                      <p className="text-slate-600 max-w-md mb-8 font-medium">
                        You've reached the limit of free job listings. Subscribe to our premium plan to unlock all active job opportunities and start applying today!
                      </p>
                      <button 
                        onClick={() => setActiveTab('subscription')}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-3"
                      >
                        <Zap className="w-5 h-5 fill-current" />
                        Unlock All Jobs Now
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'manage-plans' && currentUser?.role === 'admin' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="manage-plans">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Subscription Plans</h1>
                    <p className="text-slate-500">Manage your subscription plans and pricing.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingPlan(null);
                      setPlanForm({ name: '', price: 0, duration: '', features: '', planId: '' });
                      setIsPlanModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} /> Add Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {subscriptionPlans.map(plan => (
                    <div key={plan._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                          <p className="text-indigo-600 font-bold">₹{plan.price} / {plan.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingPlan(plan);
                              setPlanForm({ 
                                name: plan.name, 
                                price: plan.price, 
                                duration: plan.duration, 
                                features: plan.features.join(', '), 
                                planId: plan.planId 
                              });
                              setIsPlanModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeletePlan(plan._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={feature || i} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* User Subscription Management Section */}
                <div className="mt-20">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">User Subscription Management</h2>
                    <p className="text-slate-500">Manage active plans and manually enable subscriptions for students.</p>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Expiry</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {subscribedUsers.map(user => (
                          <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase">
                                {user.subscriptionPlan || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date() ? (
                                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                  Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-rose-600 text-xs font-bold">
                                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                  Expired
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {user.subscriptionPlan && new Date(user.subscriptionEndDate) > new Date() ? (
                                <button 
                                  onClick={() => handleDisableSubscription(user._id)}
                                  className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-all"
                                >
                                  Disable Plan
                                </button>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <select 
                                    id={`plan-select-${user._id}`}
                                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    defaultValue="monthly"
                                  >
                                    <option value="monthly">Monthly</option>
                                    <option value="6months">6 Months</option>
                                    <option value="1year">1 Year</option>
                                  </select>
                                  <button 
                                    onClick={() => {
                                      const select = document.getElementById(`plan-select-${user._id}`) as HTMLSelectElement;
                                      handleEnableSubscription(user._id, select.value);
                                    }}
                                    className="text-emerald-600 hover:text-emerald-800 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all"
                                  >
                                    Enable
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {subscribedUsers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                              No active subscriptions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'subscription' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="subscription">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Plan</h1>
                  <p className="text-slate-500 max-w-2xl mx-auto">Unlock premium content including placement materials, notes, jobs, hackathons, and coding challenges.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {subscriptionPlans.map(plan => (
                    <div key={plan._id} className={`bg-white p-8 rounded-3xl border-2 ${currentUser?.subscriptionPlan === plan.planId ? 'border-indigo-600 shadow-xl' : 'border-slate-100 shadow-sm'} flex flex-col`}>
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                          <span className="text-slate-400 font-medium">/ {plan.duration}</span>
                        </div>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                          <li key={feature || i} className="flex items-center gap-3 text-slate-600 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handleSubscriptionPurchase(plan.planId)}
                        disabled={currentUser?.subscriptionPlan === plan.planId}
                        className={`w-full py-4 rounded-2xl font-bold transition-all ${currentUser?.subscriptionPlan === plan.planId ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
                      >
                        {currentUser?.subscriptionPlan === plan.planId ? 'Current Plan' : 'Subscribe Now'}
                      </button>
                    </div>
                  ))}
                </div>

                {currentUser?.subscriptionPlan && (
                  <div className="mt-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-2xl mx-auto text-center">
                    <p className="text-indigo-900 font-bold">Your subscription is active!</p>
                    <p className="text-indigo-600 text-sm mt-1">Expires on: {new Date(currentUser.subscriptionEndDate!).toLocaleDateString()}</p>
                  </div>
                )}
              </motion.div>
            )}

            {['notes', 'hackathons', 'coding', 'tests'].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key={activeTab}>
                <LockedContentOverlay>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lockedContents.filter(c => c.type === activeTab).map((content, cIdx) => (
                      <div key={content._id || cIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">{content.title}</h3>
                        <p className="text-slate-500 text-sm mb-6">{content.content}</p>
                        <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
                      </div>
                    ))}
                    {lockedContents.filter(c => c.type === activeTab).length === 0 && (
                      <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No {activeTab} available yet.</p>
                      </div>
                    )}
                  </div>
                </LockedContentOverlay>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="settings">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800">Site Settings</h1>
                    <p className="text-slate-500 font-medium">Update your website logo and name.</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Website Name</label>
                      <input 
                        type="text" 
                        value={siteSettings.siteName} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Logo URL</label>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={siteSettings.logoUrl} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          placeholder="https://..."
                        />
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2">
                          <Upload size={20} />
                          <span>Upload</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </label>
                      </div>
                    </div>
                    {siteSettings.logoUrl && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Logo Preview</p>
                        <img src={siteSettings.logoUrl} alt="Preview" className="h-16 w-auto object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <button 
                      onClick={handleSaveSettings}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={20} /> Save Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            {isCreateModalOpen && (
              <motion.div key="create-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden my-8"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-black text-slate-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                      <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <div className="flex gap-4 mb-8 border-b border-slate-200">
                      <button 
                        onClick={() => setActiveModalTab('basic')}
                        className={`pb-4 font-bold transition-colors ${activeModalTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Basic Info
                      </button>
                      <button 
                        onClick={() => setActiveModalTab('landing')}
                        className={`pb-4 font-bold transition-colors ${activeModalTab === 'landing' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Landing Page
                      </button>
                    </div>

                    <form onSubmit={handleCreateCourse} className="space-y-6">
                      {activeModalTab === 'basic' ? (
                        <div className="space-y-6">
                          <Input label="Course Title" value={courseForm.title} onChange={(v: string) => setCourseForm({...courseForm, title: v})} placeholder="e.g. Advanced React Patterns" />
                          <TextArea label="Short Description" value={courseForm.description} onChange={(v: string) => setCourseForm({...courseForm, description: v})} placeholder="Brief overview of the course..." />
                          <div className="grid grid-cols-2 gap-6">
                            <Input label="Price (₹)" type="number" value={courseForm.price} onChange={(v: string) => setCourseForm({...courseForm, price: v})} placeholder="e.g. 4999" />
                            <Input label="Number of Modules" type="number" value={courseForm.modules_count} onChange={(v: string) => setCourseForm({...courseForm, modules_count: v})} placeholder="e.g. 12" />
                          </div>
                          <Input label="Cover Image URL" value={courseForm.image_url} onChange={(v: string) => setCourseForm({...courseForm, image_url: v})} placeholder="https://images.unsplash.com/..." />
                          
                          <div className="flex items-center gap-6 pt-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={courseForm.isPublished}
                                onChange={(e) => setCourseForm({...courseForm, isPublished: e.target.checked})}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <span className="font-bold text-slate-700">Publish Course</span>
                            </label>
                            
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={courseForm.type === 'free'}
                                onChange={(e) => setCourseForm({...courseForm, type: e.target.checked ? 'free' : 'paid'})}
                                className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="font-bold text-slate-700">Free Course</span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <TextArea label="What will students learn? (One per line)" value={courseForm.landing_page.benefits} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, benefits: v}})} placeholder="Build real-world projects\nMaster advanced concepts" />
                          <TextArea label="Requirements (One per line)" value={courseForm.landing_page.requirements} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, requirements: v}})} placeholder="Basic JavaScript knowledge\nNode.js installed" />
                          <TextArea label="Target Audience (One per line)" value={courseForm.landing_page.target_audience} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, target_audience: v}})} placeholder="Beginner developers\nStudents looking for jobs" />
                          <TextArea label="Curriculum Overview" value={courseForm.landing_page.curriculum_overview} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, curriculum_overview: v}})} placeholder="A brief overview of the curriculum..." />
                          
                          <div className="pt-6 border-t border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Instructor Details</h3>
                            <div className="space-y-4">
                              <Input label="Instructor Name" value={courseForm.landing_page.instructor_name} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, instructor_name: v}})} placeholder="e.g. Dr. Shahid Pathan" />
                              <Input label="Instructor Image URL" value={courseForm.landing_page.instructor_image} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, instructor_image: v}})} placeholder="https://..." />
                              <TextArea label="Instructor Bio" value={courseForm.landing_page.instructor_bio} onChange={(v: string) => setCourseForm({...courseForm, landing_page: {...courseForm.landing_page, instructor_bio: v}})} placeholder="Brief bio about the instructor..." />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-8 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => setIsCreateModalOpen(false)}
                          className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                        >
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {isModuleModalOpen && selectedCourse && (
              <motion.div key="module-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden my-8"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900">Manage Modules</h2>
                        <p className="text-slate-500 mt-1">{selectedCourse.title}</p>
                      </div>
                      <button onClick={() => setIsModuleModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleAddModule} className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">{editingModule ? 'Edit Module' : 'Add New Module'}</h3>
                      <div className="space-y-4">
                        <Input label="Module Title" value={moduleForm.title} onChange={(v: string) => setModuleForm({...moduleForm, title: v})} placeholder="e.g. Introduction to React" />
                        <TextArea label="Description" value={moduleForm.description} onChange={(v: string) => setModuleForm({...moduleForm, description: v})} placeholder="What will be covered in this module?" />
                        <Input label="Order" type="number" value={moduleForm.order} onChange={(v: string) => setModuleForm({...moduleForm, order: v})} placeholder="e.g. 1" />
                        
                        <div className="flex gap-4 pt-2">
                          {editingModule && (
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingModule(null);
                                setModuleForm({ title: '', description: '', order: 0, visibility: 'published' });
                              }}
                              className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                              Cancel Edit
                            </button>
                          )}
                          <button 
                            type="submit"
                            className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                          >
                            {editingModule ? 'Update Module' : 'Add Module'}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Existing Modules</h3>
                      <div className="space-y-3">
                        {selectedCourse.modules?.sort((a, b) => a.order - b.order).map((module, mIdx) => (
                          <div key={module._id || mIdx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors group">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">Module {module.order}</span>
                                <h4 className="font-bold text-slate-800">{module.title}</h4>
                              </div>
                              <p className="text-sm text-slate-500 line-clamp-1">{module.description}</p>
                              <p className="text-xs text-indigo-600 font-semibold mt-2">{module.lectures?.length || 0} Lectures</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setSelectedModule(module);
                                  setIsLectureModalOpen(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                              >
                                Manage Lectures <ChevronRight size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingModule(module);
                                  setModuleForm({
                                    title: module.title,
                                    description: module.description,
                                    order: module.order,
                                    visibility: module.visibility
                                  });
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteModule(module._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!selectedCourse.modules || selectedCourse.modules.length === 0) && (
                          <div className="text-center py-12 text-slate-400">
                            <Layers size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No modules added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {isLectureModalOpen && selectedCourse && selectedModule && (
              <motion.div key="lecture-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden my-8"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <button 
                          onClick={() => setIsLectureModalOpen(false)}
                          className="text-indigo-600 text-sm font-bold hover:underline mb-2 flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Modules
                        </button>
                        <h2 className="text-3xl font-black text-slate-900">Manage Lectures</h2>
                        <p className="text-slate-500 mt-1">{selectedModule.title}</p>
                      </div>
                      <button onClick={() => setIsLectureModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleAddLecture} className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">{editingLecture ? 'Edit Lecture' : 'Add New Lecture'}</h3>
                      <div className="space-y-4">
                        <Input label="Lecture Title" value={lectureForm.title} onChange={(v: string) => setLectureForm({...lectureForm, title: v})} placeholder="e.g. Component Lifecycle" />
                        <TextArea label="Description" value={lectureForm.description} onChange={(v: string) => setLectureForm({...lectureForm, description: v})} placeholder="What will be covered in this lecture?" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Order" type="number" value={lectureForm.order} onChange={(v: string) => setLectureForm({...lectureForm, order: v})} placeholder="e.g. 1" />
                          <Input label="Duration (minutes)" type="number" value={lectureForm.duration} onChange={(v: string) => setLectureForm({...lectureForm, duration: v})} placeholder="e.g. 45" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Lecture Type</label>
                            <select 
                              value={lectureForm.type}
                              onChange={(e) => setLectureForm({...lectureForm, type: e.target.value as 'recorded' | 'live'})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                            >
                              <option value="recorded">Recorded Video</option>
                              <option value="live">Live Session</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                            <select 
                              value={lectureForm.status}
                              onChange={(e) => setLectureForm({...lectureForm, status: e.target.value as 'published' | 'draft' | 'upcoming' | 'live'})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="upcoming">Upcoming</option>
                              <option value="live">Currently Live</option>
                            </select>
                          </div>
                        </div>

                        {lectureForm.type === 'recorded' ? (
                          <Input label="YouTube Recorded URL" value={lectureForm.youtubeRecordedUrl} onChange={(v: string) => setLectureForm({...lectureForm, youtubeRecordedUrl: v})} placeholder="https://youtube.com/watch?v=..." />
                        ) : (
                          <div className="space-y-4">
                            <Input label="YouTube Live URL" value={lectureForm.youtubeLiveUrl} onChange={(v: string) => setLectureForm({...lectureForm, youtubeLiveUrl: v})} placeholder="https://youtube.com/watch?v=..." />
                            <Input label="Scheduled At (ISO String)" value={lectureForm.scheduledAt} onChange={(v: string) => setLectureForm({...lectureForm, scheduledAt: v})} placeholder="2024-05-20T10:00:00Z" />
                          </div>
                        )}
                        
                        <div className="flex gap-4 pt-2">
                          {editingLecture && (
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingLecture(null);
                                setLectureForm({ title: '', description: '', order: 0, duration: 60, type: 'recorded', status: 'draft', youtubeRecordedUrl: '', youtubeLiveUrl: '', scheduledAt: '' });
                              }}
                              className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                              Cancel Edit
                            </button>
                          )}
                          <button 
                            type="submit"
                            className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                          >
                            {editingLecture ? 'Update Lecture' : 'Add Lecture'}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Existing Lectures</h3>
                      <div className="space-y-3">
                        {selectedModule.lectures?.sort((a, b) => a.order - b.order).map((lecture, lIdx) => (
                          <div key={lecture._id || lIdx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lecture.type === 'live' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                <Video size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">Lecture {lecture.order}</span>
                                  <h4 className="font-bold text-slate-800">{lecture.title}</h4>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold">
                                  <span className={`uppercase ${lecture.type === 'live' ? 'text-rose-500' : 'text-indigo-600'}`}>{lecture.type}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500">{lecture.duration} mins</span>
                                  <span className="text-slate-300">•</span>
                                  <span className={`uppercase ${lecture.status === 'published' ? 'text-emerald-500' : lecture.status === 'live' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>{lecture.status}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingLecture(lecture);
                                  setLectureForm({
                                    title: lecture.title,
                                    description: lecture.description,
                                    order: lecture.order,
                                    duration: lecture.duration,
                                    type: lecture.type,
                                    status: lecture.status,
                                    youtubeRecordedUrl: lecture.youtubeRecordedUrl || '',
                                    youtubeLiveUrl: lecture.youtubeLiveUrl || '',
                                    scheduledAt: lecture.scheduledAt || ''
                                  });
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteLecture(lecture._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!selectedModule.lectures || selectedModule.lectures.length === 0) && (
                          <div className="text-center py-12 text-slate-400">
                            <Video size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No lectures added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

        </div>
      </main>
    </div>
  );
}

// Helper Components
function VideoPlayer({ lecture, onClose }: { lecture: Lecture, onClose: () => void }) {
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = lecture.type === 'live' 
    ? getYoutubeId(lecture.youtubeLiveUrl || '') 
    : getYoutubeId(lecture.youtubeRecordedUrl || '');

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center bg-slate-900 text-white">
        <div>
          <h3 className="font-bold">{lecture.title}</h3>
          <p className="text-xs text-slate-400 uppercase font-bold">{lecture.type} • {lecture.status}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full"><X /></button>
      </div>
      <div className="flex-1 bg-black flex items-center justify-center">
        {videoId ? (
          <iframe 
            className="w-full aspect-video max-w-5xl shadow-2xl"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-white text-center">
            <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">Video not available</p>
            <p className="text-slate-500">Please contact support if this is an error.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-indigo-50 text-indigo-600 font-bold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <span className={`${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
      {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
    </button>
  );
}

function StatCard({ label, value, icon, trend, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trend}</span>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{label}</h4>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
      <div className="text-white">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <textarea 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
      />
    </div>
  );
}

function LandingPage({ courses, placements, stats, onLogin, onRegister, onEnroll, onViewLanding, config, headerMenu, footerMenu, setCurrentPage, siteSettings }: any) {
  const [view, setView] = useState('home');
  const [dynamicPage, setDynamicPage] = useState<PageConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredJobs = (placements || []).filter((job: any) => {
    if (!job) return false;
    const matchesSearch = (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (job.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    let matchesDate = !dateFilter;
    if (dateFilter && job.posted_at) {
      try {
        matchesDate = new Date(job.posted_at).toISOString().split('T')[0] === dateFilter;
      } catch (e) {
        matchesDate = false;
      }
    }
    return matchesSearch && matchesType && matchesDate;
  });

  const Nav = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <img 
              src={siteSettings?.logoUrl || "https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png"} 
              alt={siteSettings?.siteName || "Shiddat Programming Institute"} 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {(headerMenu?.links || []).map((link: any, index: number) => (
              <button 
                key={link._id || link.url || index}
                onClick={() => {
                  if (link.url.startsWith('/')) {
                    const slug = link.url.slice(1);
                    if (slug === '') setView('home');
                    else if (slug === 'courses') setView('courses');
                    else if (slug === 'jobs') setView('jobs');
                    else {
                      fetch(API_URL + `/api/pages/${slug}`)
                        .then(res => res.ok ? res.json() : null)
                        .then(data => {
                          if (data) {
                            setDynamicPage(data);
                            setView('dynamic');
                          }
                        })
                        .catch(err => console.error('Failed to fetch dynamic page', err));
                    }
                  } else {
                    window.open(link.url, '_blank');
                  }
                }}
                className={`text-sm font-bold transition-colors ${view === link.url.slice(1) ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onRegister}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
          >
            Join Free Trial
          </button>
        </div>
      </div>
    </nav>
  );

  const renderSections = (sections: any[]) => {
    const sectionComponents: any = {
      hero: Hero,
      trust: (props: any) => <TrustSection {...props} stats={stats} />,
      specialization: Specialization,
      placements: PlacementShowcase,
      gallery: Gallery,
      batches: UpcomingBatches,
      'online-offline': OnlineOffline,
      testimonials: Testimonials,
      subscription: Subscription
    };

    return sections
      .filter((s: any) => s.isVisible)
      .sort((a: any, b: any) => a.order - b.order)
      .map((section: any) => {
        const Component = sectionComponents[section.type];
        if (!Component) return null;
        return <Component key={section.id || section._id || Math.random()} content={section.content} onRegister={onRegister} setView={setView} />;
      });
  };

  const Footer = () => (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png" 
              alt="Shiddat Programming Institute" 
              className="h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            Karad Madhil IT Specialization Che Ekmev Center. IT Software Training & AI Center.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-black text-slate-900 mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {(footerMenu?.links || []).map((link: any, index: number) => (
              <li key={index}>
                <button 
                  onClick={() => {
                    if (link.url.startsWith('/')) {
                      const slug = link.url.slice(1);
                      if (slug === '') setView('home');
                      else if (slug === 'courses') setView('courses');
                      else if (slug === 'jobs') setView('jobs');
                      else {
                        fetch(API_URL + `/api/pages/${slug}`)
                          .then(res => res.ok ? res.json() : null)
                          .then(data => {
                            if (data) {
                              setDynamicPage(data);
                              setView('dynamic');
                            }
                          })
                          .catch(err => console.error('Failed to fetch dynamic page', err));
                      }
                    } else {
                      window.open(link.url, '_blank');
                    }
                  }}
                  className="text-slate-500 font-bold hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black text-slate-900 mb-6">Support</h4>
          <ul className="space-y-4">
            {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
              <li key={l}><a href="#" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black text-slate-900 mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-500 font-bold">
              <MapPin size={20} className="text-indigo-600" /> Karad, Satara, Maharashtra
            </li>
            <li className="flex items-center gap-3 text-slate-500 font-bold">
              <Phone size={20} className="text-indigo-600" /> +91 91720 91720
            </li>
            <li className="flex items-center gap-3 text-slate-500 font-bold">
              <Mail size={20} className="text-indigo-600" /> contact@shiddat.institute
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-sm font-bold tracking-wide uppercase">© 2026 Shiddat Programming Institute. All rights reserved.</p>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      <Nav />
      
      {view === 'home' ? (
        <main>
          {(!config || !config.sections || config.sections.length === 0) ? (
            <>
              <Hero onRegister={onRegister} setView={setView} />
              <TrustSection />
              <Specialization />
              <PlacementShowcase />
              <UpcomingBatches onRegister={onRegister} />
              <OnlineOffline />
              <Gallery />
              <Testimonials />
              <Subscription onRegister={onRegister} />
            </>
          ) : (
            renderSections(config.sections)
          )}
        </main>
      ) : view === 'dynamic' && dynamicPage ? (
        <main className="pt-24">
          {renderSections(dynamicPage.sections)}
        </main>
      ) : view === 'jobs' ? (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Job Opportunities</h1>
              <p className="text-slate-500">Find your dream career with our placement partners.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-sm focus:outline-none bg-transparent font-bold text-slate-700"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.slice(0, 3).map((job: any) => (
              <div key={job._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl border border-slate-100">
                    {(job.company || 'C').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title || 'Untitled Job'}</h3>
                    <p className="text-slate-500 font-medium">{job.company || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><MapPin size={16} /> {job.location}</div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><Briefcase size={16} /> {job.type}</div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm"><DollarSign size={16} /> {job.salary}</div>
                </div>
                <button onClick={onLogin} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all">Apply Now</button>
              </div>
            ))}
            {filteredJobs.length > 3 && (
              <div className="col-span-full relative mt-12 p-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-indigo-200 text-center">
                <div className="bg-indigo-600 w-16 h-16 rounded-3xl text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                  <Lock size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Unlock All {filteredJobs.length} Opportunities</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-8 font-medium">Subscribe to our premium plan to unlock all active job opportunities.</p>
                <button onClick={onLogin} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 mx-auto">
                  <Zap className="w-5 h-5 fill-current" /> Unlock Now
                </button>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Explore Our Courses</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Choose from industry-leading courses designed for your success.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <div 
                key={course._id} 
                onClick={() => onViewLanding(course)}
                className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="relative aspect-video">
                  <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 ${course.type === 'free' ? 'bg-emerald-500' : 'bg-indigo-600'} text-white text-[10px] font-black uppercase tracking-widest rounded-full`}>
                      {course.type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-xl text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8">{course.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-indigo-600 text-sm font-bold flex items-center gap-1">View Details <ChevronRight size={16} /></span>
                    <span className="font-black text-slate-900">{course.type === 'free' ? 'FREE' : `₹${course.price}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      <Footer />

      {/* Sticky Elements */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
        <a href="https://wa.me/919172091720" target="_blank" className="bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center">
          <MessageCircle size={24} />
        </a>
        <a href="tel:+919172091720" className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center">
          <Phone size={24} />
        </a>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white py-3 px-6 flex justify-between items-center sm:hidden">
        <p className="text-xs font-bold">Free trial ends in 3 days!</p>
        <button onClick={onRegister} className="bg-rose-600 px-4 py-1.5 rounded-lg text-xs font-black">Enroll Now</button>
      </div>
    </div>
  );
}

function AuthForm({ type, onSubmit, onSwitch, onClose }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, email, password });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/test-api-studio-image-bucket/c59d4807-68b6-4903-b09b-4659b9107936.png" 
                alt="Shiddat Logo" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-lg font-black tracking-tight text-slate-900">Shiddat<span className="text-indigo-600">LMS</span></span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {type === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-slate-500 mb-8">
            {type === 'login' ? 'Sign in to continue your learning journey.' : 'Create an account to start learning today.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'register' && (
              <Input 
                label="Full Name" 
                placeholder="Enter your full name" 
                value={name} 
                onChange={setName} 
              />
            )}
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={setEmail} 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={setPassword} 
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={onSwitch}
                className="ml-2 text-indigo-600 font-bold hover:underline"
              >
                {type === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
