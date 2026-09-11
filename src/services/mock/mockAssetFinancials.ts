import { MultiYearFinancials, AnnualReportItem, ResearchPaperItem } from '../../types';
import { resolveAsset } from './mockUniverse';

export function getAssetFinancials(symbol: string): MultiYearFinancials {
  const asset = resolveAsset(symbol);
  const basePrice = asset.currency === 'USD' ? 250 : 1500;
  
  // Synthesize realistic historical trajectory
  return {
    years: ['FY21', 'FY22', 'FY23', 'FY24', 'TTM'],
    revenueINR: [584000, 712000, 895000, 1042000, 1185000], // in Cr or normalized
    ebitdaINR: [112000, 145000, 192000, 238000, 274000],
    netIncomeINR: [68000, 92000, 128000, 164000, 191000],
    operatingMarginPct: [19.2, 20.4, 21.5, 22.8, 23.1],
    epsINR: [+(basePrice * 0.038).toFixed(1), +(basePrice * 0.046).toFixed(1), +(basePrice * 0.054).toFixed(1), +(basePrice * 0.065).toFixed(1), +(basePrice * 0.072).toFixed(1)],
    fcfINR: [52000, 74000, 102000, 134000, 158000],
    totalAssetsINR: [890000, 1020000, 1240000, 1480000, 1690000],
    totalDebtINR: [120000, 115000, 98000, 84000, 72000],
    netDebtINR: [45000, 28000, -12000, -42000, -85000], // Net cash positive
    equityINR: [540000, 680000, 890000, 1120000, 1320000],
    roePct: 18.6,
    rocePct: 22.4,
    debtToEquity: 0.06,
    currentRatio: 2.34,
    piotroskiFScore: 8, // Out of 9 (Top quality tier)
    altmanZScore: 4.15, // Safe Zone (> 3.0 is exceptionally safe from distress)
    dcfValuation: {
      waccPct: 10.8,
      terminalGrowthPct: 5.5,
      fairValueBase: +(basePrice * 1.18).toFixed(2),
      fairValueBull: +(basePrice * 1.42).toFixed(2),
      fairValueBear: +(basePrice * 0.88).toFixed(2),
      marginOfSafetyPct: 15.2
    }
  };
}

export function getAssetAnnualReports(symbol: string): AnnualReportItem[] {
  const asset = resolveAsset(symbol);
  return [
    {
      id: `rep_${symbol}_fy24`,
      year: 'FY 2023-24',
      title: `${asset.name} - 47th Integrated Annual Report & Financial Disclosures`,
      fileType: 'PDF',
      filingDate: '2024-07-18',
      category: 'ANNUAL_REPORT',
      pages: 412,
      auditor: 'Deloitte Haskins & Sells LLP / S.R. Batliboi & Co.',
      auditorOpinion: 'UNQUALIFIED_CLEAN',
      keyHighlights: [
        'Consolidated gross revenue expanded 14.8% YoY driven by enterprise adoption and retail footfall expansion.',
        'Net Cash Flow from Operations stood at robust levels, supporting self-funded capital expenditures.',
        'Auditor reaffirmed an unqualified clean audit opinion with zero material internal control deficiencies.',
        'Board recommended a total dividend payout of 28% on net profits.'
      ],
      pdfDownloadUrl: '#'
    },
    {
      id: `rep_${symbol}_esg24`,
      year: 'FY 2023-24',
      title: `${asset.name} - Sustainability & Business Responsibility (BRSR) Report`,
      fileType: 'PDF',
      filingDate: '2024-08-04',
      category: 'ESG_REPORT',
      pages: 148,
      auditor: 'KPMG Sustainability Services',
      auditorOpinion: 'UNQUALIFIED_CLEAN',
      keyHighlights: [
        'Achieved 42% renewable energy sourcing across operational manufacturing and data facilities.',
        'Water recycling ratio improved to 88%, certified as water-positive across primary campuses.',
        'Governance: 50% Independent Directors on Board with separate Chairman and CEO designations.'
      ],
      pdfDownloadUrl: '#'
    },
    {
      id: `rep_${symbol}_q4fy24`,
      year: 'Q4 FY24',
      title: `${asset.name} - Institutional Earnings Call Transcript & Management Deck`,
      fileType: 'INTERACTIVE_FILING',
      filingDate: '2024-04-26',
      category: 'EARNINGS_CALL_TRANSCRIPT',
      pages: 45,
      auditor: 'Audit Committee of the Board',
      auditorOpinion: 'UNQUALIFIED_CLEAN',
      keyHighlights: [
        'CEO Commentary: "Robust order pipeline across domestic digital transformation and global supply chain diversification."',
        'CFO Guidance: Target operating margin band maintained at 22-24% for the ensuing fiscal year.',
        'Institutional investor Q&A addressed working capital optimization and R&D capital intensity.'
      ],
      pdfDownloadUrl: '#'
    },
    {
      id: `rep_${symbol}_fy23`,
      year: 'FY 2022-23',
      title: `${asset.name} - Annual Statutory Filing & SEBI Corporate Governance`,
      fileType: 'PDF',
      filingDate: '2023-07-20',
      category: 'ANNUAL_REPORT',
      pages: 386,
      auditor: 'BSR & Co. LLP',
      auditorOpinion: 'UNQUALIFIED_CLEAN',
      keyHighlights: [
        'Complete balance sheet reconciliation and historical audited schedules.',
        'Related Party Transaction disclosures fully aligned with MCA Regulation 23 compliance.',
        'Disclosed management shareholding and employee stock ownership option vestings.'
      ],
      pdfDownloadUrl: '#'
    }
  ];
}

