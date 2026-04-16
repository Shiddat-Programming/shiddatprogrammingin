import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Save, X, 
  MoveUp, MoveDown, Layout, 
  Link as LinkIcon, Settings, Eye, 
  ChevronRight, ArrowLeft, Globe, Menu as MenuIcon
} from 'lucide-react';
import { MenuConfig } from '../../types';

interface NavigationManagementProps {
  menus: MenuConfig[];
  onSave: (menu: MenuConfig) => void;
}

export function NavigationManagement({ menus, onSave }: NavigationManagementProps) {
  const [activeMenu, setActiveMenu] = useState<MenuConfig | null>(menus[0] || null);
  const [editedMenu, setEditedMenu] = useState<MenuConfig | null>(menus[0] || null);

  const handleMenuSelect = (menu: MenuConfig) => {
    setActiveMenu(menu);
    setEditedMenu({ ...menu });
  };

  const addLink = () => {
    if (!editedMenu) return;
    const newLink = {
      label: 'New Link',
      url: '/',
      order: editedMenu.links.length
    };
    setEditedMenu({
      ...editedMenu,
      links: [...editedMenu.links, newLink]
    });
  };

  const removeLink = (index: number) => {
    if (!editedMenu) return;
    const newLinks = editedMenu.links.filter((_, i) => i !== index);
    setEditedMenu({ ...editedMenu, links: newLinks });
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (!editedMenu) return;
    const newLinks = [...editedMenu.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setEditedMenu({ ...editedMenu, links: newLinks });
  };

  const updateLink = (index: number, updates: any) => {
    if (!editedMenu) return;
    const newLinks = [...editedMenu.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    setEditedMenu({ ...editedMenu, links: newLinks });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Site Navigation</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Menu Management</h1>
          <p className="text-slate-500 font-medium">Customize your header and footer navigation links.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => editedMenu && onSave(editedMenu)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Menu List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Available Menus</h3>
            {menus.map(menu => (
              <button 
                key={menu._id}
                onClick={() => handleMenuSelect(menu)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  activeMenu?._id === menu._id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MenuIcon size={16} />
                  {menu.name}
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Link Editor */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {editedMenu ? (
              <motion.div 
                key={editedMenu._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 capitalize">{editedMenu.name} Links</h2>
                  <button 
                    onClick={addLink}
                    className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Link
                  </button>
                </div>

                <div className="space-y-4">
                  {editedMenu.links.map((link, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-6 group">
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveLink(idx, 'up')} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"><MoveUp size={16} /></button>
                        <button onClick={() => moveLink(idx, 'down')} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"><MoveDown size={16} /></button>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-white rounded-xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                            value={link.label}
                            onChange={(e) => updateLink(idx, { label: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL / Slug</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-white rounded-xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                            value={link.url}
                            onChange={(e) => updateLink(idx, { url: e.target.value })}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => removeLink(idx)}
                        className="p-4 bg-white text-rose-500 rounded-2xl border border-slate-100 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {editedMenu.links.length === 0 && (
                    <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[40px]">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <LinkIcon size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">No links in this menu yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-center text-slate-200">
                  <MenuIcon size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Select a menu to edit</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Choose a menu from the sidebar to start managing your site's navigation.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
