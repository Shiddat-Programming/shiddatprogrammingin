import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Edit, Trash2, 
  CreditCard, CheckCircle2, 
  ChevronRight, MoreVertical 
} from 'lucide-react';
import { SubscriptionPlan } from '../../types';

interface PlanManagementProps {
  plans: SubscriptionPlan[];
  onCreate: () => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (id: string) => void;
}

export function PlanManagement({ 
  plans, 
  onCreate, 
  onEdit, 
  onDelete 
}: PlanManagementProps) {
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Plan Management</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 font-medium">Manage your platform's pricing and subscription tiers.</p>
        </div>
        <button 
          onClick={onCreate}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <CreditCard size={32} />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-8">{plan.duration}</p>
              
              <div className="text-5xl font-black text-slate-900 mb-10">
                ₹{plan.price} <span className="text-lg text-slate-400 font-bold">/ {plan.duration}</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-500" /> {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => onEdit(plan)}
                  className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Edit Plan
                </button>
                <button 
                  onClick={() => onDelete(plan._id)}
                  className="p-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
