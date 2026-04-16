import React from 'react';
import { GraduationCap, Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { MenuConfig } from '../../types';

interface FooterProps {
  config: any;
  footerMenu: MenuConfig | null;
  setView: (view: string) => void;
  setDynamicPage: (page: any) => void;
  API_URL: string;
}

export const Footer = ({ 
  config, 
  footerMenu, 
  setView, 
  setDynamicPage,
  API_URL 
}: FooterProps) => (
  <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {config?.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt="Shiddat Programming Institute" 
              className="h-12 w-auto object-contain"
            />
          ) : (
            <>
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <GraduationCap size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">Shiddat</span>
            </>
          )}
        </div>
        <p className="text-slate-500 font-medium leading-relaxed">
          Karad Madhil IT Specialization Che Ekmev Center. IT Software Training & AI Center.
        </p>
        <div className="flex gap-4">
          {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-black text-slate-900 mb-6">Quick Links</h4>
        <ul className="space-y-4">
          {footerMenu?.links.map((link: any, index: number) => (
            <li key={index}>
              <button 
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
                className="text-slate-500 font-bold hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-black text-slate-900 mb-6">Support</h4>
        <ul className="space-y-4">
          {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
            <li key={l}><a href="#" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-black text-slate-900 mb-6">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-slate-500 font-bold">
            <MapPin size={20} className="text-indigo-600" /> Karad, Maharashtra
          </li>
          <li className="flex items-center gap-3 text-slate-500 font-bold">
            <Phone size={20} className="text-indigo-600" /> +91 91720 91720
          </li>
          <li className="flex items-center gap-3 text-slate-500 font-bold">
            <Mail size={20} className="text-indigo-600" /> contact@shiddat.institute
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-100 text-center">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        © {new Date().getFullYear()} Shiddat Programming Institute. All rights reserved.
      </p>
    </div>
  </footer>
);
