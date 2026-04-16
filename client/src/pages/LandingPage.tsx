import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ChevronRight, Target, 
  LayoutDashboard, Briefcase, Users, 
  Bell, User, Trophy, Layers, Home, 
  GraduationCap, Sparkles, Code, Cpu, Globe, Zap,
  Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail,
  Calendar, Clock, Star, BookOpen, PlayCircle, FileText, Smartphone,
  ShieldCheck, BarChart3, Brain, Cloud, Quote, CheckCircle2, AlertCircle,
  ExternalLink, DollarSign
} from 'lucide-react';

import { 
  Course, Job, PageConfig, MenuConfig, 
  LandingPageSection 
} from '../types';

import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { TrustSection } from '../components/home/TrustSection';
import { Specialization } from '../components/home/Specialization';
import { PlacementShowcase } from '../components/home/PlacementShowcase';
import { Gallery } from '../components/home/Gallery';
import { UpcomingBatches } from '../components/home/UpcomingBatches';
import { OnlineOffline } from '../components/home/OnlineOffline';
import { Testimonials } from '../components/home/Testimonials';
import { Subscription } from '../components/home/Subscription';
import { CourseCard } from '../components/course/CourseCard';
import { JobCard } from '../components/ui/JobCard';

const API_URL = import.meta.env.VITE_API_URL || '';

interface LandingPageProps {
  courses: Course[];
  placements: Job[];
  onLogin: () => void;
  onRegister: () => void;
  onEnroll: (id: string, type: 'paid' | 'free') => void;
  onViewLanding: (course: Course) => void;
  config: any;
  headerMenu: MenuConfig | null;
  footerMenu: MenuConfig | null;
  setCurrentPage: (page: PageConfig) => void;
}

export function LandingPage({ 
  courses, 
  placements, 
  onLogin, 
  onRegister, 
  onEnroll, 
  onViewLanding, 
  config, 
  headerMenu, 
  footerMenu, 
  setCurrentPage 
}: LandingPageProps) {
  const [view, setView] = useState('home');
  const [dynamicPage, setDynamicPage] = useState<PageConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredJobs = (placements || []).filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesDate = !dateFilter || new Date(job.posted_at).toISOString().split('T')[0] === dateFilter;
    return matchesSearch && matchesType && matchesDate;
  });

  const renderSections = (sections: any[]) => {
    const sectionComponents: any = {
      hero: Hero,
      trust: TrustSection,
      specialization: Specialization,
      placements: PlacementShowcase,
      gallery: Gallery,
      batches: UpcomingBatches,
      'online-offline': OnlineOffline,
      testimonials: Testimonials,
      subscription: Subscription
    };

    return sections
      .filter((s: any) => s.isVisible)
      .sort((a: any, b: any) => a.order - b.order)
      .map((section: any) => {
        const Component = sectionComponents[section.type];
        if (!Component) return null;
        return <Component key={section.id} content={section.content} onRegister={onRegister} setView={setView} />;
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        isScrolled={isScrolled} 
        config={config} 
        headerMenu={headerMenu} 
        view={view} 
        setView={setView} 
        onLogin={onLogin} 
        onRegister={onRegister} 
        setDynamicPage={setDynamicPage}
        API_URL={API_URL}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderSections(config?.sections || [])}
          </motion.div>
        )}

        {view === 'courses' && (
          <motion.div 
            key="courses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">Our Courses</h1>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">Master the most in-demand tech skills with our industry-leading courses.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.filter(c => c.isPublished).map(course => (
                <div key={course._id}>
                  <CourseCard course={course} onViewLanding={onViewLanding} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'jobs' && (
          <motion.div 
            key="jobs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">Placement Portal</h1>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">Explore job opportunities from our partner companies.</p>
            </div>
            
            {/* Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 mb-12 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by title, company or location..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="w-full md:w-48 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map(job => (
                <div key={job._id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'dynamic' && dynamicPage && (
          <motion.div 
            key={dynamicPage.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderSections(dynamicPage.sections)}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer 
        config={config} 
        footerMenu={footerMenu} 
        setView={setView} 
        setDynamicPage={setDynamicPage}
        API_URL={API_URL}
      />
    </div>
  );
}
