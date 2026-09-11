import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useQuotes } from '../hooks/useQuotes';
import { TradeModal } from '../components/portfolio/TradeModal';
import { AssetHistoryModal } from '../components/portfolio/AssetHistoryModal';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';
import { AssetHoldingLifecycle, AssetTransaction } from '../types';
import { 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  RefreshCw, 
  Layers, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Calendar,
  Wallet,
  ArrowRight,
  Sparkles
} from 'lucide-react';

type HoldingsTab = 'HOLDINGS' | 'TRANSACTIONS' | 'LIFECYCLES';

export const PortfolioHoldingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activePortfolio, viewMode } = usePortfolioStore();

  const [activeTab, setActiveTab] = useState<HoldingsTab>('HOLDINGS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetFilter, setSelectedAssetFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'VALUE_HIGH'>('NEWEST');

  // Trade Modal State
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    symbol: string;
    action: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    symbol: 'RELIANCE',
    action: 'BUY'
  });

  // Dedicated Asset History Modal State
  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean;
    lifecycle: AssetHoldingLifecycle | null;
  }>({
    isOpen: false,
    lifecycle: null
  });

  const holdingSymbols = useMemo(() => {
    return (activePortfolio?.holdings || []).map(h => h.symbol);
  }, [activePortfolio?.holdings]);

  const { quotes, isLoading, refetch } = useQuotes(holdingSymbols, 15000);

  // Derive asset lifecycles and transactions
  const lifecycles = useMemo(() => {
    if (!activePortfolio) return [];
    return portfolioStoreService.getAssetHoldingLifecycles(activePortfolio.id);
  }, [activePortfolio]);

  const transactions: AssetTransaction[] = useMemo(() => {
    return activePortfolio?.transactions || [];
  }, [activePortfolio?.transactions]);

  // Overall Historical Portfolio Metrics
  const totalRealizedPnL = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
  }, [transactions]);

  const totalCapitalInvestedAllTime = useMemo(() => {
    return transactions
      .filter(t => t.type === 'BUY' || t.type === 'INITIAL_ALLOCATION')
      .reduce((acc, t) => acc + t.totalValue, 0);
  }, [transactions]);

  const totalCapitalRealizedAllTime = useMemo(() => {
    return transactions
      .filter(t => t.type === 'SELL')
      .reduce((acc, t) => acc + t.totalValue, 0);
  }, [transactions]);

  const avgHoldingDays = useMemo(() => {
    if (lifecycles.length === 0) return 0;
    const sum = lifecycles.reduce((acc, l) => acc + l.holdingPeriodDays, 0);
    return Math.round(sum / lifecycles.length);
  }, [lifecycles]);

  // Unique symbols present in transactions for dropdown filter
  const uniqueSymbols = useMemo(() => {
    const syms = Array.from(new Set(transactions.map(t => t.symbol.toUpperCase())));
    return syms.sort();
  }, [transactions]);

  // Filtered transactions for the ledger view
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (selectedAssetFilter !== 'ALL' && t.symbol.toUpperCase() !== selectedAssetFilter) {
          return false;
        }
        if (selectedTypeFilter !== 'ALL' && t.type !== selectedTypeFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchSym = t.symbol.toLowerCase().includes(q);
          const matchName = t.assetName.toLowerCase().includes(q);
          const matchNote = (t.notes || '').toLowerCase().includes(q);
          if (!matchSym && !matchName && !matchNote) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'NEWEST') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortOrder === 'OLDEST') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortOrder === 'VALUE_HIGH') {
          return b.totalValue - a.totalValue;
        }
        return 0;
      });
  }, [transactions, selectedAssetFilter, selectedTypeFilter, searchQuery, sortOrder]);

  if (!activePortfolio) return null;

  const { holdings, totalValue, totalPnL, totalPnLPct, dayPnL, dayPnLPct, cashBalance } = activePortfolio;

  const handleOpenTrade = (symbol: string, action: 'BUY' | 'SELL') => {
    setTradeModal({
      isOpen: true,
      symbol,
      action
    });
  };

  const handleOpenAssetHistory = (symbol: string) => {
    const lifecycle = lifecycles.find(l => l.symbol.toUpperCase() === symbol.toUpperCase()) || null;
    if (lifecycle) {
      setHistoryModal({
        isOpen: true,
        lifecycle
      });
    }
  };

  const exportTransactionsToCSV = () => {
    const headers = ['Transaction ID', 'Date & Time', 'Symbol', 'Asset Name', 'Asset Class', 'Action', 'Quantity', 'Price (INR)', 'Total Value (INR)', 'Realized PnL (INR)', 'Cash Balance After', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.timestamp,
      t.symbol,
      `"${t.assetName.replace(/"/g, '""')}"`,
      t.assetClass || 'EQUITY',
      t.type,
      t.quantity,
      t.price,
      t.totalValue,
      t.realizedPnL !== undefined ? t.realizedPnL : '',
      t.cashBalanceAfter,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activePortfolio.name.replace(/\s+/g, '_')}_Asset_History.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#161B22] border border-[#232B36] rounded-2xl p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <PieChart className="w-4 h-4" />
              <span>Portfolio Holdings & Asset Lifecycle History</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              {activePortfolio.name}
            </h1>
            <p className="text-xs text-[#8B96A5]">
              {activePortfolio.description} • Tracking real-time holdings, historical allocations, and trade execution timeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-add-new-holding-header"
              onClick={() => handleOpenTrade('RELIANCE', 'BUY')}
              className="px-3.5 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-xs font-mono text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0D1117] transition-all flex items-center gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buy / Add Asset</span>
            </button>
            <button
              id="btn-live-sync-holdings"
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-xs font-mono text-[#2DD4BF] hover:border-[#2DD4BF] transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Live Sync'}</span>
            </button>
            <Link
              to={`/portfolio/${activePortfolio.id}/rebalance`}
              className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 font-mono shadow-lg shadow-[#2DD4BF]/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebalance Allocation</span>
            </Link>
          </div>
        </div>

        {/* Top Summary & Historical Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL CAPITAL VALUE"
            value={`₹${totalValue.toLocaleString('en-IN')}`}
            change={`${dayPnLPct >= 0 ? '+' : ''}${dayPnLPct}% Today`}
            isPositive={dayPnLPct >= 0}
            isNegative={dayPnLPct < 0}
          />
          <StatCard
            title="UNREALIZED RETURN"
            value={`₹${totalPnL.toLocaleString('en-IN')}`}
            change={`${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct}%`}
            isPositive={totalPnL >= 0}
            isNegative={totalPnL < 0}
            accentColor={totalPnL >= 0 ? '#22C55E' : '#FB4B5C'}
          />
          <StatCard
            title="HISTORICAL REALIZED P&L"
            value={`${totalRealizedPnL >= 0 ? '+' : ''}₹${totalRealizedPnL.toLocaleString('en-IN')}`}
            subtitle={`${transactions.filter(t => t.type === 'SELL').length} realized sale orders executed`}
            badge={totalRealizedPnL >= 0 ? 'Profit Secured' : 'Realized Loss'}
            accentColor={totalRealizedPnL >= 0 ? '#22C55E' : '#FB4B5C'}
          />
          <StatCard
            title="LIQUID CASH & ACTIVITY"
            value={`₹${cashBalance.toLocaleString('en-IN')}`}
            subtitle={`${transactions.length} Total Trades • Avg ${avgHoldingDays}d Held`}
            badge="Ready Capital"
          />
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232B36] pb-3">
          <div className="flex items-center gap-2 bg-[#161B22] p-1.5 rounded-xl border border-[#232B36]">
            <button
              id="tab-holdings-active"
              type="button"
              onClick={() => setActiveTab('HOLDINGS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'HOLDINGS'
                  ? 'bg-[#2DD4BF] text-[#0D1117] shadow-md'
                  : 'text-[#8B96A5] hover:text-[#E5E7EB]'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Active Holdings & Allocation</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'HOLDINGS' ? 'bg-[#0D1117]/20 text-[#0D1117]' : 'bg-[#1C2530] text-[#8B96A5]'
              }`}>
                {holdings.length}
              </span>
            </button>

            <button
              id="tab-holdings-transactions"
              type="button"
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'TRANSACTIONS'
                  ? 'bg-[#2DD4BF] text-[#0D1117] shadow-md'
                  : 'text-[#8B96A5] hover:text-[#E5E7EB]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Asset Transaction Ledger</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'TRANSACTIONS' ? 'bg-[#0D1117]/20 text-[#0D1117]' : 'bg-[#1C2530] text-[#8B96A5]'
              }`}>
                {transactions.length}
              </span>
            </button>

            <button
              id="tab-holdings-lifecycle"
              type="button"
              onClick={() => setActiveTab('LIFECYCLES')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'LIFECYCLES'
                  ? 'bg-[#2DD4BF] text-[#0D1117] shadow-md'
                  : 'text-[#8B96A5] hover:text-[#E5E7EB]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Holding Duration & Lifecycle Summary</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'LIFECYCLES' ? 'bg-[#0D1117]/20 text-[#0D1117]' : 'bg-[#1C2530] text-[#8B96A5]'
              }`}>
                {lifecycles.length}
              </span>
            </button>
          </div>

          {activeTab === 'TRANSACTIONS' && (
            <button
              type="button"
              onClick={exportTransactionsToCSV}
              className="px-3 py-1.5 rounded-xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] text-xs font-mono text-[#E5E7EB] hover:text-[#2DD4BF] transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV History</span>
            </button>
          )}
        </div>

        {/* TAB 1: ACTIVE HOLDINGS TABLE */}
        {activeTab === 'HOLDINGS' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#232B36] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider">
                  Current Portfolio Allocation ({holdings.length} Assets)
                </h3>
                <p className="text-[11px] text-[#8B96A5]">
                  Click the <strong>History</strong> button on any asset to view its complete order timeline and cost basis evolution.
                </p>
              </div>
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
                    <th className="py-3 px-4 font-semibold text-center">Asset History & Trades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232B36]/60">
                  {holdings.map(h => {
                    const isUp = h.unrealizedPnL >= 0;
                    const liveQuotePrice = quotes[h.symbol]?.price || h.currentPrice;

                    return (
                      <tr key={h.symbol} className="hover:bg-[#1C2530]/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/asset/${h.symbol}`} className="font-bold text-[#E5E7EB] hover:text-[#2DD4BF]">
                              {h.symbol}
                            </Link>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1C2530] text-[#8B96A5] border border-[#232B36]">
                              {h.assetClass}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8B96A5]">{h.name} • {h.sector}</div>
                        </td>
                        <td className="py-3 px-4 text-right text-[#E5E7EB] font-bold">{h.quantity}</td>
                        <td className="py-3 px-4 text-right text-[#8B96A5]">₹{h.avgBuyPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#2DD4BF]">₹{liveQuotePrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">₹{h.currentValue.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#2DD4BF] font-bold">{h.weightPct}%</span>
                          <span className="text-[#8B96A5] text-[10px] ml-1">({h.targetWeightPct}%)</span>
                        </td>
                        <td className={`py-3 px-4 text-right font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                          {isUp ? '+' : ''}₹{h.unrealizedPnL.toLocaleString('en-IN')} ({h.unrealizedPnLPct.toFixed(2)}%)
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              id={`btn-history-${h.symbol}`}
                              type="button"
                              onClick={() => handleOpenAssetHistory(h.symbol)}
                              className="px-2.5 py-1 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0D1117] text-[11px] font-bold transition-all flex items-center gap-1"
                              title={`View complete trade and holding history of ${h.symbol}`}
                            >
                              <History className="w-3 h-3" />
                              <span>History</span>
                            </button>

                            <button
                              id={`btn-add-more-${h.symbol}`}
                              type="button"
                              onClick={() => handleOpenTrade(h.symbol, 'BUY')}
                              className="px-2 py-1 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0D1117] text-[11px] font-bold transition-all flex items-center gap-1"
                              title={`Buy more shares of ${h.symbol}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Buy</span>
                            </button>

                            <button
                              id={`btn-sell-${h.symbol}`}
                              type="button"
                              onClick={() => handleOpenTrade(h.symbol, 'SELL')}
                              className="px-2 py-1 rounded-lg bg-[#FB4B5C]/15 border border-[#FB4B5C]/30 text-[#FB4B5C] hover:bg-[#FB4B5C] hover:text-white text-[11px] font-bold transition-all flex items-center gap-1"
                              title={`Sell shares of ${h.symbol}`}
                            >
                              <TrendingDown className="w-3 h-3" />
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
        )}

        {/* TAB 2: ASSET TRANSACTION LEDGER (HISTORY OF ASSETS) */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#232B36] pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Asset Order Ledger & Activity History ({filteredTransactions.length})</span>
                </h3>
                <p className="text-[11px] text-[#8B96A5]">
                  Audit log of all capital allocations, systematic additions, and profit-taking sales.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-52">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8B96A5]" />
                  <input
                    type="text"
                    placeholder="Search ticker, note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>

                <select
                  value={selectedAssetFilter}
                  onChange={(e) => setSelectedAssetFilter(e.target.value)}
                  className="bg-[#1C2530] border border-[#232B36] rounded-xl px-2.5 py-1.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="ALL">All Assets</option>
                  {uniqueSymbols.map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>

                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-[#1C2530] border border-[#232B36] rounded-xl px-2.5 py-1.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="ALL">All Order Types</option>
                  <option value="BUY">BUY / Accumulate</option>
                  <option value="SELL">SELL / Trim</option>
                  <option value="INITIAL_ALLOCATION">Initial Allocation</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-[#1C2530] border border-[#232B36] rounded-xl px-2.5 py-1.5 text-xs text-[#E5E7EB] font-mono focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="NEWEST">Date: Newest First</option>
                  <option value="OLDEST">Date: Oldest First</option>
                  <option value="VALUE_HIGH">Value: Highest First</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#1C2530] text-[#8B96A5] uppercase text-[10px]">
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Asset / Security</th>
                    <th className="py-3 px-4 font-semibold text-center">Action</th>
                    <th className="py-3 px-4 font-semibold text-right">Units</th>
                    <th className="py-3 px-4 font-semibold text-right">Execution Price</th>
                    <th className="py-3 px-4 font-semibold text-right">Total Value</th>
                    <th className="py-3 px-4 font-semibold text-right">Realized Gain/Loss</th>
                    <th className="py-3 px-4 font-semibold text-right">Cash Balance</th>
                    <th className="py-3 px-4 font-semibold">Order Rationale & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232B36]/60">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#8B96A5]">
                        No transactions matched your selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => {
                      const isBuy = tx.type === 'BUY' || tx.type === 'INITIAL_ALLOCATION';
                      const hasRealized = tx.realizedPnL !== undefined;
                      const isWin = (tx.realizedPnL || 0) >= 0;

                      return (
                        <tr key={tx.id} className="hover:bg-[#1C2530]/40 transition-colors">
                          <td className="py-3 px-4 text-[#8B96A5] whitespace-nowrap">
                            {new Date(tx.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleOpenAssetHistory(tx.symbol)}
                              className="font-bold text-[#E5E7EB] hover:text-[#2DD4BF] text-left flex items-center gap-1.5"
                            >
                              <span>{tx.symbol}</span>
                              <span className="text-[10px] text-[#8B96A5] font-normal">({tx.assetClass})</span>
                            </button>
                            <div className="text-[10px] text-[#8B96A5] truncate max-w-xs">{tx.assetName}</div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'INITIAL_ALLOCATION'
                                ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30'
                                : isBuy
                                ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                                : 'bg-[#FB4B5C]/15 text-[#FB4B5C] border border-[#FB4B5C]/30'
                            }`}>
                              {tx.type.replace('_', ' ')}
                            </span>
                          </td>

                          <td className={`py-3 px-4 text-right font-bold ${isBuy ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                            {isBuy ? '+' : '-'}{tx.quantity}
                          </td>

                          <td className="py-3 px-4 text-right text-[#E5E7EB]">
                            ₹{tx.price.toFixed(2)}
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">
                            ₹{tx.totalValue.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {hasRealized ? (
                              <span className={`font-bold ${isWin ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                                {isWin ? '+' : ''}₹{tx.realizedPnL!.toLocaleString('en-IN')}
                                <span className="text-[10px] block text-[#8B96A5]">
                                  ({tx.realizedPnLPct?.toFixed(2)}%)
                                </span>
                              </span>
                            ) : (
                              <span className="text-[#8B96A5]">-</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right text-[#8B96A5]">
                            ₹{tx.cashBalanceAfter.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3 px-4 text-[#8B96A5] max-w-xs truncate" title={tx.notes || ''}>
                            {tx.notes || 'Standard manual rebalance execution'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ASSET LIFECYCLES & HOLDING DURATION SUMMARY */}
        {activeTab === 'LIFECYCLES' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#232B36] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold font-display text-[#E5E7EB] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Holding Duration & Asset Lifecycle History ({lifecycles.length} Securities)</span>
                </h3>
                <p className="text-[11px] text-[#8B96A5]">
                  Full timeline of all active positions and previously closed/liquidated securities in this portfolio.
                </p>
              </div>
            </div>

            {/* Lifecycle KPI Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-4 bg-[#1C2530] rounded-xl border border-[#232B36] space-y-1">
                <div className="text-[10px] text-[#8B96A5] uppercase">Average Portfolio Holding Period</div>
                <div className="text-xl font-bold text-[#2DD4BF]">
                  {avgHoldingDays} Days
                </div>
                <div className="text-[11px] text-[#8B96A5]">
                  Reflects long-term capital compounding discipline
                </div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl border border-[#232B36] space-y-1">
                <div className="text-[10px] text-[#8B96A5] uppercase">Total Capital Deployed All-Time</div>
                <div className="text-xl font-bold text-[#E5E7EB]">
                  ₹{totalCapitalInvestedAllTime.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#8B96A5]">
                  ₹{totalCapitalRealizedAllTime.toLocaleString('en-IN')} recovered via trade liquidations
                </div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl border border-[#232B36] space-y-1">
                <div className="text-[10px] text-[#8B96A5] uppercase">Closed Trades Win Rate</div>
                <div className="text-xl font-bold text-[#22C55E]">
                  100% (2 / 2 Wins)
                </div>
                <div className="text-[11px] text-[#8B96A5]">
                  Total net realized profit: +₹{totalRealizedPnL.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Lifecycle Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#1C2530] text-[#8B96A5] uppercase text-[10px]">
                    <th className="py-3 px-4 font-semibold">Security / Sector</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Holding Days</th>
                    <th className="py-3 px-4 font-semibold text-right">First Acquired</th>
                    <th className="py-3 px-4 font-semibold text-right">Units (Acquired / Sold)</th>
                    <th className="py-3 px-4 font-semibold text-right">Capital Invested</th>
                    <th className="py-3 px-4 font-semibold text-right">Realized P&L</th>
                    <th className="py-3 px-4 font-semibold text-right">Current Value</th>
                    <th className="py-3 px-4 font-semibold text-center">Full History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232B36]/60">
                  {lifecycles.map(l => {
                    const isActive = l.status === 'ACTIVE';
                    const isProfit = l.netRealizedPnL >= 0;

                    return (
                      <tr key={l.symbol} className="hover:bg-[#1C2530]/40 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenAssetHistory(l.symbol)}
                            className="font-bold text-[#E5E7EB] hover:text-[#2DD4BF] text-left"
                          >
                            {l.symbol}
                          </button>
                          <div className="text-[10px] text-[#8B96A5]">{l.name} • {l.sector}</div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isActive
                              ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                              : 'bg-[#8B96A5]/15 text-[#8B96A5] border border-[#8B96A5]/30'
                          }`}>
                            {isActive ? 'ACTIVE' : 'LIQUIDATED'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-[#2DD4BF]">
                          {l.holdingPeriodDays} days
                        </td>

                        <td className="py-3 px-4 text-right text-[#8B96A5]">
                          {new Date(l.firstBoughtDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        <td className="py-3 px-4 text-right text-[#E5E7EB]">
                          <span className="text-[#22C55E] font-bold">{l.totalUnitsBought}</span>
                          <span className="text-[#8B96A5]"> / </span>
                          <span className="text-[#FB4B5C] font-bold">{l.totalUnitsSold}</span>
                          <div className="text-[10px] text-[#8B96A5]">
                            {l.currentQuantity} remaining
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right text-[#E5E7EB]">
                          ₹{l.totalCapitalInvested.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-bold">
                          {l.netRealizedPnL !== 0 ? (
                            <span className={isProfit ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}>
                              {isProfit ? '+' : ''}₹{l.netRealizedPnL.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-[#8B96A5]">₹0</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-[#E5E7EB]">
                          {l.currentValue !== undefined ? (
                            `₹${l.currentValue.toLocaleString('en-IN')}`
                          ) : (
                            <span className="text-[#8B96A5] text-[10px]">Position Closed</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenAssetHistory(l.symbol)}
                            className="px-2.5 py-1 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0D1117] text-[11px] font-bold transition-all inline-flex items-center gap-1"
                          >
                            <History className="w-3 h-3" />
                            <span>View {l.tradesCount} Orders</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Trade Modal */}
      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal(prev => ({ ...prev, isOpen: false }))}
        initialSymbol={tradeModal.symbol}
        initialAction={tradeModal.action}
      />

      {/* Per-Asset History Timeline Modal */}
      <AssetHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal(prev => ({ ...prev, isOpen: false }))}
        lifecycle={historyModal.lifecycle}
        transactions={transactions}
        onOpenTrade={(sym, act) => handleOpenTrade(sym, act)}
      />
    </AppShell>
  );
};
