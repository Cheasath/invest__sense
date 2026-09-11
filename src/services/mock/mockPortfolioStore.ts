import { Portfolio, Holding, Quote, Recommendation, BacktestResult, DailyPerformance, RiskMetrics, AssetTransaction, AssetHoldingLifecycle } from '../../types';
import { CURATED_UNIVERSE, INITIAL_BASE_QUOTES } from './mockUniverse';

const PORTFOLIO_STORAGE_KEY = 'investsense_user_portfolios';
const WATCHLIST_STORAGE_KEY = 'investsense_watchlist';

export const INITIAL_DEFAULT_TRANSACTIONS: AssetTransaction[] = [
  {
    id: 'tx_init_01',
    portfolioId: 'pf_main_01',
    symbol: 'RELIANCE',
    assetName: 'Reliance Industries Ltd.',
    assetClass: 'EQUITY',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:30:00.000Z',
    quantity: 60,
    price: 1210.00,
    totalValue: 72600,
    avgCostAtExecution: 1210.00,
    cashBalanceAfter: 427400,
    notes: 'Core Indian Equity - Initial energy & digital telecom bedrock allocation'
  },
  {
    id: 'tx_init_02',
    portfolioId: 'pf_main_01',
    symbol: 'TCS',
    assetName: 'Tata Consultancy Services',
    assetClass: 'EQUITY',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:35:00.000Z',
    quantity: 40,
    price: 2130.00,
    totalValue: 85200,
    avgCostAtExecution: 2130.00,
    cashBalanceAfter: 342200,
    notes: 'Core IT export leader initial position'
  },
  {
    id: 'tx_init_03',
    portfolioId: 'pf_main_01',
    symbol: 'HDFCBANK',
    assetName: 'HDFC Bank Ltd.',
    assetClass: 'EQUITY',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:40:00.000Z',
    quantity: 120,
    price: 665.00,
    totalValue: 79800,
    avgCostAtExecution: 665.00,
    cashBalanceAfter: 262400,
    notes: 'Private banking core pillar allocation'
  },
  {
    id: 'tx_init_04',
    portfolioId: 'pf_main_01',
    symbol: 'NIFTYBEES',
    assetName: 'Nippon India ETF Nifty 50 BeES',
    assetClass: 'ETF',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:45:00.000Z',
    quantity: 300,
    price: 252.00,
    totalValue: 75600,
    avgCostAtExecution: 252.00,
    cashBalanceAfter: 186800,
    notes: 'Broad market benchmark ETF foundation (Beta anchor)'
  },
  {
    id: 'tx_init_05',
    portfolioId: 'pf_main_01',
    symbol: 'GOLDBEES',
    assetName: 'Nippon India ETF Gold BeES',
    assetClass: 'GOLD',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:50:00.000Z',
    quantity: 500,
    price: 116.50,
    totalValue: 58250,
    avgCostAtExecution: 116.50,
    cashBalanceAfter: 128550,
    notes: 'Precious metal systemic risk and currency debasement hedge'
  },
  {
    id: 'tx_init_06',
    portfolioId: 'pf_main_01',
    symbol: 'IN_10Y_GSEC',
    assetName: 'India 10-Year Government Securities Bond',
    assetClass: 'BOND',
    type: 'INITIAL_ALLOCATION',
    timestamp: '2026-01-15T09:55:00.000Z',
    quantity: 480,
    price: 100.00,
    totalValue: 48000,
    avgCostAtExecution: 100.00,
    cashBalanceAfter: 80550,
    notes: 'Sovereign risk-free yield & duration anchor'
  },
  {
    id: 'tx_add_01',
    portfolioId: 'pf_main_01',
    symbol: 'RELIANCE',
    assetName: 'Reliance Industries Ltd.',
    assetClass: 'EQUITY',
    type: 'BUY',
    timestamp: '2026-02-10T11:15:00.000Z',
    quantity: 20,
    price: 1250.00,
    totalValue: 25000,
    avgCostAtExecution: 1220.00,
    cashBalanceAfter: 55550,
    notes: 'Accumulated 20 shares on 50-day EMA support test. Adjusted average buy price to ₹1,220.00'
  },
  {
    id: 'tx_add_02',
    portfolioId: 'pf_main_01',
    symbol: 'TCS',
    assetName: 'Tata Consultancy Services',
    assetClass: 'EQUITY',
    type: 'BUY',
    timestamp: '2026-02-18T14:20:00.000Z',
    quantity: 20,
    price: 2190.00,
    totalValue: 43800,
    avgCostAtExecution: 2150.00,
    cashBalanceAfter: 51750,
    notes: 'Added 20 shares following institutional deals inflow.'
  },
  {
    id: 'tx_add_03',
    portfolioId: 'pf_main_01',
    symbol: 'HDFCBANK',
    assetName: 'HDFC Bank Ltd.',
    assetClass: 'EQUITY',
    type: 'BUY',
    timestamp: '2026-02-25T10:45:00.000Z',
    quantity: 30,
    price: 690.00,
    totalValue: 20700,
    avgCostAtExecution: 670.00,
    cashBalanceAfter: 41050,
    notes: 'Strategic accumulation to reach target 18% portfolio weighting.'
  },
  {
    id: 'tx_add_04',
    portfolioId: 'pf_main_01',
    symbol: 'NIFTYBEES',
    assetName: 'Nippon India ETF Nifty 50 BeES',
    assetClass: 'ETF',
    type: 'BUY',
    timestamp: '2026-03-02T12:00:00.000Z',
    quantity: 100,
    price: 264.00,
    totalValue: 26400,
    avgCostAtExecution: 255.00,
    cashBalanceAfter: 64650,
    notes: 'Monthly SIP passive indexing inflow.'
  },
  {
    id: 'tx_add_05',
    portfolioId: 'pf_main_01',
    symbol: 'GOLDBEES',
    assetName: 'Nippon India ETF Gold BeES',
    assetClass: 'GOLD',
    type: 'BUY',
    timestamp: '2026-03-05T15:10:00.000Z',
    quantity: 100,
    price: 125.50,
    totalValue: 12550,
    avgCostAtExecution: 118.00,
    cashBalanceAfter: 52100,
    notes: 'Safe haven gold accumulation.'
  },
  {
    id: 'tx_sell_01',
    portfolioId: 'pf_main_01',
    symbol: 'TCS',
    assetName: 'Tata Consultancy Services',
    assetClass: 'EQUITY',
    type: 'SELL',
    timestamp: '2026-03-12T13:30:00.000Z',
    quantity: 10,
    price: 2260.00,
    totalValue: 22600,
    realizedPnL: 1100.00,
    realizedPnLPct: 5.12,
    avgCostAtExecution: 2150.00,
    cashBalanceAfter: 74700,
    notes: 'Tactical rebalance: trimmed 10 units near local resistance at ₹2,260. Realized profit +₹1,100 (+5.12%).'
  },
  {
    id: 'tx_sell_02',
    portfolioId: 'pf_main_01',
    symbol: 'INFY',
    assetName: 'Infosys Limited',
    assetClass: 'EQUITY',
    type: 'SELL',
    timestamp: '2026-03-20T14:45:00.000Z',
    quantity: 25,
    price: 1620.00,
    totalValue: 40500,
    realizedPnL: 3500.00,
    realizedPnLPct: 9.46,
    avgCostAtExecution: 1480.00,
    cashBalanceAfter: 85000,
    notes: 'Fully closed tactical short-term swing position. Realized gain +₹3,500 (+9.46%).'
  }
];

