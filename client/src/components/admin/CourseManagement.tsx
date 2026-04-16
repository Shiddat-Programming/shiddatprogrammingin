import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, Edit, Trash2, 
  Eye, EyeOff, BookOpen, Layers, 
  ChevronRight, MoreVertical 
} from 'lucide-react';
import { Course } from '../../types';

interface CourseManagementProps {
  courses: Course[];
  onCreate: () => void;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onManageModules: (course: Course) => void;
}

export function CourseManagement({ 
  courses, 
  onCreate, 
  onEdit, 
  onDelete, 
  onManageModules 
}: CourseManagementProps) {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Course Management</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum Control</h1>
          <p className="text-slate-500 font-medium">Create, edit and manage your educational content.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Create New Course
        </button>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
        <div className="relative max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search courses by title..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Course" />
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    course.isPublished ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <Layers size={14} /> {course.modules_count} Modules
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  ₹{course.price}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => onManageModules(course)}
                  className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Manage Content <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => onEdit(course)}
                  className="p-4 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete(course._id)}
                  className="p-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
