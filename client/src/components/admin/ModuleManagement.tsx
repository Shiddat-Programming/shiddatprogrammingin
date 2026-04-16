import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit, Trash2, 
  Layers, ChevronRight, ChevronDown, 
  PlayCircle, FileText, MoreVertical, 
  Save, X, ArrowLeft, Eye, EyeOff, Globe
} from 'lucide-react';
import { Course, Module, Lecture } from '../../types';

interface ModuleManagementProps {
  course: Course;
  onBack: () => void;
  onAddModule: (e: FormEvent, data: any) => void;
  onDeleteModule: (id: string) => void;
  onAddLecture: (e: FormEvent, moduleId: string, data: any) => void;
  onDeleteLecture: (moduleId: string, lectureId: string) => void;
}

export function ModuleManagement({ 
  course, 
  onBack, 
  onAddModule, 
  onDeleteModule, 
  onAddLecture, 
  onDeleteLecture 
}: ModuleManagementProps) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order: 0, visibility: 'published' });
  
  const [selectedModuleForLecture, setSelectedModuleForLecture] = useState<Module | null>(null);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [lectureForm, setLectureForm] = useState({ 
    title: '', 
    type: 'recorded', 
    youtubeLiveUrl: '', 
    youtubeRecordedUrl: '', 
    scheduledAt: '', 
    duration: 60 
  });

  const handleModuleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddModule(e, moduleForm);
    setIsAddingModule(false);
    setEditingModule(null);
    setModuleForm({ title: '', description: '', order: 0, visibility: 'published' });
  };

  const handleLectureSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForLecture) return;
    onAddLecture(e, selectedModuleForLecture._id, lectureForm);
    setIsAddingLecture(false);
    setEditingLecture(null);
    setLectureForm({ title: '', type: 'recorded', youtubeLiveUrl: '', youtubeRecordedUrl: '', scheduledAt: '', duration: 60 });
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors group mb-4">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Courses
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{course.title}</h1>
          <p className="text-slate-500 font-medium">Manage modules and lectures for this course.</p>
        </div>
        <button 
          onClick={() => setIsAddingModule(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add New Module
        </button>
      </div>

      <div className="space-y-6">
        {course.modules.map((module, mIdx) => (
          <motion.div 
            key={module._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xl shadow-sm">
                  {mIdx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{module.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{module.lectures.length} Lectures • {module.visibility}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setSelectedModuleForLecture(module);
                    setIsAddingLecture(true);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Add Lecture
                </button>
                <button 
                  onClick={() => {
                    setModuleForm({ title: module.title, description: module.description, order: module.order, visibility: module.visibility });
                    setEditingModule(module);
                    setIsAddingModule(true);
                  }}
                  className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDeleteModule(module._id)}
                  className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {module.lectures.map((lecture, lIdx) => (
                <div key={lecture._id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lecture.type === 'live' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {lecture.type === 'live' ? <Globe size={20} /> : <PlayCircle size={20} />}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setSelectedModuleForLecture(module);
                          setLectureForm({ ...lecture });
                          setEditingLecture(lecture);
                          setIsAddingLecture(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteLecture(module._id, lecture._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-2 line-clamp-1">{lecture.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lecture.type} • {lecture.duration}m</p>
                </div>
              ))}
              {module.lectures.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                  <p className="text-slate-400 font-bold text-sm">No lectures added yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Module Modal */}
      <AnimatePresence>
        {isAddingModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative"
            >
              <button onClick={() => setIsAddingModule(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-8">{editingModule ? 'Edit Module' : 'Add Module'}</h2>
              <form onSubmit={handleModuleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Module Title</label>
                  <input 
                    type="text" required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm min-h-[100px]"
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">
                  {editingModule ? 'Update Module' : 'Create Module'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lecture Modal */}
      <AnimatePresence>
        {isAddingLecture && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative"
            >
              <button onClick={() => setIsAddingLecture(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-8">{editingLecture ? 'Edit Lecture' : 'Add Lecture'}</h2>
              <form onSubmit={handleLectureSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lecture Title</label>
                  <input 
                    type="text" required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({...lectureForm, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                    <select 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                      value={lectureForm.type}
                      onChange={(e) => setLectureForm({...lectureForm, type: e.target.value as any})}
                    >
                      <option value="recorded">Recorded</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Duration (m)</label>
                    <input 
                      type="number" required
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                      value={lectureForm.duration}
                      onChange={(e) => setLectureForm({...lectureForm, duration: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">YouTube URL</label>
                  <input 
                    type="url" required
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    placeholder="https://youtube.com/..."
                    value={lectureForm.type === 'live' ? lectureForm.youtubeLiveUrl : lectureForm.youtubeRecordedUrl}
                    onChange={(e) => setLectureForm({
                      ...lectureForm, 
                      [lectureForm.type === 'live' ? 'youtubeLiveUrl' : 'youtubeRecordedUrl']: e.target.value
                    })}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">
                  {editingLecture ? 'Update Lecture' : 'Add Lecture'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
