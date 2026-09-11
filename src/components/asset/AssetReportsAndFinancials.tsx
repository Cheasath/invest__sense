import React, { useState } from 'react';
import { Asset, MultiYearFinancials, AnnualReportItem, ResearchPaperItem } from '../../types';
import {
  FileText,
  FileCheck,
  Download,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  BarChart3,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Percent,
  Calculator,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface AssetReportsAndFinancialsProps {
  asset: Asset;
  financials: MultiYearFinancials;
  annualReports: AnnualReportItem[];
  researchPapers: ResearchPaperItem[];
}

export const AssetReportsAndFinancials: React.FC<AssetReportsAndFinancialsProps> = ({
  asset,
  financials,
  annualReports,
  researchPapers
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'FINANCIALS' | 'ANNUAL_REPORTS' | 'RESEARCH_PAPERS' | 'DCF'>('FINANCIALS');
  const [selectedReport, setSelectedReport] = useState<AnnualReportItem | null>(annualReports[0] || null);
  const [reportViewerOpen, setReportViewerOpen] = useState(false);

  // Revenue & Net Income comparison chart data
  const chartData = financials.years.map((year, idx) => ({
    year,
    Revenue: financials.revenueINR[idx],
    EBITDA: financials.ebitdaINR[idx],
    NetIncome: financials.netIncomeINR[idx]
  }));

  const currencySym = asset.currency === 'USD' ? '$' : '₹';

  return (
    <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
      {/* Sub-Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#232B36] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono w-full sm:w-auto">
          {[
            { id: 'FINANCIALS', label: 'Multi-Year Statements', icon: BarChart3 },
            { id: 'DCF', label: 'DCF Fair Value Model', icon: Calculator },
            { id: 'ANNUAL_REPORTS', label: `Annual Reports (${annualReports.length})`, icon: FileText },
            { id: 'RESEARCH_PAPERS', label: `Institutional Research (${researchPapers.length})`, icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#2DD4BF] text-[#0D1117] font-bold shadow-sm'
                    : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8B96A5] self-end sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>SEBI / SEC Verified Disclosures</span>
        </div>
      </div>

      {/* 1. MULTI-YEAR FINANCIAL STATEMENTS */}
      {activeSubTab === 'FINANCIALS' && (
        <div className="space-y-6">
          {/* Key Health Ratio Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <span className="text-[#8B96A5] text-[10px] uppercase">Piotroski F-Score</span>
              <div className="text-xl font-bold text-[#2DD4BF]">
                {financials.piotroskiFScore} / 9
              </div>
              <div className="text-[10px] text-[#22C55E]">High Fundamental Health</div>
            </div>

            <div className="p-3.5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <span className="text-[#8B96A5] text-[10px] uppercase">Altman Z-Score</span>
              <div className="text-xl font-bold text-[#2DD4BF]">
                {financials.altmanZScore}
              </div>
              <div className="text-[10px] text-[#22C55E]">Safe Zone (Low Distress)</div>
            </div>

            <div className="p-3.5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <span className="text-[#8B96A5] text-[10px] uppercase">Return on Equity (ROE)</span>
              <div className="text-xl font-bold text-[#E5E7EB]">
                {financials.roePct}%
              </div>
              <div className="text-[10px] text-[#8B96A5]">Capital Compounding</div>
            </div>

            <div className="p-3.5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-1">
              <span className="text-[#8B96A5] text-[10px] uppercase">Debt / Equity</span>
              <div className="text-xl font-bold text-[#E5E7EB]">
                {financials.debtToEquity}x
              </div>
              <div className="text-[10px] text-[#22C55E]">Net Cash Balance Sheet</div>
            </div>
          </div>

          {/* Revenue & Profit Growth Chart */}
          <div className="bg-[#1C2530]/50 border border-[#232B36] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#E5E7EB]">5-Year Revenue vs Operating Profit vs Net Income</span>
              <span className="text-[#8B96A5]">INR in Crores (or Normalized)</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="year" stroke="#8B96A5" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8B96A5" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', color: '#E5E7EB' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Revenue" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="EBITDA" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NetIncome" fill="#F5B841" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Multi-Year Financials Table */}
          <div className="overflow-x-auto rounded-xl border border-[#232B36]">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#1C2530] text-[#8B96A5] uppercase text-[10px] border-b border-[#232B36]">
                <tr>
                  <th className="p-3">Financial Metric</th>
                  {financials.years.map(y => (
                    <th key={y} className="p-3 text-right">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B36]/50">
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#E5E7EB] font-bold">Total Revenue (₹ Cr)</td>
                  {financials.revenueINR.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#E5E7EB]">{v.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#E5E7EB]">Operating Profit (EBITDA)</td>
                  {financials.ebitdaINR.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#60A5FA]">{v.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#8B96A5]">Operating Margin %</td>
                  {financials.operatingMarginPct.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#8B96A5]">{v}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#E5E7EB] font-bold">Net Profit (PAT)</td>
                  {financials.netIncomeINR.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#22C55E]">{v.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#E5E7EB]">Earnings Per Share (EPS)</td>
                  {financials.epsINR.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#E5E7EB]">{currencySym}{v}</td>
                  ))}
                </tr>
                <tr className="hover:bg-[#1C2530]/40">
                  <td className="p-3 text-[#8B96A5]">Free Cash Flow (FCF)</td>
                  {financials.fcfINR.map((v, i) => (
                    <td key={i} className="p-3 text-right text-[#2DD4BF]">{v.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. DCF VALUATION MODEL */}
      {activeSubTab === 'DCF' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {/* Bear Case */}
            <div className="p-5 rounded-2xl bg-[#1C2530] border border-[#232B36] space-y-2">
              <span className="text-[10px] text-[#FB4B5C] uppercase font-bold tracking-wider">Bear Case Value</span>
              <div className="text-2xl font-bold text-[#E5E7EB]">
                {currencySym}{financials.dcfValuation.fairValueBear.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#8B96A5]">
                Assumes severe margin compression and terminal growth slowing to 3.5%.
              </p>
            </div>

            {/* Base Case (Intrinsic Fair Value) */}
            <div className="p-5 rounded-2xl bg-[#2DD4BF]/10 border-2 border-[#2DD4BF] space-y-2">
              <span className="text-[10px] text-[#2DD4BF] uppercase font-bold tracking-wider">Intrinsic Fair Value (Base)</span>
              <div className="text-3xl font-bold text-[#2DD4BF]">
                {currencySym}{financials.dcfValuation.fairValueBase.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-bold text-[#22C55E] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Margin of Safety: +{financials.dcfValuation.marginOfSafetyPct}%</span>
              </div>
              <p className="text-xs text-[#8B96A5]">
                2-Stage Free Cash Flow to Firm (FCFF) discounted at {financials.dcfValuation.waccPct}% WACC.
              </p>
            </div>

            {/* Bull Case */}
            <div className="p-5 rounded-2xl bg-[#1C2530] border border-[#232B36] space-y-2">
              <span className="text-[10px] text-[#60A5FA] uppercase font-bold tracking-wider">Bull Case Target</span>
              <div className="text-2xl font-bold text-[#E5E7EB]">
                {currencySym}{financials.dcfValuation.fairValueBull.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#8B96A5]">
                Assumes aggressive market share gains and operating leverage expanding EBITDA margin by +300 bps.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#1C2530] rounded-xl border border-[#232B36] space-y-2 text-xs font-mono">
            <div className="font-bold text-[#E5E7EB] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#2DD4BF]" />
              <span>DCF Model Assumptions & Methodology</span>
            </div>
            <p className="text-[#8B96A5] leading-relaxed">
              Intrinsic fair value is determined by projecting 10-year normalized Free Cash Flow to Firm (FCFF) with a Weighted Average Cost of Capital (WACC) of {financials.dcfValuation.waccPct}%, factoring in the risk-free rate of 10Y Indian Government Securities (7.15%) and an equity risk premium of 5.5%. Terminal growth rate is bounded at {financials.dcfValuation.terminalGrowthPct}% in line with long-term GDP growth.
            </p>
          </div>
        </div>
      )}

      {/* 3. COMPANY ANNUAL REPORTS & STATUTORY FILINGS */}
      {activeSubTab === 'ANNUAL_REPORTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {annualReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF]/50 transition-all space-y-3 font-mono"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2DD4BF]/20 text-[#2DD4BF]">
                        {report.year}
                      </span>
                      <span className="text-[10px] text-[#8B96A5]">
                        Filed: {report.filingDate}
                      </span>
                      <span className="text-[10px] text-[#8B96A5]">
                        {report.pages} Pages
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#E5E7EB]">
                      {report.title}
                    </h4>
                  </div>
                  <FileText className="w-5 h-5 text-[#2DD4BF] shrink-0" />
                </div>

                <div className="p-2.5 bg-[#161B22] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8B96A5]">Independent Auditor:</span>
                    <span className="text-[#E5E7EB] font-bold truncate max-w-[200px]">{report.auditor}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8B96A5]">Audit Opinion:</span>
                    <span className="text-[#22C55E] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{report.auditorOpinion.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase text-[#8B96A5] font-bold">Key Executive Highlights:</span>
                  <ul className="list-disc list-inside text-[11px] text-[#8B96A5] space-y-1">
                    {report.keyHighlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="truncate">{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#232B36] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setReportViewerOpen(true);
                    }}
                    className="text-xs text-[#2DD4BF] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Read Executive Summary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => alert(`Downloading verified annual report ${report.year} for ${asset.name}`)}
                    className="px-2.5 py-1 rounded bg-[#161B22] border border-[#232B36] text-[11px] text-[#E5E7EB] hover:border-[#2DD4BF] flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#2DD4BF]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ADVANCED INSTITUTIONAL RESEARCH PAPERS */}
      {activeSubTab === 'RESEARCH_PAPERS' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {researchPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-6 rounded-2xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF]/50 transition-all space-y-4 font-mono"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#232B36] pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-[#2DD4BF] font-bold">{paper.analystFirm}</span>
                      <span className="text-[#8B96A5]">• Published {paper.publicationDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#E5E7EB] mt-0.5">
                      {paper.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-bold text-xs">
                      {paper.rating.replace(/_/g, ' ')}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-[#8B96A5]">Target Price</div>
                      <div className="text-sm font-bold text-[#2DD4BF]">
                        {currencySym}{paper.targetPrice} (+{paper.upsidePotentialPct}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#161B22] rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#2DD4BF] font-bold">
                    <Award className="w-4 h-4" />
                    <span>Economic Moat: {paper.economicMoat.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-[#8B96A5] leading-relaxed">
                    {paper.thesisSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-[#161B22] rounded-xl space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#22C55E] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Key Catalysts
                    </span>
                    <ul className="space-y-1 text-[#8B96A5] text-[11px]">
                      {paper.keyCatalysts.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#2DD4BF]">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-[#161B22] rounded-xl space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#FB4B5C] flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Downside Risks
                    </span>
                    <ul className="space-y-1 text-[#8B96A5] text-[11px]">
                      {paper.downsideRisks.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#FB4B5C]">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#232B36]">
                  <span className="text-[11px] text-[#8B96A5]">
                    Authorized for institutional clients & individual investors
                  </span>
                  <button
                    onClick={() => alert(`Opening comprehensive research deck for ${paper.title}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Free Institutional Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT VIEWER MODAL */}
      {reportViewerOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-5 shadow-2xl font-mono">
            <div className="flex items-start justify-between border-b border-[#232B36] pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] text-[10px] font-bold">
                  {selectedReport.year} Statutory Disclosures
                </span>
                <h3 className="text-base font-bold text-[#E5E7EB] mt-1">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setReportViewerOpen(false)}
                className="text-[#8B96A5] hover:text-[#E5E7EB] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#1C2530] rounded-xl text-xs space-y-1">
              <div className="text-[#2DD4BF] font-bold">Auditor Verification</div>
              <div className="text-[#E5E7EB]">{selectedReport.auditor}</div>
              <div className="text-[#22C55E] text-[11px] font-bold">Opinion: {selectedReport.auditorOpinion}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#E5E7EB] uppercase">Key Auditor & Management Findings:</div>
              <div className="space-y-2 text-xs text-[#8B96A5]">
                {selectedReport.keyHighlights.map((h, i) => (
                  <div key={i} className="p-3 bg-[#1C2530]/50 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#232B36]">
              <button
                onClick={() => setReportViewerOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1C2530] text-[#8B96A5] hover:text-[#E5E7EB] text-xs font-bold"
              >
                Close Disclosures
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${selectedReport.title}`);
                  setReportViewerOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#0D1117] text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Filing PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
