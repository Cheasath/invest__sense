import { Portfolio, Holding, Quote, Recommendation, BacktestResult, DailyPerformance, RiskMetrics } from '../../types';
import { CURATED_UNIVERSE, INITIAL_BASE_QUOTES } from './mockUniverse';

const PORTFOLIO_STORAGE_KEY = 'investsense_user_portfolios';
const WATCHLIST_STORAGE_KEY = 'investsense_watchlist';

export const INITIAL_DEFAULT_PORTFOLIO: Portfolio = {
  id: 'pf_main_01',
  name: 'Core Growth Portfolio',
  description: 'Primary long-term growth and capital appreciation portfolio',
  baseCurrency: 'INR',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  cashBalance: 125000,
  holdings: [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      assetClass: 'EQUITY',
      sector: 'Energy & Petrochemicals',
      quantity: 50,
      avgBuyPrice: 2850.00,
      currentPrice: 2980.50,
      currentValue: 149025,
      unrealizedPnL: 6525,
      unrealizedPnLPct: 4.58,
      weightPct: 22.5,
      targetWeightPct: 20.0
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      assetClass: 'EQUITY',
      sector: 'Information Technology',
      quantity: 30,
      avgBuyPrice: 4050.00,
      currentPrice: 4185.20,
      currentValue: 125556,
      unrealizedPnL: 4056,
      unrealizedPnLPct: 3.34,
      weightPct: 19.0,
      targetWeightPct: 15.0
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      assetClass: 'EQUITY',
      sector: 'Financial Services',
      quantity: 75,
      avgBuyPrice: 1580.00,
      currentPrice: 1642.80,
      currentValue: 123210,
      unrealizedPnL: 4710,
      unrealizedPnLPct: 3.97,
      weightPct: 18.6,
      targetWeightPct: 20.0
    },
    {
      symbol: 'NIFTYBEES',
      name: 'Nippon India ETF Nifty 50 BeES',
      assetClass: 'ETF',
      sector: 'Broad Market ETF',
      quantity: 500,
      avgBuyPrice: 255.00,
      currentPrice: 268.40,
      currentValue: 134200,
      unrealizedPnL: 6700,
      unrealizedPnLPct: 5.25,
      weightPct: 20.3,
      targetWeightPct: 25.0
    },
    {
      symbol: 'GOLDBEES',
      name: 'Nippon India ETF Gold BeES',
      assetClass: 'GOLD',
      sector: 'Precious Metals',
      quantity: 1200,
      avgBuyPrice: 64.50,
      currentPrice: 68.20,
      currentValue: 81840,
      unrealizedPnL: 4440,
      unrealizedPnLPct: 5.74,
      weightPct: 12.4,
      targetWeightPct: 10.0
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
      weightPct: 7.2,
      targetWeightPct: 10.0
    }
  ],
  totalValue: 787215,
  totalCost: 756400,
  totalPnL: 30815,
  totalPnLPct: 4.07,
  dayPnL: 6420,
  dayPnLPct: 0.82,
  healthScore: {
    compositeScore: 84,
    diversificationScore: 82,
    riskAlignmentScore: 88,
    driftScore: 82,
    status: 'EXCELLENT',
    insights: [
      'Strong cross-asset diversification across Equities, Gold, ETFs, and Sovereign Bonds.',
      'Minor weight drift detected in TCS (+4.0% vs target). Rebalancing advised.',
      'Portfolio Sharpe ratio stands at 1.84 with comfortable max drawdown buffer.'
    ]
  }
};

export class PortfolioStoreService {
  public getPortfolios(): Portfolio[] {
    try {
      const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    const list = [INITIAL_DEFAULT_PORTFOLIO];
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(list));
    return list;
  }

  public savePortfolios(portfolios: Portfolio[]) {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolios));
  }

  public getPortfolioById(id: string): Portfolio | null {
    const list = this.getPortfolios();
    return list.find(p => p.id === id) || list[0] || null;
  }

  public updateHolding(portfolioId: string, symbol: string, quantityDelta: number, price: number) {
    const list = this.getPortfolios();
    const pf = list.find(p => p.id === portfolioId);
    if (!pf) return;

    const existingIdx = pf.holdings.findIndex(h => h.symbol === symbol);
    const asset = CURATED_UNIVERSE.find(a => a.symbol === symbol) || {
      symbol, name: symbol, assetClass: 'EQUITY', sector: 'General'
    };

    if (existingIdx >= 0) {
      const h = pf.holdings[existingIdx];
      const newQty = h.quantity + quantityDelta;
      if (newQty <= 0) {
        pf.holdings.splice(existingIdx, 1);
      } else {
        const totalSpent = (h.quantity * h.avgBuyPrice) + (quantityDelta * price);
        h.quantity = newQty;
        h.avgBuyPrice = totalSpent / newQty;
        h.currentPrice = price;
        h.currentValue = newQty * price;
        h.unrealizedPnL = h.currentValue - (newQty * h.avgBuyPrice);
        h.unrealizedPnLPct = (h.unrealizedPnL / (newQty * h.avgBuyPrice)) * 100;
      }
    } else if (quantityDelta > 0) {
      pf.holdings.push({
        symbol,
        name: asset.name,
        assetClass: asset.assetClass,
        sector: asset.sector,
        quantity: quantityDelta,
        avgBuyPrice: price,
        currentPrice: price,
        currentValue: quantityDelta * price,
        unrealizedPnL: 0,
        unrealizedPnLPct: 0,
        weightPct: 0,
        targetWeightPct: 10
      });
    }

    // Recalculate totals and weights
    this.recalculatePortfolio(pf);
    this.savePortfolios(list);
  }

  public updatePortfolioQuotes(portfolioId: string, quotes: Record<string, Quote>) {
    const list = this.getPortfolios();
    const pf = list.find(p => p.id === portfolioId);
    if (!pf) return;

    let updated = false;
    for (const h of pf.holdings) {
      const q = quotes[h.symbol.toUpperCase()];
      if (q && q.price > 0 && q.price !== h.currentPrice) {
        h.currentPrice = q.price;
        updated = true;
      }
    }

    if (updated) {
      this.recalculatePortfolio(pf);
      this.savePortfolios(list);
    }
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
