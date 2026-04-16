import React from 'react';
import { Globe, MapPin } from 'lucide-react';

export const OnlineOffline = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
            className="rounded-[48px] shadow-2xl"
            alt="Classroom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-8 -right-8 bg-rose-600 text-white p-8 rounded-[32px] shadow-2xl rotate-6">
            <p className="text-4xl font-black mb-1">100%</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Practical Learning</p>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            Learn Anywhere, <br />
            <span className="text-indigo-600">Anytime.</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Globe size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900">Online Classes</h4>
              <p className="text-slate-500 font-medium">Live interactive sessions with recorded backups for flexible learning.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <MapPin size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900">Offline Center</h4>
              <p className="text-slate-500 font-medium">State-of-the-art lab facilities at our Karad center for hands-on practice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
