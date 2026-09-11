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
  financialDna?: UserFinancialDNA;
}

// ----------------------------------------------------
// 1. USER FINANCIAL DNA ENGINE SPECIFICATION
// ----------------------------------------------------
export interface RiskCapacityInputs {
  age: number;
  monthlyIncomeINR: number;
  incomeStability: 'VERY_STABLE_GOVT' | 'STABLE_CORPORATE' | 'VARIABLE_BUSINESS' | 'VOLATILE_FREELANCE';
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'RETIRED' | 'PROFESSIONAL';
  liquidSavingsINR: number;
  emergencyFundMonths: number; // Months of living expenses covered
  totalOutstandingDebtINR: number;
  monthlyEMIObligationsINR: number;
  numberOfDependents: number;
  insuranceCoverage: 'ADEQUATE' | 'PARTIAL' | 'NONE'; // Health & Term life
  existingInvestmentsINR: number;
  futureMajorExpenseYears: number; // Years until major capital drain (house, education, wedding)
  futureExpenseAmountINR: number;
  investmentHorizonYears: number;
}

export interface RiskToleranceInputs {
  marketDipReaction: 'SELL_ALL' | 'REDUCE_SOME' | 'HOLD_DISCIPLINED' | 'BUY_MORE';
  volatilityComfortScore: number; // 1 to 10
  prolongedStagnationReaction: 'EXIT_EQUITIES' | 'SWITCH_CONSERVATIVE' | 'STAY_COURSE' | 'ACCUMULATE_SIP';
  maxLossComfortPct: number; // e.g., 10, 15, 20, 30%
}

export interface RiskRequirementInputs {
  currentCapitalINR: number;
  targetGoalAmountINR: number;
  goalHorizonYears: number;
  monthlyContributionINR: number;
  goalType: 'WEALTH_CREATION' | 'RETIREMENT' | 'HOUSE_PURCHASE' | 'CHILD_EDUCATION' | 'FINANCIAL_FREEDOM';
}

export interface RiskPerceptionInputs {
  fearOfVolatilityScore: number; // 1-10
  fearOfDrawdownScore: number; // 1-10
  fomoScore: number; // 1-10
  overconfidenceScore: number; // 1-10
  lossAversionIndex: number; // 1-10
  panicSellingProbability: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
}

export interface GoalFeasibilityResult {
  requiredAnnualReturnPct: number; // e.g. 18.4%
  isFeasible: boolean; // False if return > capacity or > 14% long-term equity CAGR
  status: 'HIGHLY_FEASIBLE' | 'CALIBRATED_REALISTIC' | 'FEASIBILITY_ALERT_UNREALISTIC';
  alertTitle?: string;
  alertMessage?: string;
  suggestedAlternatives: {
    title: string;
    description: string;
    impact: string;
  }[];
}

export interface UserFinancialDNA {
  capacityInputs: RiskCapacityInputs;
  toleranceInputs: RiskToleranceInputs;
  requirementInputs: RiskRequirementInputs;
  perceptionInputs: RiskPerceptionInputs;

  // Calculated 4-Dimension Scores (0 - 100)
  riskCapacityScore: number;
  riskCapacityTier: 'LOW' | 'LOW_MEDIUM' | 'MEDIUM' | 'MEDIUM_HIGH' | 'HIGH';

  riskToleranceScore: number;
  riskToleranceTier: 'LOW' | 'MODERATE' | 'BALANCED' | 'HIGH';

  riskRequirementScore: number;
  goalFeasibility: GoalFeasibilityResult;

  riskPerceptionScore: number;
  behavioralBiases: {
    bias: string;
    level: 'LOW' | 'MODERATE' | 'HIGH';
    mitigationStrategy: string;
  }[];

  // The Master Final Risk Formulation:
  // Final Risk Budget = min(Risk Capacity, Risk Requirement Constraint, Psychological Tolerance Ceiling)
  finalRiskBudget: number; // 0 - 100
  finalRiskCategory: 'CONSERVATIVE' | 'MODERATE' | 'BALANCED' | 'GROWTH' | 'AGGRESSIVE';
  maxPermittedDrawdownPct: number;
  maxEquityAllocationPct: number;
  targetVolatilityCeilingPct: number;
  governingConstraint: 'RISK_CAPACITY_LIMIT' | 'RISK_REQUIREMENT_LIMIT' | 'PSYCHOLOGICAL_TOLERANCE_CEILING';
  governingReason: string;

  lastUpdated: string;
}

