import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { ShieldAlert, AlertTriangle, Activity, Zap, Info } from 'lucide-react';

export const PortfolioRiskPage: React.FC = () => {
  const { activePortfolio } = usePortfolioStore();
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
              Quantifies Value-at-Risk (VaR 95%), Expected Shortfall (CVaR), Herfindahl Concentration, and Macro Stress Scenarios.
            </p>
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
            subtitle="Peak-to-trough worst decline"
            badge="Tolerance: -22%"
            accentColor="#F5B841"
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
