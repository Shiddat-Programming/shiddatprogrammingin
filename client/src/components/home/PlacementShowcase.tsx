import React from 'react';

export const PlacementShowcase = ({ content }: any) => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Our Students Work At</h2>
        <p className="text-slate-500 font-medium">Join our alumni working at top tech giants globally.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Infosys', 'Wipro'].map(company => (
          <div key={company} className="text-2xl font-black text-slate-400 hover:text-slate-900 cursor-default transition-colors">
            {company}
          </div>
        ))}
      </div>
    </div>
  </section>
);
