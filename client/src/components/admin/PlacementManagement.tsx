import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, Edit, Trash2, 
  Briefcase, MapPin, DollarSign, 
  ExternalLink, ChevronRight, MoreVertical 
} from 'lucide-react';
import { Job } from '../../types';

interface PlacementManagementProps {
  placements: Job[];
  onCreate: () => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function PlacementManagement({ 
  placements, 
  onCreate, 
  onEdit, 
  onDelete 
}: PlacementManagementProps) {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Placement Management</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Career Opportunities</h1>
          <p className="text-slate-500 font-medium">Manage job listings and placement opportunities for your students.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add New Job
        </button>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
        <div className="relative max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search jobs by title or company..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placements.map((job, i) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {job.company[0]}
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {job.type}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
              <p className="text-slate-500 font-bold mb-6">{job.company}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <MapPin size={16} className="text-indigo-500" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <DollarSign size={16} className="text-emerald-500" /> {job.salary}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => onEdit(job)}
                  className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Edit Details <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => onDelete(job._id)}
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
