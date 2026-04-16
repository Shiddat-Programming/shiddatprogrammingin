import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, LayoutDashboard, BookOpen, 
  GraduationCap, FileText, Search, 
  Sparkles, Users, CreditCard, Code, 
  Trophy, Settings, GraduationCap as GraduationCapIcon,
  Home as HomeIcon, LayoutDashboard as DashboardIcon,
  BookOpen as BookOpenIcon, FileText as FileTextIcon,
  Search as SearchIcon, Sparkles as SparklesIcon,
  Users as UsersIcon, CreditCard as CreditCardIcon,
  Code as CodeIcon, Trophy as TrophyIcon,
  Settings as SettingsIcon, Menu, X, Bell, User,
  CheckCircle2, AlertCircle, Layout, Globe, Briefcase
} from 'lucide-react';

import { 
  User as UserType, Course, Job, 
  PageConfig, SubscriptionPlan, MenuConfig 
} from '../types';
import { NavItem } from '../components/layout/NavItem';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { CourseManagement } from '../components/admin/CourseManagement';
import { PageManagement } from '../components/admin/PageManagement';
import { StudentManagement } from '../components/admin/StudentManagement';
import { PlacementManagement } from '../components/admin/PlacementManagement';
import { PlanManagement } from '../components/admin/PlanManagement';
import { NavigationManagement } from '../components/admin/NavigationManagement';

interface AdminPageProps {
  currentUser: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  notification: { message: string, type: 'success' | 'error' } | null;
  dbStatus: string;
  courses: Course[];
  placements: Job[];
  users: UserType[];
  pages: PageConfig[];
  menus: MenuConfig[];
  subscriptionPlans: SubscriptionPlan[];
  onLogout: () => void;
  onSaveMenu: (menu: MenuConfig) => void;
  onCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onManageModules: (course: Course) => void;
  onCreatePage: () => void;
  onEditPage: (page: PageConfig) => void;
  onDeletePage: (id: string) => void;
  onTogglePageVisibility: (id: string) => void;
  onEnableSubscription: (id: string) => void;
  onDisableSubscription: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onCreateJob: () => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onCreatePlan: () => void;
  onEditPlan: (plan: SubscriptionPlan) => void;
  onDeletePlan: (id: string) => void;
  stats: any;
}

export function AdminPage({
  currentUser,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  notification,
  dbStatus,
  courses,
  placements,
  users,
  pages,
  menus,
  subscriptionPlans,
  onLogout,
  onSaveMenu,
  onCreateCourse,
  onEditCourse,
  onDeleteCourse,
  onManageModules,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onTogglePageVisibility,
  onEnableSubscription,
  onDisableSubscription,
  onDeleteUser,
  onCreateJob,
  onEditJob,
  onDeleteJob,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
  stats
}: AdminPageProps) {

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border ${
              notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <GraduationCapIcon className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-800">EduTech<span className="text-indigo-600">Pro</span></span>}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <NavItem icon={<HomeIcon />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} collapsed={!isSidebarOpen} />
          <NavItem icon={<DashboardIcon />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} />
          <NavItem icon={<BookOpenIcon />} label="Manage Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Layout />} label="Page Management" active={activeTab === 'landing-page'} onClick={() => setActiveTab('landing-page')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Globe />} label="Navigation" active={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')} collapsed={!isSidebarOpen} />
          <NavItem icon={<FileTextIcon />} label="Content Management" active={activeTab === 'content-management'} onClick={() => setActiveTab('content-management')} collapsed={!isSidebarOpen} />
          <NavItem icon={<UsersIcon />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Briefcase />} label="Placements" active={activeTab === 'placements'} onClick={() => setActiveTab('placements')} collapsed={!isSidebarOpen} />
          <NavItem icon={<CreditCardIcon />} label="Manage Plans" active={activeTab === 'manage-plans'} onClick={() => setActiveTab('manage-plans')} collapsed={!isSidebarOpen} />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem icon={<SettingsIcon />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} />
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Database</p>
              <p className="text-xs font-bold text-slate-700">{dbStatus}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources, users..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <div className="relative group">
                <img 
                  src={currentUser.profile_photo || `https://i.pravatar.cc/150?u=${currentUser._id}`} 
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-md cursor-pointer group-hover:scale-105 transition-transform" 
                  alt="Avatar" 
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                  <button onClick={() => setActiveTab('settings')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
                    <User size={16} /> Profile
                  </button>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-rose-50 rounded-xl text-sm font-bold text-rose-600">
                    <X size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AdminDashboard stats={stats} />
              </motion.div>
            )}
            {activeTab === 'navigation' && (
              <motion.div key="navigation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <NavigationManagement 
                  menus={menus} 
                  onSave={onSaveMenu} 
                />
              </motion.div>
            )}
            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <CourseManagement 
                  courses={courses} 
                  onCreate={onCreateCourse}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                  onManageModules={onManageModules}
                />
              </motion.div>
            )}
            {activeTab === 'landing-page' && (
              <motion.div key="landing-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PageManagement 
                  pages={pages}
                  onCreate={onCreatePage}
                  onEdit={onEditPage}
                  onDelete={onDeletePage}
                  onToggleVisibility={onTogglePageVisibility}
                />
              </motion.div>
            )}
            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <StudentManagement 
                  students={users.filter(u => u.role === 'student')}
                  onEnableSubscription={onEnableSubscription}
                  onDisableSubscription={onDisableSubscription}
                  onDelete={onDeleteUser}
                />
              </motion.div>
            )}
            {activeTab === 'placements' && (
              <motion.div key="placements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PlacementManagement 
                  placements={placements}
                  onCreate={onCreateJob}
                  onEdit={onEditJob}
                  onDelete={onDeleteJob}
                />
              </motion.div>
            )}
            {activeTab === 'manage-plans' && (
              <motion.div key="manage-plans" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PlanManagement 
                  plans={subscriptionPlans}
                  onCreate={onCreatePlan}
                  onEdit={onEditPlan}
                  onDelete={onDeletePlan}
                />
              </motion.div>
            )}
            {/* Other tabs can be implemented similarly */}
            {['home', 'navigation', 'content-management', 'settings'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <SparklesIcon size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 capitalize">{activeTab} Coming Soon</h3>
                  <p className="text-slate-500 font-medium max-w-md">We're working hard to bring you this feature. Stay tuned!</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
