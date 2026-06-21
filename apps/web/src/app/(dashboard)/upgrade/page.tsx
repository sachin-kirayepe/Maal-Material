'use client';

import React, { useState } from 'react';
import { Check, Zap, Building2, Shield, Loader2 } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for exploring the platform',
    features: ['Basic Profile', 'Up to 5 B2B Leads/month', 'Standard Support'],
    icon: <Shield className="w-6 h-6 text-slate-400" />,
    buttonText: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Pro',
    price: '999',
    description: 'For growing businesses and contractors',
    features: [
      'Unlimited B2B Leads',
      'AI Copilot (100 sessions)',
      'Verified Supplier Badge',
      'Priority Support',
    ],
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    buttonText: 'Upgrade to Pro',
    disabled: false,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '2999',
    description: 'Full power of ConstructOS for large orgs',
    features: [
      'Everything in Pro',
      'Unlimited AI Copilot',
      'WhatsApp Marketing API',
      '0% Marketplace Commission',
      'Dedicated Account Manager',
    ],
    icon: <Building2 className="w-6 h-6 text-purple-500" />,
    buttonText: 'Upgrade to Enterprise',
    disabled: false,
  },
];

export default function UpgradePage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { handleCheckout } = useRazorpay();

  const handleUpgrade = async (planName: string, price: string) => {
    setLoadingPlan(planName);
    try {
      await handleCheckout(planName, parseInt(price));
    } catch (error) {
      console.error('Checkout failed', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Upgrade your ConstructOS Experience
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose the perfect plan for your business. Unlock powerful AI tools, unlimited leads, and priority support.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl shadow-sm border transition-all hover:-translate-y-1 hover:shadow-xl ${
              plan.popular ? 'border-blue-500 shadow-blue-100/50' : 'border-slate-200'
            } p-8 flex flex-col h-full`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              {plan.icon}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
              <span className="text-slate-500">/month</span>
            </div>
            
            <p className="text-slate-600 mb-8 h-12">{plan.description}</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleUpgrade(plan.name, plan.price)}
              disabled={plan.disabled || loadingPlan === plan.name}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 ${
                plan.disabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {loadingPlan === plan.name && <Loader2 className="w-4 h-4 animate-spin" />}
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