export function getAssetResearchPapers(symbol: string): ResearchPaperItem[] {
  const asset = resolveAsset(symbol);
  const basePrice = asset.currency === 'USD' ? 250 : 1500;

  return [
    {
      id: `paper_${symbol}_institutional`,
      title: `Institutional Equity Research: ${asset.name} (${asset.symbol}) - Structural Moat & Compound Growth`,
      analystFirm: 'Morgan Stanley / Goldman Sachs Global Equity Research',
      publicationDate: '2024-08-15',
      rating: 'STRONG_BUY',
      targetPrice: +(basePrice * 1.28).toFixed(2),
      currentPriceAtNote: basePrice,
      upsidePotentialPct: 28.0,
      economicMoat: 'WIDE_MOAT',
      thesisSummary: `${asset.name} maintains an unassailable economic moat supported by scale economies, proprietary distribution channels, and deep customer switching costs. Free cash flow generation comfortably outpaces industry peers, providing balance sheet optionality.`,
      keyCatalysts: [
        'Operating leverage kicking in as capacity utilization surpasses 86%.',
        'Strong capital allocation efficiency with incremental ROCE exceeding 24%.',
        'Expanding total addressable market through cross-border exports and digital platform integration.'
      ],
      downsideRisks: [
        'Short-term margin compression from raw material commodity price volatility.',
        'Macroeconomic slowdown dampening discretionary consumer spend.',
        'Regulatory tariff revisions in key export jurisdictions.'
      ],
      pdfDownloadUrl: '#'
    },
    {
      id: `paper_${symbol}_dcf_valuation`,
      title: `Discounted Cash Flow (DCF) & Sensitivity Framework: ${asset.symbol}`,
      analystFirm: 'InvestSense Institutional Quant & Strategy Desk',
      publicationDate: '2024-09-02',
      rating: 'BUY',
      targetPrice: +(basePrice * 1.22).toFixed(2),
      currentPriceAtNote: basePrice,
      upsidePotentialPct: 22.0,
      economicMoat: 'WIDE_MOAT',
      thesisSummary: `Using a 2-stage Free Cash Flow to Firm (FCFF) model with a conservative 10.8% WACC and a 5.5% terminal growth rate, the intrinsic fair value is estimated at a 15-20% premium to current trading multiples.`,
      keyCatalysts: [
        'Deleveraged balance sheet with negative net debt enables continuous share buybacks.',
        'ROIC consistently outperforming cost of capital by 900+ basis points.'
      ],
      downsideRisks: [
        'Interest rate normalization potentially compressing equity risk premium multiples.'
      ],
      pdfDownloadUrl: '#'
    }
  ];
}
