import React from 'react';
import { GraduationCap } from 'lucide-react';
import { MenuConfig } from '../../types';

interface NavbarProps {
  isScrolled: boolean;
  config: any;
  headerMenu: MenuConfig | null;
  view: string;
  setView: (view: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  setDynamicPage: (page: any) => void;
  API_URL: string;
}

export const Navbar = ({ 
  isScrolled, 
  config, 
  headerMenu, 
  view, 
  setView, 
  onLogin, 
  onRegister, 
  setDynamicPage,
  API_URL 
}: NavbarProps) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4' : 'bg-transparent py-6'}`}>
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          {config?.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt="Shiddat Programming Institute" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          ) : (
            <>
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                <GraduationCap size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Shiddat</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Programming Institute</span>
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:flex items-center gap-6">
          {headerMenu?.links.map((link: any, index: number) => (
            <button 
              key={index}
              onClick={() => {
                if (link.url.startsWith('/')) {
                  const slug = link.url.slice(1);
                  if (slug === '') setView('home');
                  else if (slug === 'courses') setView('courses');
                  else if (slug === 'jobs') setView('jobs');
                  else {
                    fetch(API_URL + `/api/pages/${slug}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data) {
                          setDynamicPage(data);
                          setView('dynamic');
                        }
                      });
                  }
                } else {
                  window.open(link.url, '_blank');
                }
              }}
              className={`text-sm font-bold transition-colors ${view === link.url.slice(1) ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogin}
          className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Sign In
        </button>
        <button 
          onClick={onRegister}
          className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
        >
          Join Free Trial
        </button>
      </div>
    </div>
  </nav>
);
