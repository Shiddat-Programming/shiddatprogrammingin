import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { Job } from '../../types';

interface PlacementPortalProps {
  jobs: Job[];
}

export function PlacementPortal({ jobs }: PlacementPortalProps) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Career Opportunities</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Placement Portal</h1>
          <p className="text-slate-500 font-medium">Exclusive job opportunities for our certified students.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job, i) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl border border-slate-100">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{job.company}</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {job.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={16} className="text-slate-300" />
                  <span className="text-xs font-bold">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <DollarSign size={16} className="text-slate-300" />
                  <span className="text-xs font-bold">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={16} className="text-slate-300" />
                  <span className="text-xs font-bold">Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase size={16} className="text-slate-300" />
                  <span className="text-xs font-bold">Full Time</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a 
                  href={job.apply_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-center flex items-center justify-center gap-2"
                >
                  Apply Now <ExternalLink size={14} />
                </a>
                <button className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">
                  Details
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[48px] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Briefcase size={40} />
            </div>
            <p className="text-slate-500 font-bold">No job openings available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
