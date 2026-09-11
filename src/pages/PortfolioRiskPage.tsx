import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useFinancialDna } from '../hooks/useFinancialDna';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap, SlidersHorizontal, ArrowRight } from 'lucide-react';

export const PortfolioRiskPage: React.FC = () => {
  const { activePortfolio } = usePortfolioStore();
  const { financialDna } = useFinancialDna();
  const riskMetrics = portfolioStoreService.getRiskMetrics();

  const [activeScenario, setActiveScenario] = useState<string>('BASELINE');

  if (!activePortfolio) return null;

  // Stress test scenarios impact multipliers
  const scenarios = [
    { id: 'BASELINE', name: 'Normal Market Baseline', varImpact: '-1.82%', drawImpact: '-8.45%', estLossINR: 0 },
    { id: 'OIL_SHOCK', name: 'Geopolitical Oil Spike (+25%)', varImpact: '-3.45%', drawImpact: '-12.80%', estLossINR: 98000 },
    { id: 'INFLATION_SURGE', name: 'RBI Rate Hike (+100bps)', varImpact: '-2.90%', drawImpact: '-10.50%', estLossINR: 82000 },
    { id: 'TECH_CORRECTION', name: 'Global Tech Selloff (-15%)', varImpact: '-4.10%', drawImpact: '-15.20%', estLossINR: 118000 }
  ];

  const currentScenario = scenarios.find(s => s.id === activeScenario) || scenarios[0];

  // Compare actual max drawdown against Financial DNA tolerance limit
  const isDrawdownBreached = Math.abs(riskMetrics.maxDrawdownPct) > financialDna.maxPermittedDrawdownPct;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FB4B5C]">
              <ShieldAlert className="w-4 h-4" />
              <span className="px-2 py-0.5 rounded bg-[#FB4B5C]/20 text-[#FB4B5C] font-bold">TRADEZELLA RISK SPEC</span>
              <span>•</span>
              <span>Downside Tail Risk & Concentration</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Portfolio Risk Management & Stress Testing
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Quantifies Value-at-Risk (VaR 95%), Expected Shortfall (CVaR), Herfindahl Concentration, and Macro Stress Scenarios governed by your Financial DNA.
            </p>
          </div>

          {/* Connected Financial DNA Baseline Pill */}
          <Link
            to="/financial-dna"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] text-xs font-mono text-[#E5E7EB] transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
            <div>
              <div className="text-[10px] text-[#8B96A5]">Financial DNA Baseline</div>
              <div className="font-bold text-[#2DD4BF]">Budget: {financialDna.finalRiskBudget}/100</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#8B96A5] group-hover:translate-x-1 transition-transform ml-1" />
          </Link>
        </div>

        {/* FINANCIAL DNA GOVERNING RISK BOUNDS BANNER */}
        <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#2DD4BF] shrink-0" />
            <div>
              <span className="font-bold text-[#E5E7EB]">Governing DNA Risk Ceiling: </span>
              <span className="text-[#2DD4BF] font-bold">Max Permitted Drawdown -{financialDna.maxPermittedDrawdownPct}%</span>
              <span className="text-[#8B96A5] ml-2 hidden md:inline">
                (Target Volatility Cap: {financialDna.targetVolatilityCeilingPct}% • Max Equity: {financialDna.maxEquityAllocationPct}%)
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
            isDrawdownBreached
              ? 'bg-[#FB4B5C]/20 text-[#FB4B5C] border border-[#FB4B5C]/30'
              : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
          }`}>
            {isDrawdownBreached ? '⚠️ DNA Drawdown Limit Exceeded' : '✓ Compliant with DNA Risk Budget'}
          </div>
        </div>

        {/* TOP RISK SCORECARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="1-DAY VaR (95% CONFIDENCE)"
            value={`${riskMetrics.var95Pct}%`}
            subtitle="₹14,320 maximum expected 1-day loss"
            badge="Historical VaR"
            accentColor="#FB4B5C"
          />

          <StatCard
            title="EXPECTED SHORTFALL (CVaR 95%)"
            value={`${riskMetrics.cvar95Pct}%`}
            subtitle="Average loss when VaR is breached"
            badge="Tail Risk"
            accentColor="#FB4B5C"
          />

          <StatCard
            title="MAX HISTORICAL DRAWDOWN"
            value={`${riskMetrics.maxDrawdownPct}%`}
            subtitle={`DNA Bound: -${financialDna.maxPermittedDrawdownPct}%`}
            badge={`Tolerance: -${financialDna.maxPermittedDrawdownPct}%`}
            accentColor={isDrawdownBreached ? '#FB4B5C' : '#F5B841'}
          />

          <StatCard
            title="HHI CONCENTRATION INDEX"
            value={riskMetrics.hhiConcentrationIndex}
            subtitle="Top 3 sectors: 56.1% exposure"
            badge="Well Diversified"
            accentColor="#2DD4BF"
          />
        </div>

        {/* INTERACTIVE STRESS TEST SIMULATOR WIDGET */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#F5B841]" />
              <span>Macro Scenario Stress-Test Engine</span>
            </div>
            <span className="text-xs font-mono text-[#8B96A5]">Simulation Mode</span>
          </div>

          {/* Scenario Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={`p-3 rounded-xl border text-left transition-all font-mono ${
                  activeScenario === sc.id
                    ? 'bg-[#F5B841]/10 border-[#F5B841] text-[#E5E7EB]'
                    : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5] hover:border-[#8B96A5]'
                }`}
              >
                <div className="text-xs font-bold text-[#E5E7EB]">{sc.name}</div>
                <div className="text-[10px] text-[#8B96A5] mt-1">
                  Est. Impact: <span className="text-[#FB4B5C] font-bold">{sc.varImpact}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Scenario Impact Result Panel */}
          <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-2 font-bold text-[#E5E7EB]">
              <span>Active Stress Model: {currentScenario.name}</span>
              <span className="text-[#FB4B5C]">Estimated Capital Drawdown: ₹{currentScenario.estLossINR.toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-[#161B22] rounded-lg">
                <span className="text-[#8B96A5]">Stressed 1-Day VaR:</span>
                <div className="text-base font-bold text-[#FB4B5C]">{currentScenario.varImpact}</div>
              </div>
              <div className="p-2.5 bg-[#161B22] rounded-lg">
                <span className="text-[#8B96A5]">Stressed Peak Drawdown:</span>
                <div className="text-base font-bold text-[#F5B841]">{currentScenario.drawImpact}</div>
              </div>
              <div className="p-2.5 bg-[#161B22] rounded-lg">
                <span className="text-[#8B96A5]">Downside Capital Buffer:</span>
                <div className="text-base font-bold text-[#22C55E]">ADEQUATE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
