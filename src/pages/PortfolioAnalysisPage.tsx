import React from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { BarChart3, Calendar, TrendingUp, Layers } from 'lucide-react';

export const PortfolioAnalysisPage: React.FC = () => {
  const { activePortfolio, viewMode } = usePortfolioStore();
  const dailyHistory = portfolioStoreService.getDailyPerformanceHistory();

  if (!activePortfolio) return null;

  const winDays = dailyHistory.filter(d => d.status === 'WIN').length;
  const lossDays = dailyHistory.filter(d => d.status === 'LOSS').length;
  const winRate = ((winDays / dailyHistory.length) * 100).toFixed(1);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] font-bold">TRADEZELLA ANALYSIS SPEC</span>
              <span>•</span>
              <span>{activePortfolio.name}</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Portfolio Performance & Heatmap Analysis
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Daily win/loss calendar tracking, view-mode toggling (₹ / % / Risk-Adj), and asset class performance.
            </p>
          </div>
        </div>

        {/* Top Analysis Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="PORTFOLIO WIN RATE"
            value={`${winRate}%`}
            subtitle={`${winDays} Win Days vs ${lossDays} Loss Days`}
            badge="30-Day Window"
            accentColor="#22C55E"
          />
          <StatCard
            title="MAX DAILY GAIN"
            value="+2.45%"
            subtitle="₹18,450 peak single day return"
            badge="30-Day Peak"
            accentColor="#22C55E"
          />
          <StatCard
            title="MAX DAILY DRAWDOWN"
            value="-1.82%"
            subtitle="₹13,600 max single day loss"
            badge="Controlled"
            accentColor="#FB4B5C"
          />
          <StatCard
            title="SHARPE-ADJUSTED RETURN"
            value="1.84 Ratio"
            subtitle="Benchmark Nifty: 1.22 Ratio"
            badge="Risk-Adj"
            accentColor="#2DD4BF"
          />
        </div>

        {/* TradeZella Calendar Heatmap Grid */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#2DD4BF]" />
              <span>TradeZella Performance Calendar Heatmap</span>
            </div>
            <span className="text-xs font-mono text-[#8B96A5]">Active Mode: <strong className="text-[#2DD4BF]">{viewMode}</strong></span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2.5">
            {dailyHistory.map((day, idx) => {
              const isWin = day.status === 'WIN';
              const isLoss = day.status === 'LOSS';

              const displayVal = viewMode === 'PERCENTAGE'
                ? `${day.pnlPct > 0 ? '+' : ''}${day.pnlPct}%`
                : viewMode === 'RISK_ADJUSTED'
                ? `${(day.pnlPct / 12.8).toFixed(2)} R`
                : `₹${(day.pnlINR / 1000).toFixed(1)}k`;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all font-mono ${
                    isWin
                      ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                      : isLoss
                      ? 'bg-[#FB4B5C]/15 border-[#FB4B5C]/40 text-[#FB4B5C]'
                      : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
                  }`}
                >
                  <div className="text-[9px] text-[#8B96A5]">{day.date.slice(5)}</div>
                  <div className="text-xs font-bold mt-1">{displayVal}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