// ----------------------------------------------------
// 2. ASSET FINANCIAL REPORTS & PAPERS SPECIFICATION
// ----------------------------------------------------
export interface AnnualReportItem {
  id: string;
  year: string;
  title: string;
  fileType: 'PDF' | 'INTERACTIVE_FILING';
  filingDate: string;
  category: 'ANNUAL_REPORT' | 'ESG_REPORT' | 'EARNINGS_CALL_TRANSCRIPT' | 'GOVERNANCE_DISCLOSURE';
  pages: number;
  auditor: string;
  auditorOpinion: 'UNQUALIFIED_CLEAN' | 'QUALIFIED' | 'ADVERSE';
  keyHighlights: string[];
  pdfDownloadUrl?: string;
}

export interface ResearchPaperItem {
  id: string;
  title: string;
  analystFirm: string;
  publicationDate: string;
  rating: 'STRONG_BUY' | 'BUY' | 'ACCUMULATE' | 'HOLD' | 'TRIM';
  targetPrice: number;
  currentPriceAtNote: number;
  upsidePotentialPct: number;
  economicMoat: 'WIDE_MOAT' | 'NARROW_MOAT' | 'NONE';
  thesisSummary: string;
  keyCatalysts: string[];
  downsideRisks: string[];
  pdfDownloadUrl?: string;
}

export interface MultiYearFinancials {
  years: string[]; // e.g. ['FY21', 'FY22', 'FY23', 'FY24', 'TTM']
  revenueINR: number[];
  ebitdaINR: number[];
  netIncomeINR: number[];
  operatingMarginPct: number[];
  epsINR: number[];
  fcfINR: number[];
  totalAssetsINR: number[];
  totalDebtINR: number[];
  netDebtINR: number[];
  equityINR: number[];
  roePct: number;
  rocePct: number;
  debtToEquity: number;
  currentRatio: number;
  piotroskiFScore: number; // 0 - 9
  altmanZScore: number; // e.g. 3.42 (Safe Zone)
  dcfValuation: {
    waccPct: number;
    terminalGrowthPct: number;
    fairValueBase: number;
    fairValueBull: number;
    fairValueBear: number;
    marginOfSafetyPct: number;
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
  assetClass?: 'EQUITY' | 'ETF' | 'MUTUAL_FUND' | 'BOND' | 'GOLD' | 'CASH' | 'COMMODITY' | 'FUTURES_OPTIONS';
  sector?: string;
  peRatio?: number;
  yieldPct?: number;
  fetchedAt: string;
  provider?: string;
  isDelayed?: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  assetClass: 'EQUITY' | 'ETF' | 'MUTUAL_FUND' | 'BOND' | 'GOLD' | 'CASH' | 'COMMODITY' | 'FUTURES_OPTIONS';
  sector: string;
  marketCapINR?: number;
  beta?: number;
  peRatio?: number;
  yieldPct?: number;
  description: string;
  region: 'IN' | 'US' | 'GLOBAL';
  currency: 'INR' | 'USD';
  exchange?: string; // 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE' | 'MCX' | 'BINANCE'
  country?: string; // 'IN' | 'US' | 'GLOBAL'
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

export interface AssetTransaction {
  id: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  assetClass: Quote['assetClass'];
  type: 'BUY' | 'SELL' | 'REBALANCE' | 'DIVIDEND' | 'INITIAL_ALLOCATION';
  timestamp: string; // ISO format date string
  quantity: number;
  price: number;
  totalValue: number;
  realizedPnL?: number; // Only present for SELL actions
  realizedPnLPct?: number;
  avgCostAtExecution?: number;
  cashBalanceAfter: number;
  notes?: string;
}

export interface AssetHoldingLifecycle {
  symbol: string;
  name: string;
  assetClass: Quote['assetClass'];
  sector: string;
  status: 'ACTIVE' | 'LIQUIDATED';
  firstBoughtDate: string;
  lastTradedDate: string;
  holdingPeriodDays: number;
  totalUnitsBought: number;
  totalUnitsSold: number;
  currentQuantity: number;
  totalCapitalInvested: number;
  totalCapitalRealized: number;
  netRealizedPnL: number;
  avgBuyPrice: number;
  currentValue?: number;
  unrealizedPnL?: number;
  unrealizedPnLPct?: number;
  tradesCount: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  baseCurrency: 'INR';
  createdAt: string;
  updatedAt: string;
  holdings: Holding[];
  transactions?: AssetTransaction[];
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
