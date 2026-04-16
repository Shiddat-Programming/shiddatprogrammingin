import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Save, X, 
  MoveUp, MoveDown, Layout, 
  Type, Image as ImageIcon, 
  Layers, Settings, Eye, 
  ChevronRight, ArrowLeft, Briefcase, Globe, Users, CreditCard
} from 'lucide-react';
import { PageConfig, LandingPageSection } from '../../types';

interface PageBuilderProps {
  page: PageConfig;
  onSave: (page: PageConfig) => void;
  onBack: () => void;
}

export function PageBuilder({ page, onSave, onBack }: PageBuilderProps) {
  const [editedPage, setEditedPage] = useState<PageConfig>({ ...page });
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const addSection = (type: LandingPageSection['type']) => {
    const newSection: LandingPageSection = {
      _id: Math.random().toString(36).substr(2, 9),
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${type} Section`,
      content: {},
      order: editedPage.sections.length,
      isVisible: true
    };
    setEditedPage({
      ...editedPage,
      sections: [...editedPage.sections, newSection]
    });
  };

  const removeSection = (index: number) => {
    const newSections = editedPage.sections.filter((_, i) => i !== index);
    setEditedPage({ ...editedPage, sections: newSections });
    if (activeSection === index) setActiveSection(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...editedPage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setEditedPage({ ...editedPage, sections: newSections });
    if (activeSection === index) setActiveSection(targetIndex);
  };

  const updateSection = (index: number, updates: Partial<LandingPageSection>) => {
    const newSections = [...editedPage.sections];
    newSections[index] = { ...newSections[index], ...updates };
    setEditedPage({ ...editedPage, sections: newSections });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-indigo-600">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">Page Builder</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Editing: {page.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl transition-all ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Settings size={20} />
          </button>
          <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all flex items-center gap-2">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={() => onSave(editedPage)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Section List */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
          {showSettings ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Page Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page Title</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={editedPage.title}
                    onChange={(e) => setEditedPage({ ...editedPage, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={editedPage.slug}
                    onChange={(e) => setEditedPage({ ...editedPage, slug: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isHomepage"
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    checked={editedPage.isHomepage}
                    onChange={(e) => setEditedPage({ ...editedPage, isHomepage: e.target.checked })}
                  />
                  <label htmlFor="isHomepage" className="text-xs font-bold text-slate-600">Set as Homepage</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isPublished"
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    checked={editedPage.isPublished}
                    onChange={(e) => setEditedPage({ ...editedPage, isPublished: e.target.checked })}
                  />
                  <label htmlFor="isPublished" className="text-xs font-bold text-slate-600">Published</label>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Page Sections</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'hero', icon: Layout },
                    { type: 'trust', icon: Layers },
                    { type: 'specialization', icon: Type },
                    { type: 'placement', icon: Briefcase },
                    { type: 'batches', icon: Layers },
                    { type: 'online_offline', icon: Globe },
                    { type: 'gallery', icon: ImageIcon },
                    { type: 'testimonials', icon: Users },
                    { type: 'subscription', icon: CreditCard }
                  ].map(item => (
                    <button 
                      key={item.type}
                      onClick={() => addSection(item.type as any)}
                      className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-100 transition-all flex flex-col items-center gap-2"
                    >
                      <item.icon size={18} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{item.type.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {editedPage.sections.map((section, idx) => (
                  <div 
                    key={section._id}
                    onClick={() => setActiveSection(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      activeSection === idx ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{section.type}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }} className="p-1 hover:bg-white rounded"><MoveUp size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }} className="p-1 hover:bg-white rounded"><MoveDown size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); removeSection(idx); }} className="p-1 hover:bg-rose-50 text-rose-500 rounded"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm line-clamp-1">{section.title}</h4>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            {activeSection !== null ? (
              <motion.div 
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 capitalize">{editedPage.sections[activeSection].type} Settings</h2>
                  <button onClick={() => setActiveSection(null)} className="p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Section Title</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      value={editedPage.sections[activeSection].title}
                      onChange={(e) => updateSection(activeSection, { title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Section Subtitle</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      value={editedPage.sections[activeSection].subtitle || ''}
                      onChange={(e) => updateSection(activeSection, { subtitle: e.target.value })}
                    />
                  </div>

                  {/* Dynamic fields based on section type */}
                  {editedPage.sections[activeSection].type === 'hero' && (
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Title</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                          value={editedPage.sections[activeSection].content?.title || ''}
                          onChange={(e) => updateSection(activeSection, { 
                            content: { ...editedPage.sections[activeSection].content, title: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Subtitle</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                          value={editedPage.sections[activeSection].content?.subtitle || ''}
                          onChange={(e) => updateSection(activeSection, { 
                            content: { ...editedPage.sections[activeSection].content, subtitle: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Description</label>
                        <textarea 
                          rows={4}
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold resize-none"
                          value={editedPage.sections[activeSection].content?.description || ''}
                          onChange={(e) => updateSection(activeSection, { 
                            content: { ...editedPage.sections[activeSection].content, description: e.target.value } 
                          })}
                        />
                      </div>
                    </div>
                  )}

                  {editedPage.sections[activeSection].type !== 'hero' && (
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                        <p className="text-indigo-600 text-sm font-bold flex items-center gap-2">
                          <Settings size={18} /> Basic content editing for {editedPage.sections[activeSection].type}.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Content JSON</label>
                        <textarea 
                          rows={10}
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs resize-none"
                          value={JSON.stringify(editedPage.sections[activeSection].content, null, 2)}
                          onChange={(e) => {
                            try {
                              const content = JSON.parse(e.target.value);
                              updateSection(activeSection, { content });
                            } catch (err) {
                              // Invalid JSON, don't update
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-center text-slate-200">
                  <Layout size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Select a section to edit</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Choose a section from the sidebar or add a new one to start building your page.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
