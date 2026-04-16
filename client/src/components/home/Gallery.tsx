import React from 'react';
import { motion } from 'motion/react';

export const Gallery = ({ content }: any) => (
  <section className="py-32 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Life at Shiddat</h2>
        <p className="text-slate-500 font-medium">Glimpses of our batches, celebrations, and learning environment.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
            className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white"
          >
            <img 
              src={`https://picsum.photos/seed/shiddat-${i}/800/800`} 
              className="w-full h-full object-cover"
              alt="Gallery"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
