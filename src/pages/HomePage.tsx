import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useQuotes } from '../hooks/useQuotes';
import { CURATED_UNIVERSE } from '../services/mock/mockUniverse';
import { TrendingUp, TrendingDown, Layers, Activity, Globe, Star, ArrowUpRight } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';

export const HomePage: React.FC = () => {
  const symbols = CURATED_UNIVERSE.map(a => a.symbol);
  const { quotes, isLoading, containerRef } = useQuotes(symbols, 20000); // 20s tiered poll
  const { watchlist, toggleWatchlist } = usePortfolioStore();

  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');

  const assetsWithQuotes = CURATED_UNIVERSE.map(a => {
    const q = quotes[a.symbol] || {
      price: 1000,
      change: 12,
      changePct: 1.2,
      prevClose: 988,
      isDelayed: true,
      provider: 'InvestSense Cache'
    };
    return { ...a, quote: q };
  });

  const filteredAssets = selectedAssetClass === 'ALL'
    ? assetsWithQuotes
    : assetsWithQuotes.filter(a => a.assetClass === selectedAssetClass);

  // Top gainers and losers
  const sortedByChange = [...assetsWithQuotes].sort((a, b) => b.quote.changePct - a.quote.changePct);
  const topGainers = sortedByChange.slice(0, 5);
  const topLosers = sortedByChange.slice(-5).reverse();

  return (
    <AppShell>
      <div ref={containerRef} className="space-y-6">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#161B22] border border-[#232B36] rounded-2xl p-5 md:p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <Globe className="w-4 h-4" />
              <span>India Market Universe (NSE / BSE / RBI Gold)</span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Investment Universe & Trading Tickers
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Real-time quotes with rate-limited fallback provider chain (Finnhub • TwelveData • FMP • EOD)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#1C2530] border border-[#232B36] text-[#E5E7EB]">
              Nifty 50: <span className="text-[#22C55E] font-bold">24,450.20 (+0.82%)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#1C2530] border border-[#232B36] text-[#E5E7EB]">
              Nifty Bank: <span className="text-[#22C55E] font-bold">51,200.00 (+0.68%)</span>
            </div>
          </div>
        </div>

        {/* Top Gainers & Losers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Gainers */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-2">
              <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1.5 uppercase tracking-wide font-mono">
                <TrendingUp className="w-4 h-4" /> Top Market Gainers
              </span>
              <span className="text-[10px] text-[#8B96A5] font-mono">24h Change</span>
            </div>
            <div className="space-y-2">
              {topGainers.map(item => (
                <Link
                  key={item.symbol}
                  to={`/asset/${item.symbol}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#1C2530]/60 hover:bg-[#1C2530] border border-[#232B36] transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E5E7EB]">{item.symbol}</span>
                    <span className="text-[11px] text-[#8B96A5] hidden sm:inline">{item.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-[#E5E7EB]">₹{item.quote.price.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-[#22C55E] font-semibold">+{item.quote.changePct}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232B36] pb-2">
              <span className="text-xs font-bold text-[#FB4B5C] flex items-center gap-1.5 uppercase tracking-wide font-mono">
                <TrendingDown className="w-4 h-4" /> Top Market Lagging
              </span>
              <span className="text-[10px] text-[#8B96A5] font-mono">24h Change</span>
            </div>
            <div className="space-y-2">
              {topLosers.map(item => (
                <Link
                  key={item.symbol}
                  to={`/asset/${item.symbol}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#1C2530]/60 hover:bg-[#1C2530] border border-[#232B36] transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E5E7EB]">{item.symbol}</span>
                    <span className="text-[11px] text-[#8B96A5] hidden sm:inline">{item.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-[#E5E7EB]">₹{item.quote.price.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-[#FB4B5C] font-semibold">{item.quote.changePct}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Class Filter Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 bg-[#161B22] p-1 border border-[#232B36] rounded-xl text-xs">
            {['ALL', 'EQUITY', 'ETF', 'MUTUAL_FUND', 'BOND', 'GOLD', 'CASH', 'FUTURES_OPTIONS'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedAssetClass(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  selectedAssetClass === cat
                    ? 'bg-[#2DD4BF] text-[#0D1117]'
                    : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530]'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#8B96A5] font-mono shrink-0">
            Showing {filteredAssets.length} Assets
          </span>
        </div>

        {/* Main Universe Table */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1C2530] border-b border-[#232B36] text-[#8B96A5] uppercase font-mono text-[10px]">
                  <th className="py-3 px-4 font-semibold">Asset / Symbol</th>
                  <th className="py-3 px-4 font-semibold">Category & Sector</th>
                  <th className="py-3 px-4 font-semibold text-right">Price (INR ₹)</th>
                  <th className="py-3 px-4 font-semibold text-right">24h Change</th>
                  <th className="py-3 px-4 font-semibold text-right">Beta / Yield</th>
                  <th className="py-3 px-4 font-semibold text-center">Watchlist</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B36]/60">
                {filteredAssets.map(item => {
                  const isStarred = watchlist.includes(item.symbol);
                  const isUp = item.quote.change >= 0;

                  return (
                    <tr key={item.symbol} className="hover:bg-[#1C2530]/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link to={`/asset/${item.symbol}`} className="block group">
                          <div className="font-mono font-bold text-[#E5E7EB] group-hover:text-[#2DD4BF] transition-colors flex items-center gap-1.5">
                            <span>{item.symbol}</span>
                            {item.quote.isDelayed && (
                              <span className="text-[9px] px-1 bg-[#232B36] text-[#F5B841] rounded">Delayed</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8B96A5] truncate max-w-[200px]">{item.name}</div>
                        </Link>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#232B36] text-[#2DD4BF] font-semibold mr-2">
                          {item.assetClass}
                        </span>
                        <span className="text-[#8B96A5] text-[11px]">{item.sector}</span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#E5E7EB]">
                        ₹{item.quote.price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${isUp ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#FB4B5C] bg-[#FB4B5C]/10'}`}>
                          {isUp ? '+' : ''}{item.quote.changePct}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#8B96A5]">
                        {item.beta ? `β ${item.beta}` : item.yieldPct ? `${item.yieldPct}% Yield` : '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleWatchlist(item.symbol)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isStarred ? 'text-[#F5B841] bg-[#F5B841]/10' : 'text-[#8B96A5] hover:text-[#E5E7EB]'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isStarred ? 'fill-[#F5B841]' : ''}`} />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Link
                          to={`/asset/${item.symbol}`}
                          className="px-2.5 py-1 rounded bg-[#232B36] hover:bg-[#2DD4BF] hover:text-[#0D1117] text-[#E5E7EB] font-semibold text-[11px] transition-all inline-flex items-center gap-1 font-mono"
                        >
                          <span>Analyze</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
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
