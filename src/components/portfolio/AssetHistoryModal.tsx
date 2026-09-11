import React from 'react';
import { AssetTransaction, AssetHoldingLifecycle } from '../../types';
import { 
  X, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';

interface AssetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifecycle: AssetHoldingLifecycle | null;
  transactions: AssetTransaction[];
  onOpenTrade?: (symbol: string, action: 'BUY' | 'SELL') => void;
}

export const AssetHistoryModal: React.FC<AssetHistoryModalProps> = ({
  isOpen,
  onClose,
  lifecycle,
  transactions,
  onOpenTrade
}) => {
  if (!isOpen || !lifecycle) return null;

  const symbolTxs = transactions
    .filter(t => t.symbol.toUpperCase() === lifecycle.symbol.toUpperCase())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const isProfitable = lifecycle.netRealizedPnL >= 0;
  const isUnrealizedUp = (lifecycle.unrealizedPnL || 0) >= 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0D1117]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#161B22] border border-[#232B36] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-6 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#232B36] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
                {lifecycle.assetClass}
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                lifecycle.status === 'ACTIVE' 
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                  : 'bg-[#8B96A5]/10 border-[#8B96A5]/30 text-[#8B96A5]'
              }`}>
                {lifecycle.status === 'ACTIVE' ? 'Active Holding' : 'Fully Liquidated'}
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-[#E5E7EB] flex items-center gap-2">
              <span>{lifecycle.name}</span>
              <span className="text-sm font-mono text-[#8B96A5]">({lifecycle.symbol})</span>
            </h2>
            <div className="text-[11px] text-[#8B96A5] flex items-center gap-3">
              <span>Sector: <strong className="text-[#E5E7EB]">{lifecycle.sector}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>Held for <strong>{lifecycle.holdingPeriodDays} days</strong></span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Historical Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
          <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl">
            <div className="text-[10px] text-[#8B96A5] uppercase">Current Holdings</div>
            <div className="text-sm font-bold text-[#E5E7EB] mt-0.5">
              {lifecycle.currentQuantity} <span className="text-[10px] font-normal text-[#8B96A5]">Shares</span>
            </div>
            <div className="text-[10px] text-[#8B96A5] mt-1">
              Avg Buy: ₹{lifecycle.avgBuyPrice.toFixed(2)}
            </div>
          </div>

          <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl">
            <div className="text-[10px] text-[#8B96A5] uppercase">Capital Invested</div>
            <div className="text-sm font-bold text-[#E5E7EB] mt-0.5">
              ₹{lifecycle.totalCapitalInvested.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#8B96A5] mt-1">
              {lifecycle.totalUnitsBought} Units Acquired
            </div>
          </div>

          <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl">
            <div className="text-[10px] text-[#8B96A5] uppercase">Realized Profit</div>
            <div className={`text-sm font-bold mt-0.5 ${isProfitable ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
              {isProfitable ? '+' : ''}₹{lifecycle.netRealizedPnL.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#8B96A5] mt-1">
              {lifecycle.totalUnitsSold} Units Sold
            </div>
          </div>

          <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl">
            <div className="text-[10px] text-[#8B96A5] uppercase">Unrealized P&L</div>
            <div className={`text-sm font-bold mt-0.5 ${lifecycle.unrealizedPnL !== undefined ? (isUnrealizedUp ? 'text-[#22C55E]' : 'text-[#FB4B5C]') : 'text-[#8B96A5]'}`}>
              {lifecycle.unrealizedPnL !== undefined ? (
                `${isUnrealizedUp ? '+' : ''}₹${lifecycle.unrealizedPnL.toLocaleString('en-IN')}`
              ) : 'Position Closed'}
            </div>
            <div className="text-[10px] text-[#8B96A5] mt-1">
              {lifecycle.unrealizedPnLPct !== undefined ? `${lifecycle.unrealizedPnLPct.toFixed(2)}%` : 'Realized in Cash'}
            </div>
          </div>
        </div>

        {/* Historical Timeline of Transactions for this Asset */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#E5E7EB] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Asset Trade & Activity Timeline ({symbolTxs.length})</span>
            </span>
            <span className="text-[11px] text-[#8B96A5]">
              First acquired: {new Date(lifecycle.firstBoughtDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
            {symbolTxs.length === 0 ? (
              <div className="p-6 text-center text-[#8B96A5] bg-[#1C2530] rounded-xl border border-[#232B36]">
                No historical orders found for {lifecycle.symbol}.
              </div>
            ) : (
              symbolTxs.map((tx) => {
                const isBuy = tx.type === 'BUY' || tx.type === 'INITIAL_ALLOCATION';
                const hasPnL = tx.realizedPnL !== undefined;
                const dateStr = new Date(tx.timestamp).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#1C2530]/60 border border-[#232B36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono hover:bg-[#1C2530] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isBuy ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#FB4B5C]/15 text-[#FB4B5C]'
                      }`}>
                        {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'INITIAL_ALLOCATION'
                              ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]'
                              : isBuy
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#FB4B5C]/20 text-[#FB4B5C]'
                          }`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                          <span className="text-[#E5E7EB] font-bold">
                            {isBuy ? '+' : '-'}{tx.quantity} Shares @ ₹{tx.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8B96A5] mt-0.5">
                          {dateStr}
                          {tx.notes && <span className="text-[#8B96A5]/80 ml-2 italic">• {tx.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="text-[#E5E7EB] font-bold">
                        ₹{tx.totalValue.toLocaleString('en-IN')}
                      </div>
                      {hasPnL ? (
                        <div className={`text-[10px] font-bold ${tx.realizedPnL! >= 0 ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                          Realized: {tx.realizedPnL! >= 0 ? '+' : ''}₹{tx.realizedPnL!.toLocaleString('en-IN')} ({tx.realizedPnLPct?.toFixed(1)}%)
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#8B96A5]">
                          Cash balance: ₹{tx.cashBalanceAfter.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-[#232B36] flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#8B96A5]">
            Total orders recorded: <strong className="text-[#E5E7EB]">{symbolTxs.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTrade && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTrade(lifecycle.symbol, 'BUY');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0D1117] font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buy More</span>
                </button>

                {lifecycle.currentQuantity > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTrade(lifecycle.symbol, 'SELL');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FB4B5C]/15 border border-[#FB4B5C]/30 text-[#FB4B5C] hover:bg-[#FB4B5C] hover:text-white font-mono font-bold transition-all flex items-center gap-1.5"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Sell Shares</span>
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] font-mono transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
