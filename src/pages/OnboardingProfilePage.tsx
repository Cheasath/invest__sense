import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useAuthStore } from '../store/useAuthStore';
import { Wallet, Target, Calendar, ArrowRight, DollarSign } from 'lucide-react';

export const OnboardingProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [age, setAge] = useState(user?.financialProfile?.age || 32);
  const [annualIncomeINR, setAnnualIncomeINR] = useState(user?.financialProfile?.annualIncomeINR || 2400000);
  const [liquidNetWorthINR, setLiquidNetWorthINR] = useState(user?.financialProfile?.liquidNetWorthINR || 4500000);
  const [investmentHorizonYears, setInvestmentHorizonYears] = useState(user?.financialProfile?.investmentHorizonYears || 10);
  const [primaryGoal, setPrimaryGoal] = useState<'CAPITAL_PRESERVATION' | 'BALANCED_GROWTH' | 'AGGRESSIVE_GROWTH' | 'RETIREMENT' | 'INCOME'>(
    user?.financialProfile?.primaryGoal || 'BALANCED_GROWTH'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      financialProfile: {
        age,
        annualIncomeINR,
        liquidNetWorthINR,
        investmentHorizonYears,
        primaryGoal,
        monthlySavingsINR: Math.round(annualIncomeINR * 0.3 / 12)
      }
    });
    navigate('/onboarding/risk');
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF] uppercase tracking-wider font-semibold">
              <span>Step 1 of 2</span>
              <span>•</span>
              <span>Financial Baseline</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Investor Financial Profile
            </h1>
            <p className="text-xs text-[#8B96A5]">
              These inputs calibrate portfolio risk tolerance caps and suitability scoring formulas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B96A5] mb-1">Age (Years)</label>
                <input
                  type="number"
                  required
                  min={18}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B96A5] mb-1">Target Horizon (Years)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={40}
                  value={investmentHorizonYears}
                  onChange={(e) => setInvestmentHorizonYears(Number(e.target.value))}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8B96A5] mb-1">
                Annual Gross Income (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-mono text-[#8B96A5]">₹</span>
                <input
                  type="number"
                  required
                  step={50000}
                  value={annualIncomeINR}
                  onChange={(e) => setAnnualIncomeINR(Number(e.target.value))}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-8 pr-4 py-2.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <p className="text-[10px] text-[#8B96A5] mt-1 font-mono">₹{(annualIncomeINR / 100000).toFixed(1)} Lakhs / year</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8B96A5] mb-1">
                Liquid Investable Net Worth (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-mono text-[#8B96A5]">₹</span>
                <input
                  type="number"
                  required
                  step={100000}
                  value={liquidNetWorthINR}
                  onChange={(e) => setLiquidNetWorthINR(Number(e.target.value))}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-8 pr-4 py-2.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <p className="text-[10px] text-[#8B96A5] mt-1 font-mono">₹{(liquidNetWorthINR / 100000).toFixed(1)} Lakhs liquid capital</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8B96A5] mb-2">Primary Investment Objective</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'CAPITAL_PRESERVATION', label: 'Capital Preservation', desc: 'Focus on zero nominal losses and capital safety' },
                  { id: 'BALANCED_GROWTH', label: 'Balanced Growth', desc: 'Optimal blend of equities, gold, and fixed income' },
                  { id: 'AGGRESSIVE_GROWTH', label: 'Aggressive Capital Growth', desc: 'High equity orientation for maximum long-term compounding' },
                  { id: 'RETIREMENT', label: 'Retirement Corpus Building', desc: 'Disciplined compounding over a 10-30 yr window' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPrimaryGoal(opt.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      primaryGoal === opt.id
                        ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#E5E7EB]'
                        : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5] hover:border-[#8B96A5]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#E5E7EB]">{opt.label}</div>
                    <div className="text-[10px] text-[#8B96A5] mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 mt-4"
            >
              <span>Next: AI Risk Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
};
