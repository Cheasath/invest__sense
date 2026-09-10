import { Asset, Quote } from '../../types';

export const CURATED_UNIVERSE: Asset[] = [
  // Large Cap Equities
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', assetClass: 'EQUITY', sector: 'Energy & Petrochemicals', marketCapINR: 19800000000000, beta: 1.05, peRatio: 26.4, yieldPct: 0.4, description: 'India\'s largest conglomerate operating in energy, retail, and telecommunications.', region: 'IN', currency: 'INR' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', assetClass: 'EQUITY', sector: 'Information Technology', marketCapINR: 14200000000000, beta: 0.82, peRatio: 29.1, yieldPct: 1.3, description: 'Global leader in IT services, consulting, and business solutions.', region: 'IN', currency: 'INR' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', assetClass: 'EQUITY', sector: 'Financial Services', marketCapINR: 12500000000000, beta: 0.95, peRatio: 18.7, yieldPct: 1.1, description: 'India\'s largest private sector bank with extensive retail and corporate banking network.', region: 'IN', currency: 'INR' },
  { symbol: 'INFY', name: 'Infosys Ltd.', assetClass: 'EQUITY', sector: 'Information Technology', marketCapINR: 6900000000000, beta: 0.91, peRatio: 24.8, yieldPct: 2.1, description: 'Next-generation digital services and consulting pioneer.', region: 'IN', currency: 'INR' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', assetClass: 'EQUITY', sector: 'Financial Services', marketCapINR: 8400000000000, beta: 1.12, peRatio: 17.2, yieldPct: 0.8, description: 'Leading Indian multinational banking and financial services institution.', region: 'IN', currency: 'INR' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', assetClass: 'EQUITY', sector: 'Telecommunications', marketCapINR: 7900000000000, beta: 0.78, peRatio: 42.1, yieldPct: 0.6, description: 'Premier telecom operator across India and Africa.', region: 'IN', currency: 'INR' },
  { symbol: 'ITC', name: 'ITC Ltd.', assetClass: 'EQUITY', sector: 'Consumer Goods (FMCG)', marketCapINR: 5800000000000, beta: 0.62, peRatio: 27.5, yieldPct: 3.4, description: 'Diversified FMCG, hotel, paperboards, and agri-business leader.', region: 'IN', currency: 'INR' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', assetClass: 'EQUITY', sector: 'Infrastructure & Engineering', marketCapINR: 4900000000000, beta: 1.18, peRatio: 32.6, yieldPct: 0.9, description: 'EPC projects, high-tech manufacturing, and construction giant.', region: 'IN', currency: 'INR' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', assetClass: 'EQUITY', sector: 'Automobile', marketCapINR: 3500000000000, beta: 1.35, peRatio: 15.4, yieldPct: 0.7, description: 'Leading automaker including commercial vehicles, passenger cars, and Jaguar Land Rover.', region: 'IN', currency: 'INR' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', assetClass: 'EQUITY', sector: 'Consumer Goods (FMCG)', marketCapINR: 5600000000000, beta: 0.55, peRatio: 52.0, yieldPct: 1.8, description: 'India\'s largest FMCG company touching 9 out of 10 households.', region: 'IN', currency: 'INR' },
  { symbol: 'SBIN', name: 'State Bank of India', assetClass: 'EQUITY', sector: 'Financial Services', marketCapINR: 7300000000000, beta: 1.25, peRatio: 11.2, yieldPct: 1.6, description: 'India\'s largest public sector commercial bank and financial services entity.', region: 'IN', currency: 'INR' },

  // Mid & High Growth Equities
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', assetClass: 'EQUITY', sector: 'Financial Services', marketCapINR: 4200000000000, beta: 1.28, peRatio: 29.3, yieldPct: 0.5, description: 'Non-banking financial company specializing in consumer lending and wealth management.', region: 'IN', currency: 'INR' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', assetClass: 'EQUITY', sector: 'Consumer Discretionary', marketCapINR: 2900000000000, beta: 0.88, peRatio: 78.5, yieldPct: 0.3, description: 'Leading jewelry, watches, and eyewear retailer owned by Tata Group.', region: 'IN', currency: 'INR' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', assetClass: 'EQUITY', sector: 'Healthcare & Pharma', marketCapINR: 4100000000000, beta: 0.65, peRatio: 36.8, yieldPct: 0.8, description: 'India\'s largest specialty pharmaceutical company globally.', region: 'IN', currency: 'INR' },
  { symbol: 'NTPC', name: 'NTPC Ltd.', assetClass: 'EQUITY', sector: 'Utilities & Power', marketCapINR: 3800000000000, beta: 0.92, peRatio: 17.5, yieldPct: 2.2, description: 'India\'s largest power generation utility transitioning to renewables.', region: 'IN', currency: 'INR' },

  // Index ETFs & Sectoral ETFs
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty 50 BeES', assetClass: 'ETF', sector: 'Broad Market ETF', beta: 1.00, yieldPct: 1.2, description: 'Tracks the Nifty 50 Index representing the top 50 bluechip companies in India.', region: 'IN', currency: 'INR' },
  { symbol: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50', assetClass: 'ETF', sector: 'Midcap ETF', beta: 1.15, yieldPct: 0.9, description: 'Tracks the Nifty Next 50 Index representing high-growth large-mid companies.', region: 'IN', currency: 'INR' },
  { symbol: 'BANKBEES', name: 'Nippon India ETF Bank BeES', assetClass: 'ETF', sector: 'Banking & Financials ETF', beta: 1.12, yieldPct: 0.8, description: 'Tracks the Nifty Bank Index containing top liquid public and private banks.', region: 'IN', currency: 'INR' },
  { symbol: 'ITBEES', name: 'Nippon India ETF IT', assetClass: 'ETF', sector: 'Technology ETF', beta: 0.88, yieldPct: 1.5, description: 'Targeted exposure to top Indian IT services exporters.', region: 'IN', currency: 'INR' },
  { symbol: 'PHARMABEES', name: 'Nippon India ETF Pharma', assetClass: 'ETF', sector: 'Healthcare ETF', beta: 0.60, yieldPct: 0.7, description: 'Targeted exposure to top pharma and healthcare businesses.', region: 'IN', currency: 'INR' },

  // Gold & Commodities
  { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', assetClass: 'GOLD', sector: 'Precious Metals', beta: -0.15, yieldPct: 0.0, description: 'Physical gold-backed exchange traded fund offering gold price stability.', region: 'IN', currency: 'INR' },
  { symbol: 'SGB_MAY2031', name: 'Sovereign Gold Bond 2.5% 2031', assetClass: 'GOLD', sector: 'Government Gold Bond', beta: -0.12, yieldPct: 2.5, description: 'RBI-issued gold bond offering capital appreciation linked to gold plus 2.5% p.a. interest.', region: 'IN', currency: 'INR' },
  { symbol: 'SILVERBEES', name: 'Nippon India ETF Silver BeES', assetClass: 'COMMODITY', sector: 'Precious Metals', beta: 0.25, yieldPct: 0.0, description: 'Direct investment in physical silver bullion.', region: 'IN', currency: 'INR' },

  // Bonds & Government Securities
  { symbol: 'IN_10Y_GSEC', name: 'India 10-Year Government Securities Bond', assetClass: 'BOND', sector: 'Sovereign Fixed Income', beta: 0.05, yieldPct: 7.15, description: 'Risk-free 10-year Indian sovereign benchmark paper yielding ~7.15% p.a.', region: 'IN', currency: 'INR' },
  { symbol: 'CORP_BOND_AAA', name: 'HDFC Corporate Bond Fund (AAA Rated)', assetClass: 'BOND', sector: 'Corporate Debt', beta: 0.08, yieldPct: 7.65, description: 'High quality corporate bonds rated AAA offering steady capital protection.', region: 'IN', currency: 'INR' },
  { symbol: 'LIQUID_ETF', name: 'DSP Liquid ETF', assetClass: 'CASH', sector: 'Short Term Money Market', beta: 0.01, yieldPct: 6.80, description: 'Ultra-low risk liquid market instrument yielding daily overnight returns.', region: 'IN', currency: 'INR' },

  // Index Futures / Options Benchmarks
  { symbol: 'NIFTY_FUT', name: 'Nifty 50 Index Futures Current Month', assetClass: 'FUTURES_OPTIONS', sector: 'Index Derivatives', beta: 1.00, description: 'Near-month Nifty 50 derivative contract.', region: 'IN', currency: 'INR' },
  { symbol: 'BANKNIFTY_FUT', name: 'Nifty Bank Futures Current Month', assetClass: 'FUTURES_OPTIONS', sector: 'Index Derivatives', beta: 1.15, description: 'Near-month Nifty Bank derivative contract.', region: 'IN', currency: 'INR' }
];

// Baseline prices for Indian market (in INR)
export const INITIAL_BASE_QUOTES: Record<string, { price: number; prevClose: number }> = {
  RELIANCE: { price: 2980.50, prevClose: 2945.00 },
  TCS: { price: 4185.20, prevClose: 4140.00 },
  HDFCBANK: { price: 1642.80, prevClose: 1630.00 },
  INFY: { price: 1812.40, prevClose: 1825.00 },
  ICICIBANK: { price: 1215.60, prevClose: 1202.10 },
  BHARTIARTL: { price: 1485.00, prevClose: 1472.50 },
  ITC: { price: 492.30, prevClose: 488.50 },
  LT: { price: 3620.00, prevClose: 3590.00 },
  TATAMOTORS: { price: 1025.40, prevClose: 1010.00 },
  HINDUNILVR: { price: 2680.10, prevClose: 2695.00 },
  SBIN: { price: 845.20, prevClose: 838.00 },
  BAJFINANCE: { price: 6890.00, prevClose: 6820.00 },
  TITAN: { price: 3450.00, prevClose: 3410.00 },
  SUNPHARMA: { price: 1720.50, prevClose: 1712.00 },
  NTPC: { price: 410.20, prevClose: 405.00 },

  NIFTYBEES: { price: 268.40, prevClose: 265.80 },
  JUNIORBEES: { price: 742.10, prevClose: 735.00 },
  BANKBEES: { price: 540.80, prevClose: 536.20 },
  ITBEES: { price: 42.10, prevClose: 42.50 },
  PHARMABEES: { price: 24.80, prevClose: 24.60 },

  GOLDBEES: { price: 68.20, prevClose: 67.80 },
  SGB_MAY2031: { price: 7250.00, prevClose: 7210.00 },
  SILVERBEES: { price: 88.50, prevClose: 87.20 },

  IN_10Y_GSEC: { price: 100.80, prevClose: 100.75 },
  CORP_BOND_AAA: { price: 1050.00, prevClose: 1049.50 },
  LIQUID_ETF: { price: 1000.25, prevClose: 1000.00 },

  NIFTY_FUT: { price: 24450.00, prevClose: 24320.00 },
  BANKNIFTY_FUT: { price: 51200.00, prevClose: 50850.00 }
};

export function generateFallbackQuote(symbol: string): Quote {
  const asset = CURATED_UNIVERSE.find(a => a.symbol === symbol.toUpperCase()) || {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    assetClass: 'EQUITY',
    sector: 'General',
    description: 'Indian listed security',
    region: 'IN',
    currency: 'INR'
  };

  const base = INITIAL_BASE_QUOTES[symbol.toUpperCase()] || { price: 1000, prevClose: 990 };
  
  // Slight deterministic noise based on time
  const now = Date.now();
  const seed = Math.sin(now / 10000 + symbol.length) * 0.003;
  const currentPrice = +(base.price * (1 + seed)).toFixed(2);
  const change = +(currentPrice - base.prevClose).toFixed(2);
  const changePct = +((change / base.prevClose) * 100).toFixed(2);

  return {
    symbol: asset.symbol,
    name: asset.name,
    price: currentPrice,
    change,
    changePct,
    high24h: +(currentPrice * 1.015).toFixed(2),
    low24h: +(currentPrice * 0.985).toFixed(2),
    volume: Math.floor(150000 + Math.random() * 500000),
    prevClose: base.prevClose,
    assetClass: asset.assetClass,
    sector: asset.sector,
    fetchedAt: new Date().toISOString(),
    provider: 'InvestSense EOD Cache',
    isDelayed: false
  };
}
