import React from 'react';
import { motion } from 'motion/react';

export const TrustSection = ({ content }: any) => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {(content?.stats || [
          { label: 'Batches Completed', value: '500+' },
          { label: 'Students Placed', value: '2500+' },
          { label: 'Expert Mentors', value: '50+' },
          { label: 'Partner Companies', value: '100+' }
        ]).map((stat: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="text-center space-y-2"
          >
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
