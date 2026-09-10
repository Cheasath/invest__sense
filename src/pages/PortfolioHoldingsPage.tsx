import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { PieChart, ArrowUpRight, Plus, RefreshCw, Layers } from 'lucide-react';

export const PortfolioHoldingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activePortfolio, viewMode } = usePortfolioStore();

  if (!activePortfolio) return null;

  const { holdings, totalValue, totalPnL, totalPnLPct, dayPnL, dayPnLPct, cashBalance } = activePortfolio;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#161B22] border border-[#232B36] rounded-2xl p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <PieChart className="w-4 h-4" />
              <span>Portfolio Holdings & Capital Distribution</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              {activePortfolio.name}
            </h1>
            <p className="text-xs text-[#8B96A5]">{activePortfolio.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/portfolio/${activePortfolio.id}/rebalance`}
              className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 font-mono shadow-lg shadow-[#2DD4BF]/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebalance Allocation</span>
            </Link>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="TOTAL CAPITAL VALUE"
            value={`₹${totalValue.toLocaleString('en-IN')}`}
            change={`${dayPnLPct >= 0 ? '+' : ''}${dayPnLPct}% Today`}
            isPositive={dayPnLPct >= 0}
            isNegative={dayPnLPct < 0}
          />
          <StatCard
            title="TOTAL UNREALIZED RETURN"
            value={`₹${totalPnL.toLocaleString('en-IN')}`}
            change={`${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct}%`}
            isPositive={totalPnL >= 0}
            isNegative={totalPnL < 0}
            accentColor={totalPnL >= 0 ? '#22C55E' : '#FB4B5C'}
          />
          <StatCard
            title="UNINVESTED CASH BALANCE"
            value={`₹${cashBalance.toLocaleString('en-IN')}`}
            subtitle="Ready for opportunistic rebalancing"
            badge="Liquid"
          />
        </div>

        {/* Holdings Table */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
              Asset Allocation Holdings ({holdings.length})
            </h3>
            <span className="text-xs font-mono text-[#8B96A5]">Currency: INR (₹)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#1C2530] text-[#8B96A5] uppercase text-[10px]">
                  <th className="py-3 px-4 font-semibold">Asset / Class</th>
                  <th className="py-3 px-4 font-semibold text-right">Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Avg Buy Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Current Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Current Value</th>
                  <th className="py-3 px-4 font-semibold text-right">Current / Target Weight</th>
                  <th className="py-3 px-4 font-semibold text-right">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B36]/60">
                {holdings.map(h => {
                  const isUp = h.unrealizedPnL >= 0;
                  return (
                    <tr key={h.symbol} className="hover:bg-[#1C2530]/40 transition-colors">
                      <td className="py-3 px-4">
                        <Link to={`/asset/${h.symbol}`} className="font-bold text-[#E5E7EB] hover:text-[#2DD4BF]">
                          {h.symbol}
                        </Link>
                        <div className="text-[10px] text-[#8B96A5]">{h.name} • {h.assetClass}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-[#E5E7EB]">{h.quantity}</td>
                      <td className="py-3 px-4 text-right text-[#8B96A5]">₹{h.avgBuyPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">₹{h.currentPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">₹{h.currentValue.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[#2DD4BF] font-bold">{h.weightPct}%</span>
                        <span className="text-[#8B96A5] text-[10px] ml-1">({h.targetWeightPct}%)</span>
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                        {isUp ? '+' : ''}₹{h.unrealizedPnL.toLocaleString('en-IN')} ({h.unrealizedPnLPct.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
