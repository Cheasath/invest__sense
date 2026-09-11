import React, { useState, useEffect, useId } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { CURATED_UNIVERSE, generateFallbackQuote } from '../../services/mock/mockUniverse';
import { 
  X, 
  Minus, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Wallet, 
  Layers,
  Zap
} from 'lucide-react';

export interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymbol?: string;
  initialAction?: 'BUY' | 'SELL';
  onCompleted?: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  initialSymbol,
  initialAction = 'BUY',
  onCompleted
}) => {
  const modalId = useId();
  const { activePortfolio, executeTrade } = usePortfolioStore();

  const [symbol, setSymbol] = useState<string>(initialSymbol || 'RELIANCE');
  const [action, setAction] = useState<'BUY' | 'SELL'>(initialAction);
  const [quantity, setQuantity] = useState<number>(10);
  const [step, setStep] = useState<'CONFIGURE' | 'CONFIRM' | 'SUCCESS'>('CONFIGURE');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state only when modal opens or initialSymbol/initialAction explicitly changes
  useEffect(() => {
    if (isOpen) {
      const sym = initialSymbol || (activePortfolio?.holdings[0]?.symbol) || 'RELIANCE';
      setSymbol(sym);
      setAction(initialAction);
      
      const holding = activePortfolio?.holdings.find(h => h.symbol === sym);
      if (initialAction === 'SELL' && holding) {
        setQuantity(Math.max(1, Math.min(holding.quantity, 10 > 0 ? 10 : holding.quantity)));
      } else {
        setQuantity(10);
      }
      setStep('CONFIGURE');
      setError(null);
      setIsProcessing(false);
    }
  }, [isOpen, initialSymbol, initialAction]); // Note: strictly avoid activePortfolio to prevent infinite render loops

  if (!isOpen || !activePortfolio) return null;

  // Find asset metadata and quote
  const asset = CURATED_UNIVERSE.find(a => a.symbol === symbol) || {
    symbol,
    name: symbol,
    assetClass: 'EQUITY',
    sector: 'Diversified',
    currency: 'INR'
  };

  const currentHolding = activePortfolio.holdings.find(h => h.symbol === symbol);
  const isHolding = !!currentHolding;
  const holdingQty = currentHolding ? currentHolding.quantity : 0;
  const avgBuyPrice = currentHolding ? currentHolding.avgBuyPrice : 0;

  // Real-time price
  const fallbackQuote = generateFallbackQuote(symbol);
  const livePrice = currentHolding ? currentHolding.currentPrice : fallbackQuote.price;
  const currencySymbol = (asset as any).currency === 'USD' ? '$' : '₹';

  const orderValue = quantity * livePrice;
  const currentCash = activePortfolio.cashBalance;
  const newCash = action === 'BUY' 
    ? Math.max(0, currentCash - orderValue) 
    : currentCash + orderValue;

  const newHoldingQty = action === 'BUY' 
    ? holdingQty + quantity 
    : Math.max(0, holdingQty - quantity);

  // Realized P&L calculation for SELL
  const realizedPnL = action === 'SELL' && currentHolding 
    ? (livePrice - avgBuyPrice) * quantity 
    : 0;

  // Average price for BUY
  const newAvgBuyPrice = action === 'BUY'
    ? currentHolding 
      ? ((holdingQty * avgBuyPrice) + orderValue) / (holdingQty + quantity)
      : livePrice
    : avgBuyPrice;

  // Quantity updates
  const handleQuantityChange = (val: number) => {
    setError(null);
    const parsed = Math.max(1, Math.floor(val || 1));
    if (action === 'SELL' && parsed > holdingQty) {
      setQuantity(holdingQty);
      setError(`Cannot sell more than your owned balance of ${holdingQty} shares.`);
    } else {
      setQuantity(parsed);
    }
  };

  const handleQuickPercent = (pct: number) => {
    if (!holdingQty) return;
    const calc = Math.max(1, Math.floor((holdingQty * pct) / 100));
    setQuantity(calc);
    setError(null);
  };

  const handleQuickAdd = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
    setError(null);
  };

  const validateOrder = (): boolean => {
    if (quantity <= 0) {
      setError('Please specify at least 1 share.');
      return false;
    }
    if (action === 'SELL') {
      if (!currentHolding || holdingQty <= 0) {
        setError(`You do not own any shares of ${symbol} to sell.`);
        return false;
      }
      if (quantity > holdingQty) {
        setError(`Cannot sell ${quantity} shares. You only own ${holdingQty} shares.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Immediate trade execution without lag
  const handleExecute = () => {
    if (!validateOrder()) return;
    setIsProcessing(true);
    const delta = action === 'BUY' ? quantity : -quantity;
    
    // Execute synchronously in store
    executeTrade(activePortfolio.id, symbol, delta, livePrice);
    
    setStep('SUCCESS');
    setIsProcessing(false);
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <div 
      id={`trade-modal-backdrop-${modalId}`}
      className="fixed inset-0 z-50 bg-[#0D1117]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'SUCCESS') onClose();
      }}
    >
      <div 
        id={`trade-modal-container-${modalId}`}
        className="bg-[#161B22] border border-[#232B36] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-6 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#232B36] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                action === 'BUY' 
                  ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30' 
                  : 'bg-[#FB4B5C]/15 text-[#FB4B5C] border-[#FB4B5C]/30'
              }`}>
                {action === 'BUY' ? '+ BUY MORE' : '- SELL SHARES'}
              </span>
              <span className="text-[11px] font-mono text-[#8B96A5] px-2 py-0.5 rounded bg-[#1C2530]">
                {asset.assetClass}
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-[#E5E7EB] flex items-center gap-2">
              <span>{symbol}</span>
              <span className="text-sm font-normal text-[#8B96A5] truncate max-w-[220px]">
                {asset.name}
              </span>
            </h2>
          </div>

          <button
            id={`btn-close-trade-modal-${modalId}`}
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1C2530] text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#232B36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CONFIGURE & QUICK CONFIRM */}
        {step === 'CONFIGURE' && (
          <div className="space-y-4">
            {/* BUY / SELL Action Tabs */}
            {isHolding ? (
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#1C2530] rounded-xl border border-[#232B36]">
                <button
                  id={`btn-tab-buy-${modalId}`}
                  type="button"
                  onClick={() => {
                    setAction('BUY');
                    setError(null);
                  }}
                  className={`py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    action === 'BUY'
                      ? 'bg-[#22C55E] text-[#0D1117] shadow'
                      : 'text-[#8B96A5] hover:text-[#E5E7EB]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Buy More</span>
                </button>
                <button
                  id={`btn-tab-sell-${modalId}`}
                  type="button"
                  onClick={() => {
                    setAction('SELL');
                    if (quantity > holdingQty) setQuantity(holdingQty);
                    setError(null);
                  }}
                  className={`py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    action === 'SELL'
                      ? 'bg-[#FB4B5C] text-white shadow'
                      : 'text-[#8B96A5] hover:text-[#E5E7EB]'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Sell Shares ({holdingQty})</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-[#1C2530] rounded-xl border border-[#232B36] flex items-center justify-between font-mono">
                <span className="text-[#8B96A5]">Position Status</span>
                <span className="text-[#2DD4BF] font-semibold">New Asset in {activePortfolio.name}</span>
              </div>
            )}

            {/* Live Price & Holdings Overview */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 bg-[#1C2530]/70 border border-[#232B36] rounded-xl">
                <div className="text-[10px] text-[#8B96A5] uppercase">Live Execution Price</div>
                <div className="text-base font-bold text-[#2DD4BF] mt-0.5">
                  {currencySymbol}{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-3 bg-[#1C2530]/70 border border-[#232B36] rounded-xl">
                <div className="text-[10px] text-[#8B96A5] uppercase">
                  {action === 'SELL' ? 'Owned Shares to Sell' : 'Currently Owned'}
                </div>
                <div className="text-base font-bold text-[#E5E7EB] mt-0.5">
                  {holdingQty} shares
                </div>
              </div>
            </div>

            {/* HOW MANY SHARES - PROMINENT INPUT */}
            <div className="space-y-2.5 bg-[#1C2530]/40 border border-[#232B36] p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-mono text-[#E5E7EB] uppercase tracking-wider flex items-center gap-1.5">
                  <span>How Many Shares to {action === 'BUY' ? 'Buy' : 'Sell'}?</span>
                </label>
                <span className="text-[11px] font-mono text-[#8B96A5]">
                  Total: <strong className="text-[#2DD4BF]">{currencySymbol}{orderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>

              {/* Number Stepper */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 5)}
                  disabled={quantity <= 1}
                  className="px-2.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] hover:border-[#2DD4BF] font-mono font-bold disabled:opacity-30"
                  title="Decrease 5"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] hover:border-[#2DD4BF] disabled:opacity-30"
                  title="Decrease 1"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  id={`input-trade-qty-${modalId}`}
                  type="number"
                  min={1}
                  max={action === 'SELL' ? holdingQty : 999999}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="flex-1 bg-[#161B22] border border-[#232B36] rounded-xl py-2 px-3 text-center text-base font-bold font-mono text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
                />

                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={action === 'SELL' && quantity >= holdingQty}
                  className="p-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] hover:border-[#2DD4BF] disabled:opacity-30"
                  title="Increase 1"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 5)}
                  disabled={action === 'SELL' && quantity >= holdingQty}
                  className="px-2.5 py-2 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] hover:border-[#2DD4BF] font-mono font-bold disabled:opacity-30"
                  title="Increase 5"
                >
                  +5
                </button>
              </div>

              {/* Quick Presets */}
              {action === 'SELL' && holdingQty > 0 ? (
                <div className="grid grid-cols-4 gap-1.5 pt-1 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(25)}
                    className="py-1 rounded-lg bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(50)}
                    className="py-1 rounded-lg bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(75)}
                    className="py-1 rounded-lg bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]"
                  >
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(100)}
                    className="py-1 rounded-lg bg-[#FB4B5C]/15 border border-[#FB4B5C]/40 text-[#FB4B5C] font-bold hover:bg-[#FB4B5C] hover:text-white"
                  >
                    Sell All ({holdingQty})
                  </button>
                </div>
              ) : action === 'BUY' ? (
                <div className="grid grid-cols-4 gap-1.5 pt-1 font-mono text-[11px]">
                  {[5, 10, 25, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantity(num)}
                      className={`py-1 rounded-lg border transition-all ${
                        quantity === num
                          ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold'
                          : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB]'
                      }`}
                    >
                      {num} shares
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[#FB4B5C]/10 border border-[#FB4B5C]/30 rounded-xl text-xs font-mono text-[#FB4B5C] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Order Impact Summary */}
            <div className="bg-[#1C2530] border border-[#232B36] rounded-xl p-3.5 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#8B96A5]">
                <span>Order Total:</span>
                <span className="text-sm font-bold text-[#E5E7EB]">
                  {currencySymbol}{orderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#8B96A5]">
                <span>Position After Trade:</span>
                <span className="text-[#E5E7EB]">
                  {holdingQty} → <strong className={action === 'BUY' ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}>{newHoldingQty} shares</strong>
                </span>
              </div>

              <div className="flex items-center justify-between text-[#8B96A5] pt-1.5 border-t border-[#232B36]/60">
                <span>Available Cash Impact:</span>
                <span className="text-[#E5E7EB]">
                  ₹{currentCash.toLocaleString('en-IN')} → <strong className="text-[#2DD4BF]">₹{newCash.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            {/* Immediate Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                id={`btn-cancel-config-${modalId}`}
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#1C2530] text-[#8B96A5] hover:text-[#E5E7EB] text-xs font-mono transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  id={`btn-review-modal-${modalId}`}
                  type="button"
                  onClick={() => {
                    if (validateOrder()) setStep('CONFIRM');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#1C2530] border border-[#232B36] text-[#8B96A5] hover:text-[#E5E7EB] text-xs font-mono transition-all"
                >
                  Review Details
                </button>

                <button
                  id={`btn-instant-confirm-${modalId}`}
                  type="button"
                  onClick={handleExecute}
                  disabled={isProcessing || (action === 'SELL' && holdingQty <= 0)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-40 ${
                    action === 'BUY'
                      ? 'bg-[#22C55E] text-[#0D1117] hover:brightness-110 shadow-[#22C55E]/20'
                      : 'bg-[#FB4B5C] text-white hover:brightness-110 shadow-[#FB4B5C]/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Confirm {action === 'BUY' ? 'Buy' : 'Sell'} ({quantity} Shares)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRMATION POP-UP (HOW MANY SHARES CONFIRMATION) */}
        {step === 'CONFIRM' && (
          <div className="space-y-4">
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              action === 'SELL' 
                ? 'bg-[#FB4B5C]/10 border-[#FB4B5C]/30 text-[#FB4B5C]' 
                : 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
            }`}>
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold uppercase tracking-wider font-display text-xs">
                  {action === 'BUY' ? 'Buy Order Confirmation' : 'Sell Order Confirmation'}
                </div>
                <p className="text-[#8B96A5] text-[11px] leading-normal">
                  Confirming will execute immediately and update your portfolio holdings and cash balance.
                </p>
              </div>
            </div>

            {/* Breakdown Box */}
            <div className="bg-[#1C2530] border border-[#232B36] rounded-xl divide-y divide-[#232B36] font-mono text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#8B96A5]">Action / Asset:</span>
                <span className="font-bold text-[#E5E7EB]">{action === 'BUY' ? 'BUY MORE' : 'SELL'} • {symbol}</span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-[#8B96A5]">Confirmed Quantity:</span>
                <span className="font-bold text-sm text-[#2DD4BF]">{quantity} shares</span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-[#8B96A5]">Execution Price:</span>
                <span className="text-[#E5E7EB]">{currencySymbol}{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="p-3 flex items-center justify-between bg-[#161B22]/60">
                <span className="text-[#8B96A5] font-semibold">Total Value:</span>
                <span className="font-bold text-sm text-[#E5E7EB]">
                  {currencySymbol}{orderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-[#8B96A5]">Holding After Trade:</span>
                <span className="text-[#E5E7EB]">
                  {holdingQty} → <strong className="text-[#2DD4BF]">{newHoldingQty} shares</strong>
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-[#8B96A5]">Cash Balance After Trade:</span>
                <span className="text-[#E5E7EB]">
                  ₹{currentCash.toLocaleString('en-IN')} → <strong className="text-[#2DD4BF]">₹{newCash.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                id={`btn-back-to-edit-${modalId}`}
                type="button"
                onClick={() => setStep('CONFIGURE')}
                className="px-4 py-2.5 rounded-xl bg-[#1C2530] text-[#8B96A5] hover:text-[#E5E7EB] text-xs font-mono transition-colors"
              >
                ← Back to Edit
              </button>

              <button
                id={`btn-confirm-execute-${modalId}`}
                type="button"
                onClick={handleExecute}
                disabled={isProcessing}
                className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                  action === 'BUY'
                    ? 'bg-[#22C55E] text-[#0D1117] hover:brightness-110 shadow-[#22C55E]/20'
                    : 'bg-[#FB4B5C] text-white hover:brightness-110 shadow-[#FB4B5C]/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Execute {action === 'BUY' ? 'Buy' : 'Sell'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS RECEIPT */}
        {step === 'SUCCESS' && (
          <div className="py-4 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-[#E5E7EB]">
                Order Executed Successfully!
              </h3>
              <p className="text-xs text-[#8B96A5]">
                {action === 'BUY' ? 'Bought' : 'Sold'} {quantity} shares of {symbol} at {currencySymbol}{livePrice.toFixed(2)}
              </p>
            </div>

            <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl text-xs space-y-1.5 text-left max-w-sm mx-auto">
              <div className="flex justify-between text-[#8B96A5]">
                <span>Total Amount:</span>
                <span className="font-bold text-[#2DD4BF]">
                  {currencySymbol}{orderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#8B96A5]">
                <span>Remaining Position:</span>
                <span className="text-[#E5E7EB] font-bold">{newHoldingQty} shares</span>
              </div>
              <div className="flex justify-between text-[#8B96A5]">
                <span>Cash Balance:</span>
                <span className="text-[#E5E7EB] font-bold">₹{newCash.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id={`btn-done-trade-${modalId}`}
                type="button"
                onClick={onClose}
                className="w-full max-w-sm mx-auto py-2.5 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 shadow-lg shadow-[#2DD4BF]/20 transition-all"
              >
                Close & View Holdings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
