import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onClose: () => void;
  onSwitch: () => void;
  onSubmit: (e: FormEvent, data: any) => void;
}

export function AuthForm({ type, onClose, onSwitch, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, formData);
  };

  return (
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
        className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
      >
        {/* Left Side - Visual */}
        <div className="hidden md:flex md:w-2/5 bg-indigo-600 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Sparkles size={24} />
            </div>
            <h3 className="text-3xl font-black leading-tight mb-4">
              {type === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
            </h3>
            <p className="text-indigo-100/80 text-sm font-medium leading-relaxed">
              {type === 'login' 
                ? 'Access your courses, learning resources, and career tools.' 
                : 'Join 10,000+ students learning the future of tech.'}
            </p>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-indigo-200">
              <ShieldCheck size={16} /> Secure Authentication
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-10 md:p-12">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X size={20} />
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {type === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button onClick={onSwitch} className="text-indigo-600 font-black ml-2 hover:underline">
                {type === 'login' ? 'Sign Up Free' : 'Sign In'}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {type === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                {type === 'login' && (
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Forgot Password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {type === 'login' ? 'Sign In Now' : 'Create My Account'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
