import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Search, Mail, Phone, 
  Calendar, CreditCard, MoreVertical, 
  CheckCircle2, XCircle, ShieldCheck, 
  GraduationCap, Trash2 
} from 'lucide-react';
import { User } from '../../types';

interface StudentManagementProps {
  students: User[];
  onEnableSubscription: (id: string) => void;
  onDisableSubscription: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StudentManagement({ 
  students, 
  onEnableSubscription, 
  onDisableSubscription, 
  onDelete 
}: StudentManagementProps) {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Student Management</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Administration</h1>
          <p className="text-slate-500 font-medium">Manage student accounts, subscriptions and learning access.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
            {students.length} Total Students
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Users size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
        <div className="relative max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Student</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Subscription</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Enrolled</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <motion.tr 
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-6 rounded-l-[32px] border-y border-l border-slate-100">
                    <div className="flex items-center gap-4">
                      <img src={student.profile_photo || `https://i.pravatar.cc/150?u=${student._id}`} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="Student" />
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{student.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 border-y border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Mail size={14} className="text-indigo-500" /> {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Phone size={14} className="text-emerald-500" /> {student.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 border-y border-slate-100">
                    {student.subscriptionPlan ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                        <CheckCircle2 size={14} /> {student.subscriptionPlan}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                        <XCircle size={14} /> Inactive
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 border-y border-slate-100">
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                      <GraduationCap size={14} /> {student.enrolled_courses?.length || 0} Courses
                    </div>
                  </td>
                  <td className="px-6 py-6 rounded-r-[32px] border-y border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      {student.subscriptionPlan ? (
                        <button 
                          onClick={() => onDisableSubscription(student._id)}
                          className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Disable Subscription"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => onEnableSubscription(student._id)}
                          className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          title="Enable Subscription"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(student._id)}
                        className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
