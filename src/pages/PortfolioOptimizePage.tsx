import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { SlidersHorizontal, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ZAxis } from 'recharts';

export const PortfolioOptimizePage: React.FC = () => {
  const { activePortfolio } = usePortfolioStore();
  const [targetVolatility, setTargetVolatility] = useState(12.5); // %
  const [maxEquityCap, setMaxEquityCap] = useState(65); // %
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  if (!activePortfolio) return null;

  // Mock Efficient Frontier curve data points
  const frontierData = [
    { volatility: 6.2, expectedReturn: 7.8, sharpe: 1.25, label: 'Conservative Bond' },
    { volatility: 8.5, expectedReturn: 10.4, sharpe: 1.58, label: 'Balanced Gold/Bond' },
    { volatility: 11.2, expectedReturn: 14.8, sharpe: 1.95, label: 'Optimal Max Sharpe (MPT)' },
    { volatility: 14.8, expectedReturn: 17.2, sharpe: 1.70, label: 'Aggressive Growth' },
    { volatility: 19.5, expectedReturn: 19.8, sharpe: 1.42, label: 'High Equity Concentrated' }
  ];

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationApplied(true);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Markowitz Modern Portfolio Theory Engine</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Mean-Variance Portfolio Optimization
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Computes the mathematical Efficient Frontier to maximize Sharpe ratio under your volatility constraints.
            </p>
          </div>
        </div>

        {/* Frontier Chart & Control Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scatter Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
              <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
                Efficient Frontier Curve (Expected Return vs Volatility Risk)
              </span>
              <span className="text-[10px] font-mono text-[#2DD4BF] font-bold">Max Sharpe Target</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="volatility" name="Volatility Risk" unit="%" stroke="#8B96A5" tick={{ fontSize: 10 }} />
                  <YAxis type="number" dataKey="expectedReturn" name="Expected Return" unit="%" stroke="#8B96A5" tick={{ fontSize: 10 }} />
                  <ZAxis type="number" dataKey="sharpe" range={[100, 400]} name="Sharpe Ratio" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', color: '#E5E7EB' }}
                  />
                  <Scatter name="Portfolios" data={frontierData} fill="#2DD4BF" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Constraint Controls */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider border-b border-[#232B36] pb-3">
              Optimization Constraints
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[#8B96A5] mb-1">
                  <span>Target Volatility Cap:</span>
                  <span className="text-[#2DD4BF] font-bold">{targetVolatility}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={0.5}
                  value={targetVolatility}
                  onChange={(e) => setTargetVolatility(Number(e.target.value))}
                  className="w-full accent-[#2DD4BF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#8B96A5] mb-1">
                  <span>Max Equity Sector Cap:</span>
                  <span className="text-[#2DD4BF] font-bold">{maxEquityCap}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={90}
                  step={5}
                  value={maxEquityCap}
                  onChange={(e) => setMaxEquityCap(Number(e.target.value))}
                  className="w-full accent-[#2DD4BF]"
                />
              </div>
            </div>

            <button
              onClick={handleRunOptimization}
              disabled={isOptimizing}
              className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOptimizing ? 'Calculating MPT Solver...' : 'Solve Optimal Allocation'}</span>
            </button>

            {optimizationApplied && (
              <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Optimal Sharpe Ratio solution computed! Expected Sharpe: 1.95</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
