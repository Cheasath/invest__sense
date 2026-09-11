import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useQuotes } from '../hooks/useQuotes';
import { resolveAsset, generateFallbackQuote } from '../services/mock/mockUniverse';
import { getAssetFinancials, getAssetAnnualReports, getAssetResearchPapers } from '../services/mock/mockAssetFinancials';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { TradeModal } from '../components/portfolio/TradeModal';
import { AssetReportsAndFinancials } from '../components/asset/AssetReportsAndFinancials';
import {
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowLeft,
  RefreshCw,
  Wallet,
  Building2,
  Globe2,
  FileSpreadsheet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const symbol = (id || 'RELIANCE').toUpperCase();

  // Guarantees resolution for ANY searched asset (TradingView-style)
  const asset = resolveAsset(symbol);
  const symbols = useMemo(() => [symbol], [symbol]);
  const { quotes, isLoading, refetch } = useQuotes(symbols, 10000); // 10s poll
  const { watchlist, toggleWatchlist, activePortfolio } = usePortfolioStore();

  const fallback = generateFallbackQuote(symbol);
  const quote = quotes[symbol] || fallback;

  // Multi-year statements, reports, and papers
  const financials = useMemo(() => getAssetFinancials(symbol), [symbol]);
  const annualReports = useMemo(() => getAssetAnnualReports(symbol), [symbol]);
  const researchPapers = useMemo(() => getAssetResearchPapers(symbol), [symbol]);

  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    action: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    action: 'BUY'
  });

  const currentHolding = activePortfolio?.holdings.find(h => h.symbol === symbol);
  const isHolding = !!currentHolding;

  const isStarred = watchlist.includes(symbol);
  const isUp = quote.change >= 0;
  const currencySymbol = asset.currency === 'USD' ? '$' : '₹';

  // Calibrated historical chart series
  const chartData = useMemo(() => {
    const data = [];
    let basePrice = quote.prevClose * 0.94;
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const noise = Math.sin(i * 0.8) * (quote.price * 0.015);
      basePrice += (quote.price - basePrice) * 0.08 + noise;
      data.push({
        date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: +basePrice.toFixed(2)
      });
    }
    return data;
  }, [quote.price, quote.prevClose]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Back Navigation & Live Status */}
        <div className="flex items-center justify-between">
          <Link to="/home" className="inline-flex items-center gap-1.5 text-xs text-[#8B96A5] hover:text-[#2DD4BF] font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Market Universe
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-[#1C2530] border border-[#232B36] text-xs font-mono text-[#2DD4BF] hover:border-[#2DD4BF] transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Sync Price'}</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#232B36] text-[11px] font-mono text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>TradingView Live Feed</span>
            </div>
          </div>
        </div>

        {/* Main Header Card */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-bold font-mono text-[#E5E7EB]">{asset.symbol}</h1>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#232B36] text-[#2DD4BF]">
                {asset.exchange || 'NSE'}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#1C2530] text-[#E5E7EB]">
                {asset.assetClass}
              </span>
              <span className="text-xs text-[#8B96A5] font-mono flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#8B96A5]" />
                {asset.sector}
              </span>
              {asset.country && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2530] text-[#8B96A5] border border-[#232B36] flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  {asset.country}
                </span>
              )}
            </div>
            <p className="text-sm text-[#8B96A5] max-w-2xl">{asset.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
            <div className="text-right font-mono">
              <div className="text-3xl font-bold text-[#E5E7EB]">
                {currencySymbol}{quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                {isUp ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePct}%)
              </div>
            </div>

            <button
              id="btn-toggle-watchlist-detail"
              onClick={() => toggleWatchlist(symbol)}
              className={`p-3 rounded-xl border transition-all ${
                isStarred ? 'bg-[#F5B841]/10 border-[#F5B841] text-[#F5B841]' : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]'
              }`}
              title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-[#F5B841]' : ''}`} />
            </button>

            {isHolding ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-buy-more-detail"
                  type="button"
                  onClick={() => setTradeModal({ isOpen: true, action: 'BUY' })}
                  className="px-4 py-3 rounded-xl bg-[#22C55E] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-[#22C55E]/20 font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buy More</span>
                </button>
                <button
                  id="btn-sell-shares-detail"
                  type="button"
                  onClick={() => setTradeModal({ isOpen: true, action: 'SELL' })}
                  className="px-4 py-3 rounded-xl bg-[#FB4B5C]/15 border border-[#FB4B5C]/30 text-[#FB4B5C] font-bold text-xs hover:bg-[#FB4B5C] hover:text-white transition-all flex items-center gap-1.5 shadow-lg shadow-[#FB4B5C]/20 font-mono"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Sell Shares ({currentHolding.quantity})</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-add-to-portfolio-detail"
                type="button"
                onClick={() => setTradeModal({ isOpen: true, action: 'BUY' })}
                className="px-5 py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20 font-mono"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Portfolio</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Holding Banner if owned */}
        {isHolding && (
          <div className="p-4 bg-[#1C2530] border border-[#2DD4BF]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-[#E5E7EB]">
              <Wallet className="w-4 h-4 text-[#2DD4BF]" />
              <span>Currently in <strong>{activePortfolio?.name}</strong>: <strong className="text-[#2DD4BF]">{currentHolding.quantity} shares</strong> at avg <strong>₹{currentHolding.avgBuyPrice.toFixed(2)}</strong></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#8B96A5]">Current Position Value: <strong className="text-[#E5E7EB]">₹{currentHolding.currentValue.toLocaleString('en-IN')}</strong></span>
              <span className={`font-bold ${currentHolding.unrealizedPnL >= 0 ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                {currentHolding.unrealizedPnL >= 0 ? '+' : ''}₹{currentHolding.unrealizedPnL.toLocaleString('en-IN')} ({currentHolding.unrealizedPnLPct.toFixed(2)}%)
              </span>
            </div>
          </div>
        )}

        {/* Chart & Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
              <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
                30-Day Historical Price Trend ({currencySymbol})
              </span>
              <span className="text-[10px] text-[#8B96A5] font-mono">Exchange: {asset.exchange || 'NSE'}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#8B96A5" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#8B96A5" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', color: '#E5E7EB' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#2DD4BF" strokeWidth={2} fillOpacity={1} fill="url(#priceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider border-b border-[#232B36] pb-3">
              Instrument Metrics & Valuation
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">24h High / Low</span>
                <span className="text-[#E5E7EB]">{currencySymbol}{quote.high24h.toLocaleString('en-IN')} / {currencySymbol}{quote.low24h.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Previous Close</span>
                <span className="text-[#E5E7EB]">{currencySymbol}{quote.prevClose.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Market Beta</span>
                <span className="text-[#2DD4BF] font-bold">{asset.beta || '1.00'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">P/E Ratio</span>
                <span className="text-[#E5E7EB]">{asset.peRatio || '24.5'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Piotroski F-Score</span>
                <span className="text-[#22C55E] font-bold">{financials.piotroskiFScore} / 9</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Altman Z-Score</span>
                <span className="text-[#22C55E] font-bold">{financials.altmanZScore} (Safe)</span>
              </div>
            </div>
          </div>
        </div>

        {/* MULTI-YEAR FINANCIAL STATEMENTS, ANNUAL REPORTS & RESEARCH PAPERS SECTION */}
        <AssetReportsAndFinancials
          asset={asset}
          financials={financials}
          annualReports={annualReports}
          researchPapers={researchPapers}
        />

        {/* AI SUITABILITY & EXPLAINABILITY BREAKDOWN */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center font-bold font-mono text-[#2DD4BF] text-lg">
                88
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2DD4BF]" /> AI Suitability Score & Attribution
                </h3>
                <p className="text-xs text-[#8B96A5]">
                  Evaluates risk alignment, horizon compatibility, and diversification contribution against your Financial DNA baseline.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30">
              HIGH SUITABILITY
            </span>
          </div>

          <div className="p-4 bg-[#1C2530] border border-[#2DD4BF]/40 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#2DD4BF]">
              <span>Diversification Contribution: +14.2%</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2DD4BF]/20">Core Principle</span>
            </div>
            <p className="text-[#8B96A5] leading-relaxed italic">
              "A portfolio's risk isn't just about how risky each asset is on its own — it's about how those assets move relative to each other. Mixing categories that react differently to the same event smooths out the overall ride, because when one zigs, another often zags — without necessarily giving up expected return."
            </p>
          </div>
        </div>

        {/* Interactive Trade Modal */}
        <TradeModal
          isOpen={tradeModal.isOpen}
          onClose={() => setTradeModal(prev => ({ ...prev, isOpen: false }))}
          initialSymbol={symbol}
          initialAction={tradeModal.action}
        />
      </div>
    </AppShell>
  );
};
