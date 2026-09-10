import React, { useState } from 'react';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { History, Play, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const BacktestPage: React.FC = () => {
  const [strategy, setStrategy] = useState('InvestSense AI Growth');
  const backtest = portfolioStoreService.runBacktest(strategy);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <History className="w-4 h-4" />
              <span>Quantitative Strategy Engine</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Historical Backtesting & Benchmark Comparison
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Simulates portfolio strategy compounding vs Nifty 50 Index benchmark (Jan 2023 - Present).
            </p>
          </div>
        </div>

        {/* Backtest Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="STRATEGY CAGR"
            value={`${backtest.cagrPct}% p.a.`}
            subtitle={`Benchmark Nifty: ${backtest.benchmarkCagrPct}% p.a.`}
            badge="Annualized Return"
            accentColor="#22C55E"
          />
          <StatCard
            title="BACKTEST SHARPE RATIO"
            value={backtest.sharpeRatio}
            subtitle="Risk-adjusted outperformance"
            badge="Max Sharpe"
            accentColor="#2DD4BF"
          />
          <StatCard
            title="HISTORICAL MAX DRAWDOWN"
            value={`${backtest.maxDrawdownPct}%`}
            subtitle="Peak to trough decline"
            badge="Drawdown Shield"
            accentColor="#F5B841"
          />
          <StatCard
            title="FINAL SIMULATED CAPITAL"
            value={`₹${(backtest.finalCapital / 100000).toFixed(2)} Lakhs`}
            subtitle="Initial capital: ₹5.00 Lakhs"
            badge="Compound Growth"
          />
        </div>

        {/* Equity Curve Chart */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
              Simulated Equity Curve (Strategy vs Nifty 50)
            </span>
            <span className="text-[10px] font-mono text-[#8B96A5]">Jan 2023 - Aug 2026</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={backtest.equityCurve}>
                <XAxis dataKey="date" stroke="#8B96A5" tick={{ fontSize: 10 }} />
                <YAxis stroke="#8B96A5" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', color: '#E5E7EB' }} />
                <Legend />
                <Line type="monotone" dataKey="portfolioValue" name="AI Portfolio (INR)" stroke="#2DD4BF" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="benchmarkValue" name="Nifty 50 Index (INR)" stroke="#F5B841" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
