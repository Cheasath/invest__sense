import { create } from 'zustand';
import { Portfolio, ViewMode, Quote } from '../types';
import { portfolioStoreService } from '../services/mock/mockPortfolioStore';

interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  viewMode: ViewMode; // TradeZella view mode toggle (₹ / % / Risk-Adjusted)
  watchlist: string[];
  simulatorCashINR: number;
  isLoading: boolean;
  
  loadPortfolios: () => void;
  setActivePortfolio: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleWatchlist: (symbol: string) => void;
  executeTrade: (portfolioId: string, symbol: string, quantityDelta: number, price: number) => void;
  executeSimulatorTrade: (symbol: string, type: 'BUY' | 'SELL', qty: number, price: number) => void;
  updateLiveQuotes: (quotes: Record<string, Quote>) => void;
}

const initialPortfolios = portfolioStoreService.getPortfolios();
const initialWatchlist = portfolioStoreService.getWatchlist();

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolios: initialPortfolios,
  activePortfolio: initialPortfolios[0] || null,
  viewMode: 'ABSOLUTE',
  watchlist: initialWatchlist,
  simulatorCashINR: 1000000, // ₹10,00,000 virtual paper trading capital
  isLoading: false,

  loadPortfolios: () => {
    const list = portfolioStoreService.getPortfolios();
    const wl = portfolioStoreService.getWatchlist();
    set({
      portfolios: list,
      activePortfolio: list[0] || null,
      watchlist: wl,
      isLoading: false
    });
  },

  setActivePortfolio: (id: string) => {
    const pf = portfolioStoreService.getPortfolioById(id);
    if (pf) {
      set({ activePortfolio: pf });
    }
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  toggleWatchlist: (symbol: string) => {
    const updated = portfolioStoreService.toggleWatchlist(symbol);
    set({ watchlist: updated });
  },

  executeTrade: (portfolioId: string, symbol: string, quantityDelta: number, price: number) => {
    portfolioStoreService.updateHolding(portfolioId, symbol, quantityDelta, price);
    const updatedList = portfolioStoreService.getPortfolios();
    const updatedActive = updatedList.find(p => p.id === portfolioId) || updatedList[0];
    set({ portfolios: updatedList, activePortfolio: updatedActive });
  },

  executeSimulatorTrade: (symbol: string, type: 'BUY' | 'SELL', qty: number, price: number) => {
    const { simulatorCashINR, activePortfolio } = get();
    const cost = qty * price;

    if (type === 'BUY' && cost > simulatorCashINR) {
      throw new Error('Insufficient virtual capital balance in simulator.');
    }

    const newCash = type === 'BUY' ? simulatorCashINR - cost : simulatorCashINR + cost;
    const delta = type === 'BUY' ? qty : -qty;

    if (activePortfolio) {
      portfolioStoreService.updateHolding(activePortfolio.id, symbol, delta, price);
      const updatedList = portfolioStoreService.getPortfolios();
      const updatedActive = updatedList.find(p => p.id === activePortfolio.id) || updatedList[0];
      set({ simulatorCashINR: newCash, portfolios: updatedList, activePortfolio: updatedActive });
    } else {
      set({ simulatorCashINR: newCash });
    }
  },

  updateLiveQuotes: (quotes: Record<string, Quote>) => {
    const { activePortfolio } = get();
    if (!activePortfolio) return;
    portfolioStoreService.updatePortfolioQuotes(activePortfolio.id, quotes);
    const updatedList = portfolioStoreService.getPortfolios();
    const updatedActive = updatedList.find(p => p.id === activePortfolio.id) || updatedList[0];
    set({ portfolios: updatedList, activePortfolio: updatedActive });
  }
}));
