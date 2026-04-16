import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlayCircle, CheckCircle2, Lock, ChevronRight, 
  ChevronDown, FileText, MessageSquare, Star, 
  ArrowLeft, Download, Share2, MoreVertical,
  Clock, Play, Pause, Volume2, Maximize, Settings
} from 'lucide-react';
import { Course, Module, Lecture } from '../../types';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

export function CoursePlayer({ course, onBack }: CoursePlayerProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(course.modules[0] || null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(course.modules[0]?.lectures[0] || null);
  const [expandedModules, setExpandedModules] = useState<string[]>([course.modules[0]?._id || '']);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes' | 'reviews'>('overview');

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-indigo-600"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 line-clamp-1">{course.title}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {selectedModule?.title} • {selectedLecture?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
              <Star size={16} fill="currentColor" /> 4.9 Rating
            </div>
            <button className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-indigo-600">
              <Share2 size={24} />
            </button>
          </div>
        </header>

        {/* Video Player Section */}
        <div className="aspect-video bg-slate-900 relative group">
          {selectedLecture ? (
            <iframe 
              src={getYoutubeEmbedUrl(selectedLecture.type === 'live' ? selectedLecture.youtubeLiveUrl : selectedLecture.youtubeRecordedUrl)}
              className="w-full h-full"
              allowFullScreen
              title={selectedLecture.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <PlayCircle size={120} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center gap-8 border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'resources', label: 'Resources', icon: Download },
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon size={18} /> {tab.label}
                  </div>
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-slate-900">About this Lecture</h2>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {selectedLecture?.description || 'No description available for this lecture.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Clock className="text-indigo-600" /> Duration
                      </h3>
                      <p className="text-slate-500 font-medium">{selectedLecture?.duration || 60} minutes of high-quality content.</p>
                    </div>
                    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" /> Learning Outcome
                      </h3>
                      <p className="text-slate-500 font-medium">Master the core concepts discussed in this session.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sidebar - Curriculum */}
      <div className="lg:w-[400px] bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-2">Course Content</h2>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">65% Completed</p>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">12/18 Lessons</p>
          </div>
          <div className="w-full h-2 bg-slate-50 rounded-full mt-4 overflow-hidden">
            <div className="w-[65%] h-full bg-indigo-600 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {course.modules.map((module, mIdx) => (
            <div key={module._id} className="space-y-2">
              <button 
                onClick={() => toggleModule(module._id)}
                className={`w-full p-6 rounded-3xl flex items-center justify-between transition-all ${
                  expandedModules.includes(module._id) ? 'bg-slate-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 font-black text-sm">
                    {mIdx + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-slate-900 text-sm line-clamp-1">{module.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{module.lectures.length} Lectures</p>
                  </div>
                </div>
                <ChevronDown size={20} className={`text-slate-300 transition-transform ${expandedModules.includes(module._id) ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedModules.includes(module._id) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-2 space-y-2"
                  >
                    {module.lectures.map((lecture, lIdx) => (
                      <button 
                        key={lecture._id}
                        onClick={() => {
                          setSelectedModule(module);
                          setSelectedLecture(lecture);
                        }}
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                          selectedLecture?._id === lecture._id 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          selectedLecture?._id === lecture._id ? 'bg-indigo-600 text-white' : 'bg-slate-100 group-hover:bg-indigo-100'
                        }`}>
                          {selectedLecture?._id === lecture._id ? <Play size={14} fill="currentColor" /> : <PlayCircle size={16} />}
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-xs font-black line-clamp-1">{lecture.title}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{lecture.duration}m</p>
                        </div>
                        {lIdx < 2 && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
