import React from 'react';
import { motion } from 'motion/react';
import { Star, Users, Clock, ChevronRight } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onViewLanding: (course: Course) => void;
}

export const CourseCard = ({ course, onViewLanding }: CourseCardProps) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col"
  >
    <div className="aspect-video relative overflow-hidden">
      <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
      <div className="absolute top-4 left-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
          course.type === 'free' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
        }`}>
          {course.type}
        </span>
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-black text-slate-900">4.9</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Users size={14} />
          <span className="text-xs font-bold">1.2k</span>
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{course.title}</h3>
      <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{course.description}</p>
      
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900">
            {course.type === 'free' ? 'FREE' : `₹${course.price}`}
          </span>
          {course.type === 'paid' && <span className="text-xs text-slate-400 line-through font-bold">₹{course.price * 2}</span>}
        </div>
        <button 
          onClick={() => onViewLanding(course)}
          className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  </motion.div>
);
