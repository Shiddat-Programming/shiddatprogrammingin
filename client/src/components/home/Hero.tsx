import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code, Cpu, Globe, Zap } from 'lucide-react';

export const Hero = ({ content, onRegister, setView }: any) => (
  <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center">
    {/* Background Animation */}
    <div className="absolute inset-0 -z-10 bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2], 
              scale: [1, 1.2, 1],
              x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
            className="absolute text-indigo-200"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          >
            {i % 4 === 0 ? <Code size={24} /> : i % 4 === 1 ? <Cpu size={24} /> : i % 4 === 2 ? <Globe size={24} /> : <Zap size={24} />}
          </motion.div>
        ))}
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Sticker */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-200 animate-bounce-slow">
          <Sparkles size={16} />
          Offline-Online Training
        </div>

        {/* Main Title / Tagline */}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
          {content?.title || 'Shiddat'} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
            {content?.subtitle || 'Learn. Build. Succeed.'}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
          {content?.description || 'Join the most comprehensive learning platform designed for the next generation of developers.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={onRegister}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0"
          >
            Get Started Now
          </button>
          <button 
            onClick={() => setView('courses')}
            className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Browse Courses
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);
