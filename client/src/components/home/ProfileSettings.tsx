import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Save, Camera, Globe, Github, Linkedin, Twitter, Plus, Trash2 } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileSettingsProps {
  currentUser: UserType;
  onUpdateProfile: (profile: any) => void;
}

export function ProfileSettings({ currentUser, onUpdateProfile }: ProfileSettingsProps) {
  const [profile, setProfile] = useState(currentUser.profile || {
    bio: '',
    headline: '',
    skills: [],
    projects: [],
    social: {}
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    onUpdateProfile(profile);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s: string) => s !== skill) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Account Settings</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 font-medium">Manage your public profile and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm text-center space-y-6">
            <div className="relative inline-block group">
              <img 
                src={currentUser.profile_photo || `https://i.pravatar.cc/150?u=${currentUser._id}`} 
                className="w-32 h-32 rounded-[48px] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform" 
                alt="Avatar" 
              />
              <button className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{currentUser.name}</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{currentUser.role}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} /> Account Security
            </h4>
            <div className="space-y-4">
              <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">
                Change Password
              </button>
              <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">
                Two-Factor Auth
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={currentUser.name}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    value={currentUser.email}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Headline</label>
              <input 
                type="text" 
                placeholder="e.g. Full Stack Developer | Learning MERN"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                value={profile.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bio</label>
              <textarea 
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold resize-none"
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Skills</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a skill..."
                  className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button 
                  onClick={addSkill}
                  className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center gap-3"
              >
                <Save size={18} /> Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