export const INITIAL_DEFAULT_PORTFOLIO: Portfolio = {
  id: 'pf_main_01',
  name: 'Core Growth Portfolio',
  description: 'Primary long-term growth and capital appreciation portfolio',
  baseCurrency: 'INR',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  cashBalance: 85000,
  transactions: INITIAL_DEFAULT_TRANSACTIONS,
  holdings: [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      assetClass: 'EQUITY',
      sector: 'Energy & Petrochemicals',
      quantity: 80,
      avgBuyPrice: 1220.00,
      currentPrice: 1263.80,
      currentValue: 101104,
      unrealizedPnL: 3504,
      unrealizedPnLPct: 3.59,
      weightPct: 16.0,
      targetWeightPct: 18.0
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      assetClass: 'EQUITY',
      sector: 'Information Technology',
      quantity: 50,
      avgBuyPrice: 2150.00,
      currentPrice: 2211.30,
      currentValue: 110565,
      unrealizedPnL: 3065,
      unrealizedPnLPct: 2.85,
      weightPct: 17.5,
      targetWeightPct: 15.0
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      assetClass: 'EQUITY',
      sector: 'Financial Services',
      quantity: 150,
      avgBuyPrice: 670.00,
      currentPrice: 699.85,
      currentValue: 104977.5,
      unrealizedPnL: 4477.5,
      unrealizedPnLPct: 4.46,
      weightPct: 16.6,
      targetWeightPct: 18.0
    },
    {
      symbol: 'NIFTYBEES',
      name: 'Nippon India ETF Nifty 50 BeES',
      assetClass: 'ETF',
      sector: 'Broad Market ETF',
      quantity: 400,
      avgBuyPrice: 255.00,
      currentPrice: 265.58,
      currentValue: 106232,
      unrealizedPnL: 4232,
      unrealizedPnLPct: 4.15,
      weightPct: 16.8,
      targetWeightPct: 20.0
    },
    {
      symbol: 'GOLDBEES',
      name: 'Nippon India ETF Gold BeES',
      assetClass: 'GOLD',
      sector: 'Precious Metals',
      quantity: 600,
      avgBuyPrice: 118.00,
      currentPrice: 125.37,
      currentValue: 75222,
      unrealizedPnL: 4422,
      unrealizedPnLPct: 6.25,
      weightPct: 11.9,
      targetWeightPct: 12.0
    },
    {
      symbol: 'IN_10Y_GSEC',
      name: 'India 10-Year Government Securities Bond',
      assetClass: 'BOND',
      sector: 'Sovereign Fixed Income',
      quantity: 480,
      avgBuyPrice: 100.00,
      currentPrice: 100.80,
      currentValue: 48384,
      unrealizedPnL: 384,
      unrealizedPnLPct: 0.80,
      weightPct: 7.7,
      targetWeightPct: 10.0
    }
  ],
  totalValue: 631484.5,
  totalCost: 611400,
  totalPnL: 20084.5,
  totalPnLPct: 3.29,
  dayPnL: 4820,
  dayPnLPct: 0.77,
  healthScore: {
    compositeScore: 86,
    diversificationScore: 84,
    riskAlignmentScore: 88,
    driftScore: 85,
    status: 'EXCELLENT',
    insights: [
      'Well-diversified cross-asset allocation matching real-time market valuations.',
      'Slight drift in TCS (+2.5% vs target). Rebalancing opportunity detected.',
      'Portfolio Sharpe ratio stands at 1.88 with adequate drawdown buffer.'
    ]
  }
};

