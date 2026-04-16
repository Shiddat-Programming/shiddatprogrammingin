import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, PlayCircle, ChevronRight, Clock, Star } from 'lucide-react';
import { Course } from '../../types';

interface MyLearningProps {
  courses: Course[];
  currentUser: any;
  onContinue: (course: Course) => void;
}

export function MyLearning({ courses, currentUser, onContinue }: MyLearningProps) {
  const getProgress = (courseId: string) => {
    const progress = currentUser.progress?.find((p: any) => p.courseId === courseId);
    if (!progress) return 0;
    
    const course = courses.find(c => c._id === courseId);
    if (!course) return 0;
    
    const totalLectures = course.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;
    if (totalLectures === 0) return 0;
    
    return Math.round((progress.completedLectures?.length || 0) / totalLectures * 100);
  };

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">My Learning</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Continue Your Journey</h1>
        <p className="text-slate-500 font-medium">Pick up right where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => {
          const progress = getProgress(course._id);
          return (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => onContinue(course)}
                    className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500"
                  >
                    <PlayCircle size={32} fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-indigo-600">
                    <BookOpen size={14} />
                    <span className="text-xs font-black uppercase tracking-widest">{course.modules_count} Modules</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{course.modules?.reduce((acc, m) => acc + (m.lectures?.reduce((lAcc, l) => lAcc + (l.duration || 0), 0) || 0), 0) || 0}m Total</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2">{course.title}</h3>
                
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Course Progress</span>
                    <span className="text-sm font-black text-indigo-600">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <button 
                    onClick={() => onContinue(course)}
                    className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Continue Learning <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
