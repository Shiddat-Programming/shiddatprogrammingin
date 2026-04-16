import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BookOpen, Trophy, Clock, 
  ChevronRight, ArrowUpRight, Target, 
  Sparkles, GraduationCap 
} from 'lucide-react';

export function Dashboard({ currentUser, stats }: { currentUser: any, stats: any }) {
  return (
    <div className="p-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Overview</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{currentUser?.name}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your learning journey today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
            {currentUser?.role} Account
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Target size={20} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Courses Enrolled', value: currentUser?.enrolled_courses?.length || 0, icon: BookOpen, color: 'indigo', trend: stats?.enrolledTrend || '+0 this month' },
          { label: 'Total Progress', value: stats?.progress || '0%', icon: Target, color: 'emerald', trend: stats?.progressTrend || '+0% overall' },
          { label: 'Certificates Earned', value: stats?.certificates || '0', icon: Trophy, color: 'amber', trend: stats?.nextCertificate || 'Next in 0 days' },
          { label: 'Learning Hours', value: stats?.hours || '0h', icon: Clock, color: 'rose', trend: stats?.hoursTrend || '+0h this week' }
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
              <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                <ArrowUpRight size={14} /> {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Sparkles className="text-indigo-600" /> Recent Activity
              </h2>
              <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={activity.image || `https://picsum.photos/seed/course-${i}/200/200`} className="w-full h-full object-cover" alt="Activity" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{activity.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{activity.time}</p>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${activity.progress || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No recent activity found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Upcoming Live Session */}
          {stats?.liveSession ? (
            <div className="bg-indigo-600 p-8 rounded-[48px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> Live Now
                </div>
                <h3 className="text-2xl font-black leading-tight">{stats.liveSession.title}</h3>
                <div className="flex items-center gap-3 text-indigo-100 font-bold text-sm">
                  <Users size={18} /> {stats.liveSession.viewers} Students Watching
                </div>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all shadow-lg">
                  Join Session
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
              <div className="relative z-10 space-y-4 text-center py-6">
                <Clock className="mx-auto text-indigo-400" size={32} />
                <h3 className="text-xl font-black leading-tight">No Live Sessions</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Check back later</p>
              </div>
            </div>
          )}

          {/* Achievement Progress */}
          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="text-amber-500" /> Next Milestone
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <GraduationCap size={32} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">{stats?.nextMilestone?.title || 'Certified Architect'}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stats?.nextMilestone?.progress || 0}% Completed</p>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats?.nextMilestone?.progress || 0}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {stats?.nextMilestone?.description || 'Keep learning to reach your next milestone!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
