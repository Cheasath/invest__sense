import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useQuotes } from '../hooks/useQuotes';
import { TradeModal } from '../components/portfolio/TradeModal';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { Activity, ShieldCheck, PieChart, ArrowUpRight, AlertTriangle, Calendar, Sliders, RefreshCw, Plus, TrendingDown } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { activePortfolio, viewMode } = usePortfolioStore();
  const performanceHistory = portfolioStoreService.getDailyPerformanceHistory();

  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    symbol: string;
    action: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    symbol: 'RELIANCE',
    action: 'BUY'
  });

  const holdingSymbols = useMemo(() => {
    return (activePortfolio?.holdings || []).map(h => h.symbol);
  }, [activePortfolio?.holdings]);
  const { quotes, isLoading, refetch } = useQuotes(holdingSymbols, 15000);

  if (!activePortfolio) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px] text-xs font-mono text-[#8B96A5]">
          <div className="flex items-center gap-3 bg-[#161B22] border border-[#232B36] p-6 rounded-2xl">
            <RefreshCw className="w-5 h-5 text-[#2DD4BF] animate-spin" />
            <span>Loading investment portfolio...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  const { healthScore, holdings, totalValue, totalPnL, totalPnLPct, dayPnL, dayPnLPct } = activePortfolio;

  // View mode formatting helpers
  const formatVal = (numINR: number, pct: number) => {
    if (viewMode === 'PERCENTAGE') {
      return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
    }
    if (viewMode === 'RISK_ADJUSTED') {
      const sharpeAdj = (pct / 12.8).toFixed(2);
      return `${sharpeAdj} Sharpe-Adj`;
    }
    return `₹${numINR.toLocaleString('en-IN')}`;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* TradeZella Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#161B22] border border-[#232B36] rounded-2xl p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] font-bold">TRADEZELLA DENSE SPEC</span>
              <span>•</span>
              <span>{activePortfolio.name}</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Investor Decision Dashboard
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Composite health monitoring, risk-adjusted performance heatmap, and allocation drift alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/portfolio/${activePortfolio.id}/rebalance`}
              className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Rebalance Check</span>
            </Link>
          </div>
        </div>

        {/* TOP STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL PORTFOLIO VALUE"
            value={formatVal(totalValue, totalPnLPct)}
            change={`${dayPnLPct >= 0 ? '+' : ''}${dayPnLPct}% Today`}
            isPositive={dayPnLPct >= 0}
            isNegative={dayPnLPct < 0}
            subtitle="Combined liquid assets & cash balance"
            badge={viewMode}
          />

          <StatCard
            title="TOTAL UNREALIZED P&L"
            value={formatVal(totalPnL, totalPnLPct)}
            change={`${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct}%`}
            isPositive={totalPnL >= 0}
            isNegative={totalPnL < 0}
            subtitle="Overall return across current holdings"
            accentColor={totalPnL >= 0 ? '#22C55E' : '#FB4B5C'}
          />

          <StatCard
            title="HEALTH SCORE (0-100)"
            value={`${healthScore.compositeScore} / 100`}
            subtitle={`Status: ${healthScore.status}`}
            badge="Composite"
            accentColor="#F5B841"
          />

          <StatCard
            title="DIVERSIFICATION SCORE"
            value={`${healthScore.diversificationScore} / 100`}
            subtitle="Herfindahl Index: Low Sector Risk"
            badge="HHI Method"
            accentColor="#2DD4BF"
          />
        </div>

        {/* TRADEZELLA COMPOSITE HEALTH SCORE WIDGET */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5B841]/10 border border-[#F5B841]/30 flex items-center justify-center font-bold font-mono text-[#F5B841] text-lg">
                {healthScore.compositeScore}
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
                  Portfolio Health Score Breakdown
                </h3>
                <p className="text-xs text-[#8B96A5]">
                  Blends Diversification + Risk-Category Alignment + Allocation Drift Status
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
              {healthScore.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <div className="text-[#8B96A5]">DIVERSIFICATION SCORE</div>
              <div className="text-lg font-bold text-[#2DD4BF]">{healthScore.diversificationScore}%</div>
              <div className="text-[10px] text-[#8B96A5]">Cross-asset concentration index</div>
            </div>

            <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <div className="text-[#8B96A5]">RISK ALIGNMENT SCORE</div>
              <div className="text-lg font-bold text-[#22C55E]">{healthScore.riskAlignmentScore}%</div>
              <div className="text-[10px] text-[#8B96A5]">Target volatility vs profile</div>
            </div>

            <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <div className="text-[#8B96A5]">DRIFT STATUS SCORE</div>
              <div className="text-lg font-bold text-[#F5B841]">{healthScore.driftScore}%</div>
              <div className="text-[10px] text-[#8B96A5]">Weight deviation vs target</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-semibold text-[#E5E7EB] font-display uppercase tracking-wider">
              AI Decision Insights:
            </div>
            <div className="space-y-1 text-xs text-[#8B96A5]">
              {healthScore.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#2DD4BF] font-mono">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRADEZELLA CALENDAR PERFORMANCE HEATMAP */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#2DD4BF]" />
              <span>TradeZella Performance Heatmap Calendar (Past 30 Trading Days)</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#8B96A5]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#22C55E]" /> Gain</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#FB4B5C]" /> Loss</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#232B36]" /> Breakeven</span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
            {performanceHistory.slice(0, 30).map((day, idx) => {
              const isWin = day.status === 'WIN';
              const isLoss = day.status === 'LOSS';

              return (
                <div
                  key={idx}
                  title={`${day.date}: ${day.pnlPct >= 0 ? '+' : ''}${day.pnlPct}% (₹${day.pnlINR.toLocaleString('en-IN')})`}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-mono ${
                    isWin
                      ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                      : isLoss
                      ? 'bg-[#FB4B5C]/15 border-[#FB4B5C]/40 text-[#FB4B5C]'
                      : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
                  }`}
                >
                  <div className="text-[9px] text-[#8B96A5]">{day.date.slice(8)}</div>
                  <div className="text-xs font-bold mt-0.5">
                    {day.pnlPct > 0 ? `+${day.pnlPct}%` : `${day.pnlPct}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP HOLDINGS & ALERTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Table (2 Cols) */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
              <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
                Current Holdings ({holdings.length})
              </h3>
              <Link to={`/portfolio/${activePortfolio.id}`} className="text-xs text-[#2DD4BF] font-semibold hover:underline flex items-center gap-1 font-mono">
                View Full Holdings <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1C2530] text-[#8B96A5] uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">Asset</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Live Price</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Value (INR)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Weight / Target</th>
                    <th className="py-2.5 px-3 font-semibold text-right">P&L</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Trade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232B36]/60">
                  {holdings.map(h => {
                    const isUp = h.unrealizedPnL >= 0;
                    const liveP = quotes[h.symbol]?.price || h.currentPrice;
                    return (
                      <tr key={h.symbol} className="hover:bg-[#1C2530]/40 font-mono">
                        <td className="py-2.5 px-3">
                          <Link to={`/asset/${h.symbol}`} className="font-bold text-[#E5E7EB] hover:text-[#2DD4BF]">
                            {h.symbol}
                          </Link>
                          <div className="text-[10px] text-[#8B96A5]">{h.assetClass}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#E5E7EB] font-bold">{h.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-[#2DD4BF] font-semibold">
                          ₹{liveP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#E5E7EB]">
                          ₹{h.currentValue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[#2DD4BF] font-bold">{h.weightPct}%</span>
                          <span className="text-[#8B96A5] text-[10px] ml-1">({h.targetWeightPct}%)</span>
                        </td>
                        <td className={`py-2.5 px-3 text-right font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                          {isUp ? '+' : ''}{h.unrealizedPnLPct.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setTradeModal({ isOpen: true, symbol: h.symbol, action: 'BUY' })}
                              className="px-2 py-0.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0D1117] text-[10px] font-bold transition-all flex items-center gap-0.5"
                              title={`Buy more ${h.symbol}`}
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Buy</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTradeModal({ isOpen: true, symbol: h.symbol, action: 'SELL' })}
                              className="px-2 py-0.5 rounded bg-[#FB4B5C]/15 border border-[#FB4B5C]/30 text-[#FB4B5C] hover:bg-[#FB4B5C] hover:text-white text-[10px] font-bold transition-all flex items-center gap-0.5"
                              title={`Sell ${h.symbol}`}
                            >
                              <TrendingDown className="w-2.5 h-2.5" />
                              <span>Sell</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action Alerts Panel */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider border-b border-[#232B36] pb-3">
              Rebalance & Drift Alerts
            </h3>

            <div className="p-3 bg-[#1C2530] border border-[#F5B841]/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5B841]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>TCS Allocation Drift (+4.0%)</span>
              </div>
              <p className="text-[11px] text-[#8B96A5] leading-relaxed">
                TCS current weight is 19.0% vs target weight of 15.0%. Trimming 8 shares aligns sector exposure.
              </p>
              <Link
                to={`/portfolio/${activePortfolio.id}/rebalance`}
                className="inline-block text-[11px] font-mono text-[#2DD4BF] font-semibold hover:underline mt-1"
              >
                Execute Rebalance Engine →
              </Link>
            </div>

            <div className="p-3 bg-[#1C2530] border border-[#2DD4BF]/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2DD4BF]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Risk Capacity Normal</span>
              </div>
              <p className="text-[11px] text-[#8B96A5]">
                Portfolio Value at Risk (1-day VaR 95%) is -1.82%, well within your max drawdown tolerance of -22%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal with "How Many Shares" confirmation pop up */}
      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal(prev => ({ ...prev, isOpen: false }))}
        initialSymbol={tradeModal.symbol}
        initialAction={tradeModal.action}
      />
    </AppShell>
  );
};
