import React, { useState } from 'react';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { CURATED_UNIVERSE } from '../services/mock/mockUniverse';
import { useQuotes } from '../hooks/useQuotes';
import { Gamepad2, Zap, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { simulatorCashINR, executeSimulatorTrade, activePortfolio } = usePortfolioStore();
  const symbols = CURATED_UNIVERSE.map(a => a.symbol);
  const { quotes } = useQuotes(symbols, 15000);

  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(10);
  const [tradeMessage, setTradeMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentQuote = quotes[selectedSymbol] || { price: 2980.50, changePct: 1.2 };
  const totalCostINR = quantity * currentQuote.price;

  const handleExecutePaperTrade = () => {
    setTradeMessage('');
    setErrorMessage('');

    try {
      executeSimulatorTrade(selectedSymbol, tradeType, quantity, currentQuote.price);
      setTradeMessage(`Executed Paper Trade: ${tradeType} ${quantity} ${selectedSymbol} at ₹${currentQuote.price.toLocaleString('en-IN')}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Simulation trade failed.');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <Gamepad2 className="w-4 h-4" />
              <span>Paper Trading Environment</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Interactive Portfolio Simulator
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Test asset allocation strategies with virtual capital without real financial exposure.
            </p>
          </div>
        </div>

        {/* Simulator Balance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="UNINVESTED VIRTUAL CASH"
            value={`₹${simulatorCashINR.toLocaleString('en-IN')}`}
            subtitle="Virtual paper trading capital"
            badge="Virtual INR"
            accentColor="#2DD4BF"
          />
          <StatCard
            title="ACTIVE SIMULATED HOLDINGS"
            value={`${activePortfolio?.holdings.length || 0} Assets`}
            subtitle="Synced with core portfolio state"
            badge="Paper Trades"
          />
          <StatCard
            title="SIMULATED BENCHMARK RATIO"
            value="+18.4% p.a."
            subtitle="vs Nifty 50: +13.8%"
            badge="Outperforming"
            accentColor="#22C55E"
          />
        </div>

        {/* Paper Trade Form & Quote Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold font-display uppercase text-[#E5E7EB] tracking-wider border-b border-[#232B36] pb-3">
              Execute Paper Order
            </h3>

            {tradeMessage && (
              <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs rounded-xl flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{tradeMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-[#FB4B5C]/10 border border-[#FB4B5C]/30 text-[#FB4B5C] text-xs rounded-xl flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`py-2.5 rounded-xl font-bold border transition-all ${
                    tradeType === 'BUY'
                      ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                      : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
                  }`}
                >
                  BUY / ACCUMULATE
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`py-2.5 rounded-xl font-bold border transition-all ${
                    tradeType === 'SELL'
                      ? 'bg-[#FB4B5C]/20 border-[#FB4B5C] text-[#FB4B5C]'
                      : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
                  }`}
                >
                  SELL / TRIM
                </button>
              </div>

              <div>
                <label className="block text-[#8B96A5] mb-1">Select Ticker Symbol</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
                >
                  {CURATED_UNIVERSE.map(a => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name} ({a.assetClass})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8B96A5] mb-1">Order Quantity (Units)</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl flex items-center justify-between text-xs font-bold border border-[#232B36]">
                <span className="text-[#8B96A5]">Total Paper Capital Required:</span>
                <span className="text-[#2DD4BF] text-sm">₹{totalCostINR.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleExecutePaperTrade}
                className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-[#2DD4BF]/20"
              >
                Submit Paper Order
              </button>
            </div>
          </div>

          {/* Asset Live Card */}
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider border-b border-[#232B36] pb-3">
              Market Quote Inspection
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#1C2530] rounded-xl space-y-1">
                <div className="text-[#8B96A5]">Selected Ticker:</div>
                <div className="text-lg font-bold text-[#E5E7EB]">{selectedSymbol}</div>
              </div>
              <div className="p-3 bg-[#1C2530] rounded-xl space-y-1">
                <div className="text-[#8B96A5]">Live Price:</div>
                <div className="text-lg font-bold text-[#2DD4BF]">₹{currentQuote.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
