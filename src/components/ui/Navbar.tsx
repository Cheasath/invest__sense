import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { ViewModeToggle } from './ViewModeToggle';
import { Search, ChevronDown, User, ShieldCheck, Zap, LogOut, Sliders } from 'lucide-react';
import { CURATED_UNIVERSE } from '../../services/mock/mockUniverse';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { portfolios, activePortfolio, setActivePortfolio } = usePortfolioStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPortfolioMenuOpen, setIsPortfolioMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredAssets = searchQuery.trim()
    ? CURATED_UNIVERSE.filter(a =>
        a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#0D1117]/90 backdrop-blur-md border-b border-[#232B36] px-4 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Portfolio Selector */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-[#0D1117] flex items-center justify-center font-bold text-[#0D1117] text-lg font-display shadow-md">
              IS
            </div>
            <span className="font-display font-bold text-lg text-[#E5E7EB] tracking-tight group-hover:text-[#2DD4BF] transition-colors">
              Invest<span className="text-[#2DD4BF]">Sense</span>
            </span>
          </Link>

          {/* Multi-portfolio Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPortfolioMenuOpen(!isPortfolioMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#232B36] hover:border-[#2DD4BF]/50 text-xs text-[#E5E7EB] font-medium transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="font-mono">{activePortfolio?.name || 'Main Portfolio'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B96A5]" />
            </button>

            {isPortfolioMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-[#161B22] border border-[#232B36] rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8B96A5] uppercase tracking-wider">
                  Select Active Portfolio
                </div>
                {portfolios.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePortfolio(p.id);
                      setIsPortfolioMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1C2530] transition-colors ${
                      p.id === activePortfolio?.id ? 'text-[#2DD4BF] font-semibold bg-[#1C2530]/50' : 'text-[#E5E7EB]'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="font-mono text-[11px] text-[#8B96A5]">₹{(p.totalValue / 100000).toFixed(1)}L</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8B96A5] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search NSE/BSE stocks, ETFs, Bonds, Gold (e.g. RELIANCE, NIFTYBEES)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-[#161B22] border border-[#232B36] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#E5E7EB] placeholder-[#8B96A5] focus:outline-none focus:border-[#2DD4BF] transition-all font-mono"
            />
          </div>

          {/* Quick Search Dropdown */}
          {isSearchOpen && filteredAssets.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-[#161B22] border border-[#232B36] rounded-xl shadow-2xl overflow-hidden z-50">
              {filteredAssets.map(asset => (
                <button
                  key={asset.symbol}
                  onClick={() => {
                    navigate(`/asset/${asset.symbol}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#1C2530] flex items-center justify-between text-xs border-b border-[#232B36]/50 last:border-0"
                >
                  <div>
                    <span className="font-mono font-bold text-[#E5E7EB]">{asset.symbol}</span>
                    <span className="text-[#8B96A5] ml-2 text-[11px]">{asset.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#232B36] text-[#2DD4BF] font-mono">
                    {asset.assetClass}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          {/* TradeZella View Mode Toggle */}
          <ViewModeToggle />

          {/* Quick Action Button */}
          <Link
            to="/simulator"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-semibold border border-[#2DD4BF]/30 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </Link>

          {/* User Profile / Admin Link */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-[#232B36] pl-3">
              <Link
                to="/settings"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-[#1C2530] border border-[#232B36] flex items-center justify-center text-xs font-bold text-[#2DD4BF]">
                  {user.name[0]}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium text-[#E5E7EB] leading-tight flex items-center gap-1">
                    {user.name}
                    {user.role === 'ADMIN' && (
                      <span className="text-[9px] px-1 bg-[#F5B841]/20 text-[#F5B841] font-mono font-bold rounded">ADMIN</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#8B96A5] font-mono">
                    {user.riskProfile?.category || 'Moderate Risk'}
                  </div>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg hover:bg-[#1C2530] text-[#8B96A5] hover:text-[#FB4B5C] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg bg-[#2DD4BF] text-[#0D1117] font-semibold text-xs hover:brightness-110 transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
