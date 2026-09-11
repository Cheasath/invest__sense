import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { generateFallbackQuote } from '../services/mock/mockUniverse';
import { useAuthStore } from '../store/useAuthStore';
import { useQuotes } from '../hooks/useQuotes';
import { Sparkles, ArrowUpRight, Plus, Sliders, Info, ShieldCheck, RefreshCw } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const userCategory = user?.riskProfile?.category || 'GROWTH';
  const recommendations = portfolioStoreService.generateRecommendations(userCategory);

  const symbols = recommendations.map(r => r.asset.symbol);
  const { quotes, isLoading, refetch } = useQuotes(symbols, 15000);

  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredRecs = filterType === 'ALL'
    ? recommendations
    : recommendations.filter(r => r.asset.assetClass === filterType);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <Sparkles className="w-4 h-4" />
              <span>Hybrid Suitability Scoring Model</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              AI Investment Recommendations
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Calibrated for <strong className="text-[#2DD4BF] font-mono">{userCategory}</strong> profile & max drawdown tolerance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#2DD4BF] hover:border-[#2DD4BF] transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Sync Prices'}</span>
            </button>
            <Link
              to="/settings"
              className="px-3.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#E5E7EB] hover:border-[#2DD4BF] transition-all flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Retake Risk Assessment</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['ALL', 'EQUITY', 'ETF', 'GOLD', 'BOND'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                filterType === cat
                  ? 'bg-[#2DD4BF] text-[#0D1117]'
                  : 'bg-[#161B22] text-[#8B96A5] hover:text-[#E5E7EB] border border-[#232B36]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recommendation Cards List */}
        <div className="space-y-4">
          {filteredRecs.map(rec => {
            const q = quotes[rec.asset.symbol] || generateFallbackQuote(rec.asset.symbol);
            const isUp = q.changePct >= 0;
            const curSym = rec.asset.currency === 'USD' ? '$' : '₹';

            return (
              <div
                key={rec.asset.symbol}
                className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 hover:border-[#232B36]/80 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232B36] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center font-bold font-mono text-[#2DD4BF] text-xl">
                      {rec.suitabilityScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/asset/${rec.asset.symbol}`} className="text-lg font-bold font-mono text-[#E5E7EB] hover:text-[#2DD4BF]">
                          {rec.asset.symbol}
                        </Link>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#232B36] text-[#2DD4BF]">
                          {rec.asset.assetClass}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E]">
                          +{rec.diversificationContribution}% Diversification
                        </span>
                      </div>
                      <div className="text-xs text-[#8B96A5]">{rec.asset.name} • {rec.asset.sector}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-[#E5E7EB] text-sm">
                        {curSym}{q.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[11px] font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                        {isUp ? '+' : ''}{q.changePct}%
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30">
                      {rec.recommendationType}
                    </span>
                    <Link
                      to={`/asset/${rec.asset.symbol}`}
                      className="px-4 py-2 rounded-xl bg-[#232B36] hover:bg-[#2DD4BF] hover:text-[#0D1117] text-[#E5E7EB] font-bold text-xs font-mono transition-all flex items-center gap-1"
                    >
                      <span>Inspect AI</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Reasoning */}
                <p className="text-xs text-[#E5E7EB] leading-relaxed bg-[#1C2530]/60 p-3 rounded-xl border border-[#232B36]">
                  <strong className="text-[#2DD4BF] font-mono uppercase mr-2">AI Reasoning:</strong>
                  {rec.reasoning}
                </p>

                {/* Factors Attribution Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  {rec.factors.map((f, idx) => (
                    <div key={idx} className="p-2.5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[#8B96A5]">
                        <span className="text-[10px]">{f.name}</span>
                        <span className="text-[#2DD4BF] font-bold">{f.score}/100</span>
                      </div>
                      <div className="text-[10px] text-[#8B96A5]">{f.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};
