import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BookOpen, CreditCard, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, Globe, ShieldCheck
} from 'lucide-react';

export function AdminDashboard({ stats }: { stats: any }) {
  return (
    <div className="p-8 space-y-10">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Admin Control</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Monitor your platform's performance and growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats?.totalStudents || '0', icon: Users, color: 'indigo', trend: stats?.studentsTrend || '+0%', up: !stats?.studentsTrend?.startsWith('-') },
          { label: 'Active Courses', value: stats?.activeCourses || '0', icon: BookOpen, color: 'emerald', trend: stats?.coursesTrend || '+0%', up: !stats?.coursesTrend?.startsWith('-') },
          { label: 'Monthly Revenue', value: stats?.revenue || '₹0', icon: CreditCard, color: 'rose', trend: stats?.revenueTrend || '+0%', up: !stats?.revenueTrend?.startsWith('-') },
          { label: 'Platform Usage', value: stats?.usage || '0%', icon: Activity, color: 'amber', trend: stats?.usageTrend || '+0%', up: !stats?.usageTrend?.startsWith('-') }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
                <stat.icon size={28} />
              </div>
              <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-widest ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-indigo-600" /> Revenue Growth
            </h2>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-4">
            {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-indigo-50 group-hover:bg-indigo-600 rounded-2xl transition-all duration-500 relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{h}k
                  </div>
                </motion.div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <ShieldCheck className="text-indigo-400" /> System Health
          </h2>
          <div className="space-y-6">
            {[
              { label: 'Server Status', status: 'Operational', color: 'emerald' },
              { label: 'Database', status: 'Connected', color: 'emerald' },
              { label: 'API Latency', status: '42ms', color: 'indigo' },
              { label: 'Error Rate', status: '0.02%', color: 'emerald' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-sm font-bold text-slate-400">{item.label}</span>
                <span className={`text-xs font-black uppercase tracking-widest text-${item.color}-400`}>{item.status}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50">
            Run Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
