import React, { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Layers, BookOpen, PlayCircle, FileText, Globe, Briefcase, CreditCard } from 'lucide-react';
import { Course, Module, Lecture, PageConfig, Job, SubscriptionPlan } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const CourseModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  isEditing 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (e: FormEvent) => void, 
  formData: any, 
  setFormData: (d: any) => void, 
  isEditing: boolean 
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Course' : 'Create New Course'}>
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Course Title</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
              placeholder="Full Stack Web Development"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
            <textarea 
              required
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all min-h-[120px]"
              placeholder="Master the MERN stack..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Price (₹)</label>
              <input 
                type="number" 
                required
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                placeholder="4999"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Modules Count</label>
              <input 
                type="number" 
                required
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                placeholder="12"
                value={formData.modules_count}
                onChange={(e) => setFormData({...formData, modules_count: e.target.value})}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Thumbnail URL</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Course Type</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="paid">Paid Course</option>
              <option value="free">Free Course</option>
            </select>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-indigo-600 rounded-lg border-slate-300 focus:ring-indigo-500"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
            />
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Publish Course</label>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Globe className="text-indigo-600" /> Landing Page Details
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Instructor Name</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={formData.landing_page.instructor_name}
                onChange={(e) => setFormData({...formData, landing_page: {...formData.landing_page, instructor_name: e.target.value}})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Instructor Bio</label>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm min-h-[100px]"
                value={formData.landing_page.instructor_bio}
                onChange={(e) => setFormData({...formData, landing_page: {...formData.landing_page, instructor_bio: e.target.value}})}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Benefits (One per line)</label>
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm min-h-[100px]"
                value={formData.landing_page.benefits}
                onChange={(e) => setFormData({...formData, landing_page: {...formData.landing_page, benefits: e.target.value}})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Instructor Image URL</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={formData.landing_page.instructor_image}
                onChange={(e) => setFormData({...formData, landing_page: {...formData.landing_page, instructor_image: e.target.value}})}
              />
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} /> {isEditing ? 'Update Course' : 'Create Course'}
      </button>
    </form>
  </Modal>
);

export const JobModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  isEditing 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (e: FormEvent) => void, 
  formData: any, 
  setFormData: (d: any) => void, 
  isEditing: boolean 
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Job' : 'Add New Job'}>
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
          <input 
            type="text" required
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
          <input 
            type="text" required
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
          <input 
            type="text" required
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Type</label>
          <select 
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Salary Range</label>
          <input 
            type="text" required
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            placeholder="e.g. ₹6L - ₹12L"
            value={formData.salary}
            onChange={(e) => setFormData({...formData, salary: e.target.value})}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Apply URL</label>
          <input 
            type="url" required
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            value={formData.apply_url}
            onChange={(e) => setFormData({...formData, apply_url: e.target.value})}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
        <textarea 
          required
          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm min-h-[150px]"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <button 
        type="submit"
        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} /> {isEditing ? 'Update Job' : 'Add Job'}
      </button>
    </form>
  </Modal>
);
