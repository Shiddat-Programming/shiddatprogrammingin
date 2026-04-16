import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
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
    <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
    <p className="text-slate-500 font-bold mb-6">{job.company}</p>
    
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <MapPin size={16} className="text-indigo-500" /> {job.location}
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <DollarSign size={16} className="text-emerald-500" /> {job.salary}
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <Clock size={16} className="text-amber-500" /> {new Date(job.posted_at).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <Briefcase size={16} className="text-rose-500" /> {job.type}
      </div>
    </div>
    
    <a 
      href={job.apply_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
    >
      Apply Now <ExternalLink size={14} />
    </a>
  </motion.div>
);
