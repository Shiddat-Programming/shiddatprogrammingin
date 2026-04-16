import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Subscription = ({ content }: any) => (
  <section className="py-32 bg-slate-900 text-white rounded-[64px] mx-6 my-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.1),transparent_50%)]"></div>
    <div className="max-w-7xl mx-auto px-12 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
        <h2 className="text-6xl font-black tracking-tight leading-none">
          Ready to Start Your <br />
          <span className="text-indigo-400">IT Journey?</span>
        </h2>
        <p className="text-xl text-slate-400 font-medium">Choose the plan that fits your career goals.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl p-12 rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group">
          <h3 className="text-2xl font-black mb-2">Free Trial</h3>
          <p className="text-slate-400 mb-8 font-medium">Get a taste of our teaching style.</p>
          <div className="text-5xl font-black mb-8">₹0 <span className="text-lg text-slate-500 font-bold">/ 7 Days</span></div>
          <ul className="space-y-4 mb-10">
            {['Access to Basic Modules', 'Live Demo Class', 'Career Roadmap', 'Doubt Support'].map(f => (
              <li key={f} className="flex items-center gap-3 text-slate-300 font-bold">
                <CheckCircle2 size={20} className="text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-indigo-500 hover:text-white transition-all">Start Free Trial</button>
        </div>
        <div className="bg-indigo-600 p-12 rounded-[48px] shadow-2xl shadow-indigo-500/20 relative">
          <div className="absolute -top-4 right-8 bg-rose-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
          <h3 className="text-2xl font-black mb-2">Premium Specialization</h3>
          <p className="text-indigo-100 mb-8 font-medium">Complete career transformation program.</p>
          <div className="text-5xl font-black mb-8">₹14,999 <span className="text-lg text-indigo-200 font-bold">/ Course</span></div>
          <ul className="space-y-4 mb-10">
            {['Full Curriculum Access', '1-on-1 Mentorship', 'Placement Assistance', 'Industry Projects', 'Certificate'].map(f => (
              <li key={f} className="flex items-center gap-3 text-white font-bold">
                <CheckCircle2 size={20} className="text-indigo-200" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all">Enroll Now</button>
        </div>
      </div>
    </div>
  </section>
);
