import React from 'react';
import { Quote } from 'lucide-react';

export const Testimonials = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Success Stories</h2>
        <p className="text-slate-500 font-medium">Hear from our students who transformed their careers.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: 'Amit Sharma', role: 'Full Stack Developer at Infosys', text: 'The MERN stack course was comprehensive and practical. The projects helped me build a strong portfolio.' },
          { name: 'Priya Patil', role: 'Data Scientist at Accenture', text: 'The Python and AI course gave me the skills I needed to transition into data science. Highly recommended!' },
          { name: 'Sameer Khan', role: 'Software Engineer at Wipro', text: 'Excellent teaching and great support. The placement assistance was crucial in landing my first job.' }
        ].map((testimonial, i) => (
          <div key={i} className="bg-slate-50 p-10 rounded-[40px] relative group hover:bg-indigo-600 transition-all duration-500">
            <Quote className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-400 transition-colors" size={48} />
            <div className="flex items-center gap-4 mb-8">
              <img src={`https://i.pravatar.cc/100?img=${i+15}`} className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg" alt="Student" referrerPolicy="no-referrer" />
              <div>
                <h4 className="font-black text-slate-900 group-hover:text-white transition-colors">{testimonial.name}</h4>
                <p className="text-sm font-bold text-indigo-600 group-hover:text-indigo-200 transition-colors">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed group-hover:text-indigo-50 transition-colors">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
