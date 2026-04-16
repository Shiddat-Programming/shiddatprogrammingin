import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, Star, Users, Clock, Sparkles, 
  BookOpen, PlayCircle, FileText, Trophy, 
  Smartphone, ShieldCheck, Target 
} from 'lucide-react';
import { Course } from '../../types';

export function CourseLandingPage({ 
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
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {course.landing_page?.curriculum_overview || 'This comprehensive course covers everything from fundamentals to advanced topics. You will work on hands-on projects, participate in live sessions, and gain practical skills required in the industry.'}
              </p>
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

// Helper component used in CourseLandingPage
function CheckCircle2({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
