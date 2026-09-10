import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Repeat, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export const PortfolioRebalancePage: React.FC = () => {
  const { activePortfolio } = usePortfolioStore();

  if (!activePortfolio) return null;

  const { holdings, totalValue } = activePortfolio;

  // Calculate drift per holding
  const rebalanceRows = holdings.map(h => {
    const driftPct = +(h.weightPct - h.targetWeightPct).toFixed(1);
    const targetValue = (h.targetWeightPct / 100) * totalValue;
    const valueDeltaINR = targetValue - h.currentValue;
    const shareDelta = Math.round(valueDeltaINR / h.currentPrice);
    const requiresAction = Math.abs(driftPct) >= 2.0;

    return {
      ...h,
      driftPct,
      targetValue,
      valueDeltaINR,
      shareDelta,
      requiresAction
    };
  });

  const totalActionsNeeded = rebalanceRows.filter(r => r.requiresAction).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <Repeat className="w-4 h-4" />
              <span>Target Allocation Drift Engine</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Portfolio Rebalancing & Re-alignment
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Identifies weight drift beyond tolerance threshold (±2.0%) and generates exact order quantities to realign.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
              totalActionsNeeded > 0
                ? 'bg-[#F5B841]/10 border-[#F5B841]/40 text-[#F5B841]'
                : 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
            }`}>
              {totalActionsNeeded > 0 ? `${totalActionsNeeded} Rebalance Adjustments Advised` : 'Allocation Aligned'}
            </span>
          </div>
        </div>

        {/* Rebalance Table */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
              Target Weight Drift Breakdown
            </h3>
            <span className="text-xs font-mono text-[#8B96A5]">Tolerance: ±2.0%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#1C2530] text-[#8B96A5] uppercase text-[10px]">
                  <th className="py-3 px-4 font-semibold">Holding / Class</th>
                  <th className="py-3 px-4 font-semibold text-right">Current Weight</th>
                  <th className="py-3 px-4 font-semibold text-right">Target Weight</th>
                  <th className="py-3 px-4 font-semibold text-right">Drift (%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Suggested Action</th>
                  <th className="py-3 px-4 font-semibold text-right">Share Adjustment</th>
                  <th className="py-3 px-4 font-semibold text-right">Value Delta (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B36]/60">
                {rebalanceRows.map(row => {
                  const isOverweight = row.driftPct > 0;
                  return (
                    <tr key={row.symbol} className="hover:bg-[#1C2530]/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#E5E7EB]">{row.symbol}</span>
                        <div className="text-[10px] text-[#8B96A5]">{row.assetClass}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">{row.weightPct}%</td>
                      <td className="py-3 px-4 text-right text-[#8B96A5]">{row.targetWeightPct}%</td>
                      <td className={`py-3 px-4 text-right font-bold ${row.requiresAction ? (isOverweight ? 'text-[#FB4B5C]' : 'text-[#F5B841]') : 'text-[#22C55E]'}`}>
                        {isOverweight ? '+' : ''}{row.driftPct}%
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          row.shareDelta < 0
                            ? 'bg-[#FB4B5C]/20 text-[#FB4B5C]'
                            : row.shareDelta > 0
                            ? 'bg-[#22C55E]/20 text-[#22C55E]'
                            : 'bg-[#232B36] text-[#8B96A5]'
                        }`}>
                          {row.shareDelta < 0 ? 'TRIM / SELL' : row.shareDelta > 0 ? 'ACCUMULATE / BUY' : 'HOLD'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">
                        {row.shareDelta > 0 ? '+' : ''}{row.shareDelta} Units
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">
                        {row.valueDeltaINR > 0 ? '+' : ''}₹{Math.round(row.valueDeltaINR).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Footer Button Disabled with Tooltip per Spec */}
          <div className="pt-4 border-t border-[#232B36] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8B96A5] font-mono">
              <Info className="w-4 h-4 text-[#2DD4BF] shrink-0" />
              <span>Decision-Support Mode: Order suggestions calculated client-side.</span>
            </div>

            <div className="relative group">
              <button
                disabled
                className="px-6 py-2.5 rounded-xl bg-[#232B36] text-[#8B96A5] font-bold text-xs cursor-not-allowed opacity-80 flex items-center gap-2 font-mono"
              >
                <span>Execute Automated Rebalance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-[#161B22] border border-[#232B36] rounded-xl text-[11px] text-[#2DD4BF] font-mono shadow-2xl z-50">
                Connects to broker API in a future release. InvestSense acts as decision-support platform.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
