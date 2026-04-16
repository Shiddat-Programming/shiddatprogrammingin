import React from 'react';
import { Calendar } from 'lucide-react';

export const UpcomingBatches = ({ content }: any) => (
  <section className="py-32 bg-indigo-600 rounded-[64px] mx-6 my-20 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    <div className="max-w-7xl mx-auto px-12 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-black leading-tight tracking-tight">
            New Batches Starting <br />
            <span className="text-indigo-200">Every Monday!</span>
          </h2>
          <p className="text-xl text-indigo-100 font-medium leading-relaxed">
            Don't wait for the right time. The right time is now. Join our upcoming cohorts and start your IT journey.
          </p>
          <div className="space-y-4">
            {['Morning Batch: 8:00 AM - 10:00 AM', 'Evening Batch: 6:00 PM - 8:00 PM', 'Weekend Special: Sat-Sun'].map(batch => (
              <div key={batch} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <span className="font-bold">{batch}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[48px] text-slate-900 shadow-2xl">
          <h3 className="text-2xl font-black mb-8">Reserve Your Seat</h3>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
              <input type="tel" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Enter your phone number" />
            </div>
            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              Get Free Counseling
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);
