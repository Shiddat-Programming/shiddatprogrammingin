import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Sparkles, Star, ArrowRight } from 'lucide-react';
import { SubscriptionPlan, User } from '../../types';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentUser: User;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlans({ plans, currentUser, onSelectPlan }: SubscriptionPlansProps) {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Premium Access</p>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Choose Your Plan</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Unlock exclusive courses, placement assistance, and premium learning perks with our subscription plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => {
          const isCurrent = currentUser.subscriptionPlan === plan.planId;
          return (
            <motion.div 
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white p-10 rounded-[48px] border-2 transition-all flex flex-col ${
                isCurrent ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-slate-100 shadow-sm hover:shadow-xl'
              }`}
            >
              {plan.planId === '1year' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Best Value
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ {plan.duration}</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => !isCurrent && onSelectPlan(plan)}
                disabled={isCurrent}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                }`}
              >
                {isCurrent ? (
                  <>Current Plan <Check size={16} /></>
                ) : (
                  <>Get Started <ArrowRight size={16} /></>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trial Banner */}
      {!currentUser.subscriptionPlan && currentUser.isTrialActive && (
        <div className="bg-slate-900 p-10 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" /> Free Trial Active
            </div>
            <h3 className="text-3xl font-black">Experience Premium for Free</h3>
            <p className="text-slate-400 font-medium max-w-lg">
              You are currently on a 7-day free trial. Upgrade now to keep your progress and unlock all features permanently.
            </p>
          </div>
          <button className="relative z-10 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-2xl">
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}
