import React from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { CURATED_UNIVERSE } from '../services/mock/mockUniverse';
import { useQuotes } from '../hooks/useQuotes';
import { Star, ArrowUpRight, Trash2 } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { watchlist, toggleWatchlist } = usePortfolioStore();
  const { quotes } = useQuotes(watchlist, 15000);

  const watchedAssets = CURATED_UNIVERSE.filter(a => watchlist.includes(a.symbol));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5B841]">
              <Star className="w-4 h-4 fill-[#F5B841]" />
              <span>Starred Watchlist Tickers</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Investor Watchlist ({watchlist.length})
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Monitored securities with fast pricing updates and quick analysis links.
            </p>
          </div>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchedAssets.map(asset => {
            const q = quotes[asset.symbol] || { price: 1000, changePct: 0 };
            const isUp = q.changePct >= 0;

            return (
              <div key={asset.symbol} className="bg-[#161B22] border border-[#232B36] rounded-xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#232B36] pb-2">
                  <div>
                    <span className="font-bold text-[#E5E7EB] text-sm">{asset.symbol}</span>
                    <div className="text-[10px] text-[#8B96A5]">{asset.assetClass}</div>
                  </div>
                  <button
                    onClick={() => toggleWatchlist(asset.symbol)}
                    className="p-1.5 rounded-lg text-[#F5B841] hover:bg-[#1C2530]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-[#E5E7EB]">₹{q.price.toLocaleString('en-IN')}</div>
                    <div className={`text-[11px] font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                      {isUp ? '+' : ''}{q.changePct}%
                    </div>
                  </div>

                  <Link
                    to={`/asset/${asset.symbol}`}
                    className="px-3 py-1.5 rounded bg-[#232B36] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0D1117] font-bold transition-all inline-flex items-center gap-1"
                  >
                    <span>Analyze</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};
