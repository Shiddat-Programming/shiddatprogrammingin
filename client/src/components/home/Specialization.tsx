import React from 'react';
import { motion } from 'motion/react';
import { Code, Brain, Cloud, ShieldCheck, BarChart3, Smartphone } from 'lucide-react';

export const Specialization = ({ content }: any) => (
  <section className="py-32 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
            Our Expertise
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            {content?.title || 'Master the Most In-Demand'} <br />
            <span className="text-indigo-600">IT Specializations</span>
          </h2>
        </div>
        <p className="text-slate-500 font-medium max-w-md">
          {content?.description || 'We focus on practical, project-based learning to ensure you are industry-ready from day one.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(content?.specs || [
          { title: 'Full Stack Development', desc: 'Master MERN stack with real-world projects.', icon: Code },
          { title: 'AI & Machine Learning', desc: 'Learn Python, TensorFlow and Neural Networks.', icon: Brain },
          { title: 'Cloud Computing', desc: 'AWS, Azure and DevOps specialization.', icon: Cloud },
          { title: 'Cyber Security', desc: 'Ethical hacking and network security.', icon: ShieldCheck },
          { title: 'Data Science', desc: 'Big data analysis and visualization.', icon: BarChart3 },
          { title: 'Mobile App Dev', desc: 'React Native and Flutter development.', icon: Smartphone }
        ]).map((spec: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              {spec.icon ? <spec.icon size={32} /> : <Code size={32} />}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{spec.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{spec.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
