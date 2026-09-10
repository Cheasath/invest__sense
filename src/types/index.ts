export type UserRole = 'INVESTOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  financialProfile?: {
    age: number;
    annualIncomeINR: number;
    liquidNetWorthINR: number;
    investmentHorizonYears: number;
    primaryGoal: 'CAPITAL_PRESERVATION' | 'BALANCED_GROWTH' | 'AGGRESSIVE_GROWTH' | 'RETIREMENT' | 'INCOME';
    monthlySavingsINR: number;
  };
  riskProfile?: {
    score: number; // 0 - 100
    category: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'GROWTH' | 'AGGRESSIVE';
    maxDrawdownTolerancePct: number;
    factors: {
      factor: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
    }[];
    assessedAt: string;
  };
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  high24h: number;
  low24h: number;
  volume: number;
  prevClose: number;
  assetClass: 'EQUITY' | 'ETF' | 'MUTUAL_FUND' | 'BOND' | 'GOLD' | 'CASH' | 'COMMODITY' | 'FUTURES_OPTIONS';
  sector?: string;
  fetchedAt: string;
  provider?: string;
  isDelayed?: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  assetClass: Quote['assetClass'];
  sector: string;
  marketCapINR?: number;
  beta?: number;
  peRatio?: number;
  yieldPct?: number;
  description: string;
  region: 'IN';
  currency: 'INR';
}

export interface Holding {
  symbol: string;
  name: string;
  assetClass: Quote['assetClass'];
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  weightPct: number;
  targetWeightPct: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  baseCurrency: 'INR';
  createdAt: string;
  updatedAt: string;
  holdings: Holding[];
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPct: number;
  dayPnL: number;
  dayPnLPct: number;
  cashBalance: number;
  healthScore: {
    compositeScore: number; // 0-100
    diversificationScore: number; // 0-100
    riskAlignmentScore: number; // 0-100
    driftScore: number; // 0-100
    status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL_DRIFT';
    insights: string[];
  };
}

export interface Recommendation {
  asset: Asset;
  suitabilityScore: number; // 0 - 100
  recommendationType: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'REBALANCE_ADD';
  diversificationContribution: number; // e.g. +14%
  reasoning: string;
  factors: {
    name: string;
    score: number; // 0 - 100
    weight: number; // e.g. 0.25
    description: string;
  }[];
}

export type ViewMode = 'ABSOLUTE' | 'PERCENTAGE' | 'RISK_ADJUSTED';

export interface DailyPerformance {
  date: string; // YYYY-MM-DD
  pnlINR: number;
  pnlPct: number;
  portfolioValue: number;
  tradesCount: number;
  status: 'WIN' | 'LOSS' | 'BREAKEVEN';
}

export interface BacktestResult {
  strategyName: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  cagrPct: number;
  sharpeRatio: number;
  maxDrawdownPct: number;
  volatilityPct: number;
  winRatePct: number;
  benchmarkCagrPct: number; // Nifty 50
  equityCurve: { date: string; portfolioValue: number; benchmarkValue: number }[];
}

export interface RiskMetrics {
  var95Pct: number; // Value at Risk 95%
  cvar95Pct: number; // Conditional VaR
  maxDrawdownPct: number;
  annualizedVolatilityPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  hhiConcentrationIndex: number; // Herfindahl-Hirschman Index
  diversificationScore: number; // 100 - HHI
  top3SectorConcentrationPct: number;
  betaToNifty: number;
}
