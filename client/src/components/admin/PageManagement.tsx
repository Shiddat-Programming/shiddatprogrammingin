import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, Edit, Trash2, 
  Eye, EyeOff, Globe, Layout, 
  ChevronRight, MoreVertical, MenuIcon 
} from 'lucide-react';
import { PageConfig } from '../../types';

interface PageManagementProps {
  pages: PageConfig[];
  onCreate: () => void;
  onEdit: (page: PageConfig) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export function PageManagement({ 
  pages, 
  onCreate, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}: PageManagementProps) {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Page Management</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dynamic Content</h1>
          <p className="text-slate-500 font-medium">Create and manage your landing pages and dynamic content.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Create New Page
        </button>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
        <div className="relative max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search pages by title or slug..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page, i) => (
            <motion.div 
              key={page._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="aspect-video rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 relative overflow-hidden">
                {page.logoUrl ? (
                  <img src={page.logoUrl} className="w-full h-full object-contain p-8" alt="Page Logo" />
                ) : (
                  <Layout size={48} className="text-slate-200" />
                )}
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    page.isPublished ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{page.title}</h3>
              <p className="text-xs font-mono text-slate-400 mb-6">/{page.slug}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <Globe size={14} /> {page.sections.length} Sections
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {page.isDefault ? 'Default Page' : 'Custom Page'}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => onEdit(page)}
                  className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Edit Page Builder <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => onToggleVisibility(page._id)}
                  className={`p-4 rounded-2xl transition-colors ${page.isPublished ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  {page.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button 
                  onClick={() => onDelete(page._id)}
                  className="p-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
