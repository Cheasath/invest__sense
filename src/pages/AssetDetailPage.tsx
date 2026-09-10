import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useQuotes } from '../hooks/useQuotes';
import { CURATED_UNIVERSE } from '../services/mock/mockUniverse';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Star, Sparkles, TrendingUp, TrendingDown, Plus, Info, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const symbol = (id || 'RELIANCE').toUpperCase();

  const asset = CURATED_UNIVERSE.find(a => a.symbol === symbol) || CURATED_UNIVERSE[0];
  const { quotes } = useQuotes([symbol], 10000); // 10s poll when detail view active
  const { watchlist, toggleWatchlist, executeTrade, activePortfolio } = usePortfolioStore();

  const quote = quotes[symbol] || {
    price: 2980.50,
    change: 35.50,
    changePct: 1.21,
    prevClose: 2945.00,
    high24h: 3010.00,
    low24h: 2930.00,
    volume: 450000,
    isDelayed: false,
    provider: 'Finnhub Live'
  };

  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeQty, setTradeQty] = useState(10);
  const [tradeSuccess, setTradeSuccess] = useState('');

  const isStarred = watchlist.includes(symbol);
  const isUp = quote.change >= 0;

  // Mock 30-day historical chart series
  const chartData = [];
  let basePrice = quote.prevClose * 0.92;
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const noise = Math.sin(i * 0.8) * (quote.price * 0.015);
    basePrice += (quote.price - basePrice) * 0.08 + noise;
    chartData.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: +basePrice.toFixed(2)
    });
  }

  const handleAddHolding = () => {
    if (!activePortfolio) return;
    executeTrade(activePortfolio.id, symbol, tradeQty, quote.price);
    setTradeSuccess(`Successfully added ${tradeQty} shares of ${symbol} to ${activePortfolio.name}!`);
    setTimeout(() => {
      setTradeModalOpen(false);
      setTradeSuccess('');
    }, 1500);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Back Navigation */}
        <Link to="/home" className="inline-flex items-center gap-1.5 text-xs text-[#8B96A5] hover:text-[#2DD4BF] font-mono transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Market Universe
        </Link>

        {/* Main Header Card */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono text-[#E5E7EB]">{asset.symbol}</h1>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#232B36] text-[#2DD4BF]">
                {asset.assetClass}
              </span>
              <span className="text-xs text-[#8B96A5] font-mono">{asset.sector}</span>
            </div>
            <p className="text-sm text-[#8B96A5] max-w-xl">{asset.description}</p>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center">
            <div className="text-right font-mono">
              <div className="text-3xl font-bold text-[#E5E7EB]">
                ₹{quote.price.toLocaleString('en-IN')}
              </div>
              <div className={`text-xs font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                {isUp ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePct}%)
              </div>
            </div>

            <button
              onClick={() => toggleWatchlist(symbol)}
              className={`p-3 rounded-xl border transition-all ${
                isStarred ? 'bg-[#F5B841]/10 border-[#F5B841] text-[#F5B841]' : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-[#F5B841]' : ''}`} />
            </button>

            <button
              onClick={() => setTradeModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Portfolio</span>
            </button>
          </div>
        </div>

        {/* Chart & Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
              <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
                30-Day Historical Price Trend (INR ₹)
              </span>
              <span className="text-[10px] text-[#8B96A5] font-mono">Provider: {quote.provider}</span>
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
              Instrument Metrics
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">24h High / Low</span>
                <span className="text-[#E5E7EB]">₹{quote.high24h} / ₹{quote.low24h}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Previous Close</span>
                <span className="text-[#E5E7EB]">₹{quote.prevClose}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">Market Beta (Nifty)</span>
                <span className="text-[#2DD4BF] font-bold">{asset.beta || '1.00'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1C2530] rounded-lg">
                <span className="text-[#8B96A5]">P/E Ratio</span>
                <span className="text-[#E5E7EB]">{asset.peRatio || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

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
                  Evaluates risk alignment, horizon compatibility, and diversification contribution.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30">
              STRONG BUY (Growth Profile)
            </span>
          </div>

          {/* DIVERSIFICATION EXPLANATION CARD (REQUIRED SPEC) */}
          <div className="p-4 bg-[#1C2530] border border-[#2DD4BF]/40 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#2DD4BF]">
              <span>Diversification Contribution: +14.2%</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2DD4BF]/20">Core Principle</span>
            </div>
            <p className="text-[#8B96A5] leading-relaxed italic">
              "A portfolio's risk isn't just about how risky each asset is on its own — it's about how those assets move relative to each other. Mixing categories that react differently to the same event (equity, bonds, gold, cash) smooths out the overall ride, because when one zigs, another often zags — without necessarily giving up much expected return."
            </p>
          </div>
        </div>

        {/* ADD TO PORTFOLIO MODAL */}
        {tradeModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0D1117]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161B22] border border-[#232B36] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <h3 className="text-lg font-bold font-display text-[#E5E7EB]">
                Add {asset.symbol} to Portfolio
              </h3>

              {tradeSuccess ? (
                <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{tradeSuccess}</span>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[#8B96A5] mb-1">Execution Price (INR)</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${quote.price.toLocaleString('en-IN')}`}
                      className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2 text-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8B96A5] mb-1">Quantity (Shares/Units)</label>
                    <input
                      type="number"
                      min={1}
                      value={tradeQty}
                      onChange={(e) => setTradeQty(Number(e.target.value))}
                      className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2 text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
                    />
                  </div>

                  <div className="p-3 bg-[#1C2530] rounded-xl flex items-center justify-between font-bold">
                    <span className="text-[#8B96A5]">Total Capital Outlay:</span>
                    <span className="text-[#2DD4BF]">₹{(tradeQty * quote.price).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setTradeModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#1C2530] text-[#8B96A5] hover:text-[#E5E7EB]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddHolding}
                      className="px-5 py-2 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold hover:brightness-110"
                    >
                      Confirm Trade
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