export class PortfolioStoreService {
  private memoryCache: Portfolio[] | null = null;

  public getPortfolios(): Portfolio[] {
    if (this.memoryCache) {
      return this.memoryCache;
    }

    try {
      const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (raw) {
        const parsed: Portfolio[] = JSON.parse(raw);
        // Automatically check and migrate any legacy outdated prices or missing transactions
        let needsSave = false;
        for (const p of parsed) {
          if (!p.transactions || p.transactions.length === 0) {
            p.transactions = [...INITIAL_DEFAULT_TRANSACTIONS];
            needsSave = true;
          }

          const hasLegacyPrice = p.holdings.some(h => (h.symbol === 'RELIANCE' && h.currentPrice > 2000) || (h.symbol === 'TCS' && h.currentPrice > 3500));
          if (hasLegacyPrice) {
            for (const h of p.holdings) {
              const sym = h.symbol.toUpperCase();
              if (INITIAL_BASE_QUOTES[sym]) {
                h.currentPrice = INITIAL_BASE_QUOTES[sym].price;
                if (sym === 'RELIANCE') h.avgBuyPrice = 1220.00;
                if (sym === 'TCS') h.avgBuyPrice = 2150.00;
                if (sym === 'HDFCBANK') h.avgBuyPrice = 670.00;
                if (sym === 'GOLDBEES') h.avgBuyPrice = 118.00;
              }
            }
            this.recalculatePortfolio(p);
            needsSave = true;
          }
        }
        this.memoryCache = parsed;
        if (needsSave) {
          this.savePortfolios(parsed);
        }
        return parsed;
      }
    } catch (e) {}

    const list = [INITIAL_DEFAULT_PORTFOLIO];
    this.memoryCache = list;
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
    return list;
  }

