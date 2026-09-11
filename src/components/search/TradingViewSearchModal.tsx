import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURATED_UNIVERSE, resolveAsset, generateFallbackQuote } from '../../services/mock/mockUniverse';
import { Asset, Quote } from '../../types';
import { Search, X, TrendingUp, TrendingDown, ArrowRight, Sparkles, Building2, Coins, Landmark, BarChart3, ShieldCheck } from 'lucide-react';

interface TradingViewSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type FilterCategory = 'ALL' | 'EQUITY' | 'ETF' | 'FUTURES_OPTIONS' | 'COMMODITY' | 'GOLD' | 'BOND';

export const TradingViewSearchModal: React.FC<TradingViewSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('ALL');
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Global hotkeys (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter universe based on query, category, and exchange
  const filteredAssets = useMemo(() => {
    const q = query.trim().toUpperCase();

    let list = CURATED_UNIVERSE.filter(asset => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'COMMODITY') {
          if (asset.assetClass !== 'COMMODITY' && asset.assetClass !== 'GOLD') return false;
        } else if (asset.assetClass !== selectedCategory) {
          return false;
        }
      }

      // Exchange filter
      if (selectedExchange !== 'ALL' && asset.exchange !== selectedExchange) {
        return false;
      }

      // Query filter
      if (!q) return true;
      return (
        asset.symbol.toUpperCase().includes(q) ||
        asset.name.toUpperCase().includes(q) ||
        (asset.sector && asset.sector.toUpperCase().includes(q))
      );
    });

    // If query is present and not matched exactly, ensure a synthetic option can be generated
    return list;
  }, [query, selectedCategory, selectedExchange]);

  // Handle navigation
  const handleSelectAsset = (symbol: string) => {
    onClose();
    navigate(`/asset/${symbol}`);
  };

  const handleDynamicResolve = () => {
    if (!query.trim()) return;
    const resolved = resolveAsset(query);
    onClose();
    navigate(`/asset/${resolved.symbol}`);
  };

  // Keyboard navigation within the list
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredAssets.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredAssets.length) {
        handleSelectAsset(filteredAssets[selectedIndex].symbol);
      } else if (query.trim()) {
        handleDynamicResolve();
      }
    }
  };

  if (!isOpen) return null;

  const categories: { key: FilterCategory; label: string; icon: any }[] = [
    { key: 'ALL', label: 'All', icon: Search },
    { key: 'EQUITY', label: 'Stocks', icon: Building2 },
    { key: 'ETF', label: 'Funds & ETFs', icon: BarChart3 },
    { key: 'FUTURES_OPTIONS', label: 'Indices', icon: TrendingUp },
    { key: 'COMMODITY', label: 'Commodities & Gold', icon: Coins },
    { key: 'BOND', label: 'Bonds & G-Sec', icon: Landmark }
  ];

  const exchanges = ['ALL', 'NSE', 'BSE', 'NASDAQ', 'MCX', 'BINANCE'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0D1117]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-[#161B22] border border-[#232B36] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TradingView Search Input Bar */}
        <div className="p-4 border-b border-[#232B36] flex items-center gap-3 bg-[#1C2530]/50">
          <Search className="w-5 h-5 text-[#2DD4BF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyNavigation}
            placeholder="Search symbols, stocks, ETFs, crypto, commodities (e.g. RELIANCE, NVDA, BTC, GOLD)..."
            className="w-full bg-transparent text-sm sm:text-base font-mono text-[#E5E7EB] placeholder-[#8B96A5] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#232B36]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[#8B96A5] bg-[#161B22] border border-[#232B36] rounded">
            ESC to close
          </kbd>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#232B36] overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSel = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => { setSelectedCategory(cat.key); setSelectedIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isSel
                      ? 'bg-[#2DD4BF] text-[#0D1117] font-bold shadow-sm'
                      : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Exchanges Selector */}
          <div className="hidden md:flex items-center gap-1 border-l border-[#232B36] pl-3 ml-2">
            {exchanges.map(ex => (
              <button
                key={ex}
                onClick={() => setSelectedExchange(ex)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  selectedExchange === ex
                    ? 'text-[#2DD4BF] font-bold bg-[#2DD4BF]/10'
                    : 'text-[#8B96A5] hover:text-[#E5E7EB]'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-[#232B36]/50">
          {filteredAssets.length > 0 ? (
            filteredAssets.slice(0, 30).map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const quote = generateFallbackQuote(asset.symbol);
              const isUp = quote.change >= 0;
              const currencySym = asset.currency === 'USD' ? '$' : '₹';

              return (
                <div
                  key={asset.symbol}
                  onClick={() => handleSelectAsset(asset.symbol)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-[#1C2530] border border-[#2DD4BF]/40' : 'hover:bg-[#1C2530]/60'
                  }`}
                >
                  {/* Left: Ticker & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#161B22] border border-[#232B36] flex items-center justify-center font-mono font-bold text-xs text-[#2DD4BF] shrink-0">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#E5E7EB]">{asset.symbol}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#232B36] text-[#8B96A5]">
                          {asset.exchange || 'NSE'}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C2530] text-[#2DD4BF]">
                          {asset.assetClass}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B96A5] truncate max-w-sm sm:max-w-md">
                        {asset.name} • <span className="text-[#64748B]">{asset.sector}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Live Quote & Direct Action */}
                  <div className="text-right font-mono shrink-0 pl-2">
                    <div className="text-sm font-bold text-[#E5E7EB]">
                      {currencySym}{quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs font-semibold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                      {isUp ? '+' : ''}{quote.changePct}%
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1C2530] border border-[#232B36] mx-auto flex items-center justify-center text-[#2DD4BF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-mono text-[#E5E7EB]">
                  Symbol not in standard curated list
                </h4>
                <p className="text-xs text-[#8B96A5] max-w-md mx-auto">
                  TradingView Universal Resolver is ready to dynamically synthesize quotes, multi-year financials, annual reports, and DCF models for <strong>"{query}"</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Symbol Resolver Fallback Card (Always available when typing) */}
          {query.trim().length > 0 && (
            <div
              onClick={handleDynamicResolve}
              className={`p-3.5 m-2 rounded-xl border border-dashed border-[#2DD4BF]/50 bg-[#2DD4BF]/5 hover:bg-[#2DD4BF]/10 cursor-pointer flex items-center justify-between transition-all ${
                selectedIndex === filteredAssets.length ? 'ring-2 ring-[#2DD4BF]' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="text-xs font-mono">
                  <span className="text-[#E5E7EB] font-bold">Open "{query.toUpperCase()}" on Live Feeds</span>
                  <span className="text-[#8B96A5] block sm:inline sm:ml-2">
                    Generate multi-year financials, company annual reports & research papers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2DD4BF]">
                <span>View Asset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2.5 bg-[#1C2530]/40 border-t border-[#232B36] flex items-center justify-between text-[11px] font-mono text-[#8B96A5]">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-[#161B22] px-1 py-0.5 rounded border border-[#232B36]">↑</kbd> <kbd className="bg-[#161B22] px-1 py-0.5 rounded border border-[#232B36]">↓</kbd> to navigate</span>
            <span><kbd className="bg-[#161B22] px-1 py-0.5 rounded border border-[#232B36]">↵</kbd> to select</span>
          </div>
          <span className="text-[#2DD4BF]">Institutional TradingView Feed</span>
        </div>
      </div>
    </div>
  );
};
