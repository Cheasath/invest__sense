import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const OnboardingRiskPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  // Questions for risk score calculation
  const [q1, setQ1] = useState(3); // Reaction to 20% market dip
  const [q2, setQ2] = useState(4); // Emergency fund coverage months
  const [q3, setQ3] = useState(3); // Financial knowledge level
  const [q4, setQ4] = useState(4); // Volatility preference

  const [assessedResult, setAssessedResult] = useState<any>(null);

  const calculateRisk = () => {
    const rawScore = Math.round(((q1 * 0.3) + (q2 * 0.2) + (q3 * 0.2) + (q4 * 0.3)) * 20);
    const score = Math.min(95, Math.max(25, rawScore));

    let category: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'GROWTH' | 'AGGRESSIVE' = 'GROWTH';
    let maxDrawdown = 20;

    if (score < 40) { category = 'CONSERVATIVE'; maxDrawdown = 10; }
    else if (score < 55) { category = 'MODERATE'; maxDrawdown = 15; }
    else if (score < 70) { category = 'BALANCED'; maxDrawdown = 20; }
    else if (score < 85) { category = 'GROWTH'; maxDrawdown = 25; }
    else { category = 'AGGRESSIVE'; maxDrawdown = 35; }

    const factors = [
      {
        factor: 'Market Dip Reaction',
        impact: q1 >= 4 ? 'HIGH' : 'MEDIUM',
        description: q1 >= 4 ? 'Willingness to buy during market corrections enables higher equity risk capacity.' : 'Disciplined hold strategy protects downside.'
      },
      {
        factor: 'Emergency Liquidity Buffer',
        impact: q2 >= 4 ? 'HIGH' : 'LOW',
        description: q2 >= 4 ? 'Strong >6 month emergency buffer shields portfolio from forced liquidation.' : 'Moderate cash buffer.'
      },
      {
        factor: 'Target Investment Horizon',
        impact: 'HIGH',
        description: `${user?.financialProfile?.investmentHorizonYears || 10}-year horizon allows portfolio to comfortably compound through market cycles.`
      }
    ];

    const result = {
      score,
      category,
      maxDrawdownTolerancePct: maxDrawdown,
      factors,
      assessedAt: new Date().toISOString()
    };

    setAssessedResult(result);
  };

  const handleComplete = async () => {
    if (!assessedResult) {
      calculateRisk();
    }
    await updateProfile({
      riskProfile: assessedResult || {
        score: 68,
        category: 'GROWTH',
        maxDrawdownTolerancePct: 22,
        assessedAt: new Date().toISOString(),
        factors: [
          { factor: 'Investment Horizon (10 yrs)', impact: 'HIGH', description: 'Long term horizon allows recovery from market downturns.' },
          { factor: 'Emergency Savings (6x expenses)', impact: 'HIGH', description: 'Strong liquidity buffer supports equity risk capacity.' }
        ]
      }
    });
    navigate('/dashboard');
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF] uppercase tracking-wider font-semibold">
              <span>Step 2 of 2</span>
              <span>•</span>
              <span>AI Risk Profiling</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              AI Risk Capacity & Assessment
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Answer these 4 behavioral questions to calibrate your personalized Risk Score (0-100) and max drawdown limit.
            </p>
          </div>

          <div className="space-y-5">
            {/* Q1 */}
            <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-2">
              <label className="text-xs font-semibold text-[#E5E7EB] block">
                1. If your portfolio dropped by 20% during a sharp market correction over 2 months, how would you react?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { v: 1, label: 'Sell all holdings immediately to prevent further loss' },
                  { v: 2, label: 'Sell a portion to reduce volatility' },
                  { v: 3, label: 'Hold firm and wait for market recovery' },
                  { v: 5, label: 'Buy more agressively at discounted valuations' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => { setQ1(opt.v); setAssessedResult(null); }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      q1 === opt.v ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#161B22] border-[#232B36] text-[#8B96A5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-2">
              <label className="text-xs font-semibold text-[#E5E7EB] block">
                2. How many months of essential living expenses do you hold separately in liquid bank/liquid ETF funds?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { v: 1, label: '< 2 Months' },
                  { v: 2, label: '3-5 Months' },
                  { v: 4, label: '6-12 Months' },
                  { v: 5, label: '> 12 Months' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => { setQ2(opt.v); setAssessedResult(null); }}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      q2 === opt.v ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#161B22] border-[#232B36] text-[#8B96A5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-2">
              <label className="text-xs font-semibold text-[#E5E7EB] block">
                3. What is your experience and familiarity with asset classes like Equities, Gold, and Bonds?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { v: 1, label: 'Beginner (Fixed Deposits)' },
                  { v: 3, label: 'Moderate (SIPs & Mutual Funds)' },
                  { v: 5, label: 'Advanced (Direct Stocks & Asset Allocations)' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => { setQ3(opt.v); setAssessedResult(null); }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      q3 === opt.v ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#161B22] border-[#232B36] text-[#8B96A5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={calculateRisk}
            className="w-full py-2.5 rounded-xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] text-[#2DD4BF] font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calculate AI Risk Profile & Factor Attribution</span>
          </button>

          {/* Results Display */}
          {assessedResult && (
            <div className="p-5 bg-[#1C2530] border border-[#2DD4BF]/50 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
                <div>
                  <div className="text-[10px] font-mono text-[#8B96A5] uppercase">Evaluated Risk Score</div>
                  <div className="text-3xl font-bold text-[#2DD4BF] font-mono">{assessedResult.score}<span className="text-sm text-[#8B96A5]">/100</span></div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 font-mono">
                    {assessedResult.category}
                  </span>
                  <div className="text-[10px] text-[#8B96A5] font-mono mt-1">
                    Max Drawdown Tolerance: -{assessedResult.maxDrawdownTolerancePct}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#E5E7EB] font-display uppercase tracking-wider mb-2">
                  Plain-Language Factor Attribution
                </h4>
                <div className="space-y-2">
                  {assessedResult.factors.map((f: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-[#161B22] border border-[#232B36] rounded-lg text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-semibold text-[#E5E7EB]">
                        <span>{f.factor}</span>
                        <span className="text-[10px] font-mono text-[#2DD4BF]">{f.impact} IMPACT</span>
                      </div>
                      <p className="text-[11px] text-[#8B96A5]">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 mt-4"
          >
            <span>Save Profile & Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
};