  public savePortfolios(portfolios: Portfolio[]) {
    this.memoryCache = portfolios;
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolios));
    } catch (e) {}
  }

  public getPortfolioById(id: string): Portfolio | null {
    const list = this.getPortfolios();
    return list.find(p => p.id === id) || list[0] || null;
  }

  public updateHolding(portfolioId: string, symbol: string, quantityDelta: number, price: number, notes?: string) {
    const list = this.getPortfolios();
    const pf = list.find(p => p.id === portfolioId);
    if (!pf) return;

    if (!pf.transactions) {
      pf.transactions = [...INITIAL_DEFAULT_TRANSACTIONS];
    }

    const existingIdx = pf.holdings.findIndex(h => h.symbol === symbol);
    const asset = CURATED_UNIVERSE.find(a => a.symbol === symbol) || {
      symbol, name: symbol, assetClass: 'EQUITY' as const, sector: 'General'
    };

    const absQty = Math.abs(quantityDelta);
    let txType: 'BUY' | 'SELL' | 'INITIAL_ALLOCATION' = quantityDelta > 0 ? (existingIdx >= 0 ? 'BUY' : 'INITIAL_ALLOCATION') : 'SELL';
    let realizedPnL: number | undefined = undefined;
    let realizedPnLPct: number | undefined = undefined;
    let avgCostAtExecution: number | undefined = undefined;

    if (existingIdx >= 0) {
      const h = pf.holdings[existingIdx];
      const newQty = h.quantity + quantityDelta;
      avgCostAtExecution = h.avgBuyPrice;

      if (newQty <= 0) {
        // Full liquidation / sell all shares
        const cashProceeds = h.quantity * price;
        pf.cashBalance = +(pf.cashBalance + cashProceeds).toFixed(2);
        realizedPnL = +((price - h.avgBuyPrice) * h.quantity).toFixed(2);
        realizedPnLPct = h.avgBuyPrice > 0 ? +(((price - h.avgBuyPrice) / h.avgBuyPrice) * 100).toFixed(2) : 0;
        pf.holdings.splice(existingIdx, 1);
      } else if (quantityDelta < 0) {
        // Partial sell of shares
        const soldQty = Math.abs(quantityDelta);
        const cashProceeds = soldQty * price;
        pf.cashBalance = +(pf.cashBalance + cashProceeds).toFixed(2);
        realizedPnL = +((price - h.avgBuyPrice) * soldQty).toFixed(2);
        realizedPnLPct = h.avgBuyPrice > 0 ? +(((price - h.avgBuyPrice) / h.avgBuyPrice) * 100).toFixed(2) : 0;
        h.quantity = newQty;
        // Average buy price does not change when selling existing shares
        h.currentPrice = price;
        h.currentValue = +(newQty * price).toFixed(2);
        h.unrealizedPnL = +(h.currentValue - (newQty * h.avgBuyPrice)).toFixed(2);
        h.unrealizedPnLPct = h.avgBuyPrice > 0 ? +((h.unrealizedPnL / (newQty * h.avgBuyPrice)) * 100).toFixed(2) : 0;
      } else {
        // Buying more shares of existing holding
        const cost = quantityDelta * price;
        pf.cashBalance = +(Math.max(0, pf.cashBalance - cost)).toFixed(2);
        const totalSpent = (h.quantity * h.avgBuyPrice) + cost;
        h.quantity = newQty;
        h.avgBuyPrice = +(totalSpent / newQty).toFixed(2);
        h.currentPrice = price;
        h.currentValue = +(newQty * price).toFixed(2);
        h.unrealizedPnL = +(h.currentValue - (newQty * h.avgBuyPrice)).toFixed(2);
        h.unrealizedPnLPct = h.avgBuyPrice > 0 ? +((h.unrealizedPnL / (newQty * h.avgBuyPrice)) * 100).toFixed(2) : 0;
      }
    } else if (quantityDelta > 0) {
      // Adding a new asset into portfolio
      const cost = quantityDelta * price;
      pf.cashBalance = +(Math.max(0, pf.cashBalance - cost)).toFixed(2);
      avgCostAtExecution = price;
      pf.holdings.push({
        symbol,
        name: asset.name,
        assetClass: asset.assetClass,
        sector: asset.sector,
        quantity: quantityDelta,
        avgBuyPrice: price,
        currentPrice: price,
        currentValue: +(quantityDelta * price).toFixed(2),
        unrealizedPnL: 0,
        unrealizedPnLPct: 0,
        weightPct: 0,
        targetWeightPct: 10
      });
    }

    // Record transaction
    const newTx: AssetTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      portfolioId: pf.id,
      symbol,
      assetName: asset.name,
      assetClass: asset.assetClass,
      type: txType,
      timestamp: new Date().toISOString(),
      quantity: absQty,
      price,
      totalValue: +(absQty * price).toFixed(2),
      realizedPnL,
      realizedPnLPct,
      avgCostAtExecution,
      cashBalanceAfter: pf.cashBalance,
      notes: notes || (quantityDelta > 0
        ? `Added ${absQty} shares at ₹${price.toFixed(2)}`
        : `Sold ${absQty} shares at ₹${price.toFixed(2)}${realizedPnL !== undefined ? ` (Realized P&L: ${realizedPnL >= 0 ? '+' : ''}₹${realizedPnL.toLocaleString('en-IN')})` : ''}`)
    };

    pf.transactions = [newTx, ...(pf.transactions || [])];

    // Recalculate totals and weights
    this.recalculatePortfolio(pf);
    this.savePortfolios(list);
  }

  public getAssetHoldingLifecycles(portfolioId: string): AssetHoldingLifecycle[] {
    const pf = this.getPortfolioById(portfolioId);
    if (!pf) return [];

    const txs = pf.transactions || [];
    const holdingsMap = new Map<string, Holding>();
    for (const h of pf.holdings) {
      holdingsMap.set(h.symbol.toUpperCase(), h);
    }

    // Gather all unique symbols from holdings and transactions
    const uniqueSymbols = Array.from(new Set([
      ...pf.holdings.map(h => h.symbol.toUpperCase()),
      ...txs.map(t => t.symbol.toUpperCase())
    ]));

    const lifecycles: AssetHoldingLifecycle[] = [];

    for (const sym of uniqueSymbols) {
      const symTxs = txs.filter(t => t.symbol.toUpperCase() === sym).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const activeHolding = holdingsMap.get(sym);
      const assetMeta = CURATED_UNIVERSE.find(a => a.symbol.toUpperCase() === sym);

      const name = activeHolding?.name || symTxs[0]?.assetName || assetMeta?.name || sym;
      const assetClass = activeHolding?.assetClass || symTxs[0]?.assetClass || assetMeta?.assetClass || 'EQUITY';
      const sector = activeHolding?.sector || assetMeta?.sector || 'Diversified';

      let totalUnitsBought = 0;
      let totalUnitsSold = 0;
      let totalCapitalInvested = 0;
      let totalCapitalRealized = 0;
      let netRealizedPnL = 0;

      for (const t of symTxs) {
        if (t.type === 'BUY' || t.type === 'INITIAL_ALLOCATION') {
          totalUnitsBought += t.quantity;
          totalCapitalInvested += t.totalValue;
        } else if (t.type === 'SELL') {
          totalUnitsSold += t.quantity;
          totalCapitalRealized += t.totalValue;
          if (t.realizedPnL !== undefined) {
            netRealizedPnL += t.realizedPnL;
          }
        }
      }

      const firstBoughtDate = symTxs.length > 0 ? symTxs[0].timestamp : (pf.createdAt || new Date().toISOString());
      const lastTradedDate = symTxs.length > 0 ? symTxs[symTxs.length - 1].timestamp : (pf.updatedAt || new Date().toISOString());

      const firstTime = new Date(firstBoughtDate).getTime();
      const lastTime = activeHolding ? Date.now() : new Date(lastTradedDate).getTime();
      const holdingPeriodDays = Math.max(1, Math.round((lastTime - firstTime) / (1000 * 60 * 60 * 24)));

      const currentQuantity = activeHolding ? activeHolding.quantity : 0;
      const avgBuyPrice = activeHolding ? activeHolding.avgBuyPrice : (totalUnitsBought > 0 ? totalCapitalInvested / totalUnitsBought : 0);

      lifecycles.push({
        symbol: sym,
        name,
        assetClass,
        sector,
        status: currentQuantity > 0 ? 'ACTIVE' : 'LIQUIDATED',
        firstBoughtDate,
        lastTradedDate,
        holdingPeriodDays,
        totalUnitsBought,
        totalUnitsSold,
        currentQuantity,
        totalCapitalInvested: +totalCapitalInvested.toFixed(2),
        totalCapitalRealized: +totalCapitalRealized.toFixed(2),
        netRealizedPnL: +netRealizedPnL.toFixed(2),
        avgBuyPrice: +avgBuyPrice.toFixed(2),
        currentValue: activeHolding?.currentValue,
        unrealizedPnL: activeHolding?.unrealizedPnL,
        unrealizedPnLPct: activeHolding?.unrealizedPnLPct,
        tradesCount: symTxs.length
      });
    }

    return lifecycles.sort((a, b) => {
      // Active first, then by value or total invested
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') return 1;
      return (b.currentValue || b.totalCapitalInvested) - (a.currentValue || a.totalCapitalInvested);
    });
  }

  public updatePortfolioQuotes(portfolioId: string, quotes: Record<string, Quote>): boolean {
    const list = this.getPortfolios();
    const pf = list.find(p => p.id === portfolioId);
    if (!pf) return false;

    let updated = false;
    for (const h of pf.holdings) {
      const q = quotes[h.symbol.toUpperCase()];
      if (q && q.price > 0 && Math.abs(q.price - h.currentPrice) > 0.001) {
        h.currentPrice = q.price;
        updated = true;
      }
    }

    if (updated) {
      this.recalculatePortfolio(pf);
      this.savePortfolios(list);
    }
    return updated;
  }

  public recalculatePortfolio(pf: Portfolio) {
    let holdingsVal = 0;
    let totalCost = 0;

    for (const h of pf.holdings) {
      h.currentValue = h.quantity * h.currentPrice;
      h.unrealizedPnL = h.currentValue - (h.quantity * h.avgBuyPrice);
      h.unrealizedPnLPct = h.avgBuyPrice > 0 ? (h.unrealizedPnL / (h.quantity * h.avgBuyPrice)) * 100 : 0;
      holdingsVal += h.currentValue;
      totalCost += (h.quantity * h.avgBuyPrice);
    }

    pf.totalValue = holdingsVal + pf.cashBalance;
    pf.totalCost = totalCost + pf.cashBalance;
    pf.totalPnL = holdingsVal - totalCost;
    pf.totalPnLPct = totalCost > 0 ? (pf.totalPnL / totalCost) * 100 : 0;

    for (const h of pf.holdings) {
      h.weightPct = pf.totalValue > 0 ? +((h.currentValue / pf.totalValue) * 100).toFixed(1) : 0;
    }

    // Calculate Herfindahl-Hirschman Index (HHI) for Diversification Score
    let hhi = 0;
    for (const h of pf.holdings) {
      const w = h.weightPct / 100;
      hhi += w * w;
    }

    const divScore = Math.min(100, Math.max(20, Math.round((1 - hhi) * 120)));
    const riskAlignment = 88;
    const driftScore = 82;
    const composite = Math.round((divScore * 0.4) + (riskAlignment * 0.35) + (driftScore * 0.25));

    pf.healthScore = {
      compositeScore: composite,
      diversificationScore: divScore,
      riskAlignmentScore: riskAlignment,
      driftScore: driftScore,
      status: composite >= 80 ? 'EXCELLENT' : composite >= 65 ? 'GOOD' : 'NEEDS_ATTENTION',
      insights: [
        `Diversification Score is ${divScore}/100 based on low sector concentration.`,
        `Risk alignment matches moderate/growth profile guidelines.`,
        `Herfindahl-Hirschman Index (HHI) is ${(hhi * 10000).toFixed(0)}.`
      ]
    };
  }

  // TradeZella performance heatmap data for calendar view
  public getDailyPerformanceHistory(): DailyPerformance[] {
    const days: DailyPerformance[] = [];
    const today = new Date();

    for (let i = 35; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      if (isWeekend) continue;

      const dateStr = d.toISOString().split('T')[0];
      const seed = Math.sin(i * 1.7);
      const pnlPct = +(seed * 1.8).toFixed(2);
      const pnlINR = Math.round(pnlPct * 7500);

      days.push({
        date: dateStr,
        pnlINR,
        pnlPct,
        portfolioValue: 750000 + Math.round(i * 800 + pnlINR),
        tradesCount: Math.abs(Math.round(seed * 3)),
        status: pnlPct > 0.1 ? 'WIN' : pnlPct < -0.1 ? 'LOSS' : 'BREAKEVEN'
      });
    }

    return days;
  }

  public getRiskMetrics(): RiskMetrics {
    return {
      var95Pct: -1.82, // 95% 1-day VaR
      cvar95Pct: -2.65, // Conditional VaR
      maxDrawdownPct: -8.45,
      annualizedVolatilityPct: 12.8,
      sharpeRatio: 1.84,
      sortinoRatio: 2.21,
      calmarRatio: 1.62,
      hhiConcentrationIndex: 1840,
      diversificationScore: 82,
      top3SectorConcentrationPct: 56.1,
      betaToNifty: 0.91
    };
  }

  // Watchlist methods
  public getWatchlist(): string[] {
    try {
      const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return ['RELIANCE', 'TCS', 'NIFTYBEES', 'GOLDBEES', 'BAJFINANCE'];
  }

  public toggleWatchlist(symbol: string): string[] {
    const list = this.getWatchlist();
    const upper = symbol.toUpperCase();
    const idx = list.indexOf(upper);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(upper);
    }
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
    return list;
  }

  public generateRecommendations(userRiskCategory: string = 'GROWTH'): Recommendation[] {
    return CURATED_UNIVERSE.map(asset => {
      let score = 70;
      if (asset.assetClass === 'ETF') score += 15;
      if (asset.assetClass === 'GOLD') score += 10;
      if (userRiskCategory === 'AGGRESSIVE' && asset.sector === 'Information Technology') score += 10;
      if (userRiskCategory === 'CONSERVATIVE' && asset.assetClass === 'BOND') score += 20;

      score = Math.min(96, Math.max(45, score));

      const recType: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'REBALANCE_ADD' =
        score >= 85 ? 'STRONG_BUY' : score >= 70 ? 'BUY' : 'HOLD';

      return {
        asset,
        suitabilityScore: score,
        recommendationType: recType,
        diversificationContribution: +(Math.random() * 8 + 4).toFixed(1),
        reasoning: `${asset.name} provides valuable exposure to ${asset.sector} with robust market presence and favorable risk-adjusted score for a ${userRiskCategory} profile.`,
        factors: [
          { name: 'Risk Compatibility', score: Math.round(score * 0.95), weight: 0.30, description: 'Matches target volatility tolerance.' },
          { name: 'Diversification Contribution', score: Math.round(score * 1.02), weight: 0.25, description: 'Low correlation with existing holdings.' },
          { name: 'Return Potential', score: Math.round(score * 0.9), weight: 0.25, description: 'Solid fundamentals & yield.' },
          { name: 'Volatility Buffer', score: Math.round(score * 0.88), weight: 0.20, description: 'Controlled downside risk.' }
        ]
      };
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }

  public runBacktest(strategyName: string = 'InvestSense AI Portfolio'): BacktestResult {
    const dates = [];
    const equityCurve = [];
    let pfVal = 500000;
    let bmVal = 500000;

    const startDate = '2023-01-01';
    const endDate = '2026-08-01';

    for (let month = 0; month <= 42; month++) {
      const d = new Date(2023, month, 1);
      const dateStr = d.toISOString().split('T')[0];

      // AI portfolio outperformance simulation
      const pfReturn = 0.012 + (Math.sin(month * 0.5) * 0.025);
      const bmReturn = 0.009 + (Math.sin(month * 0.5) * 0.028);

      pfVal = pfVal * (1 + pfReturn);
      bmVal = bmVal * (1 + bmReturn);

      equityCurve.push({
        date: dateStr,
        portfolioValue: Math.round(pfVal),
        benchmarkValue: Math.round(bmVal)
      });
    }

    return {
      strategyName,
      startDate,
      endDate,
      initialCapital: 500000,
      finalCapital: Math.round(pfVal),
      cagrPct: 18.4,
      sharpeRatio: 1.92,
      maxDrawdownPct: -9.2,
      volatilityPct: 11.8,
      winRatePct: 72.5,
      benchmarkCagrPct: 13.8,
      equityCurve
    };
  }
}

export const portfolioStoreService = new PortfolioStoreService();
