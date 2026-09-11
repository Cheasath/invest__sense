import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useFinancialDna } from '../hooks/useFinancialDna';
import {
  RiskCapacityInputs,
  RiskToleranceInputs,
  RiskRequirementInputs,
  RiskPerceptionInputs,
  UserFinancialDNA
} from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Info,
  Zap,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const FinancialDnaPage: React.FC = () => {
  const { financialDna, saveDna, computeMasterDna } = useFinancialDna();

  // Local state initialized from active DNA
  const [capacity, setCapacity] = useState<RiskCapacityInputs>(financialDna.capacityInputs);
  const [tolerance, setTolerance] = useState<RiskToleranceInputs>(financialDna.toleranceInputs);
  const [requirement, setRequirement] = useState<RiskRequirementInputs>(financialDna.requirementInputs);
  const [perception, setPerception] = useState<RiskPerceptionInputs>(financialDna.perceptionInputs);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CAPACITY' | 'TOLERANCE' | 'REQUIREMENT' | 'PERCEPTION'>('OVERVIEW');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Re-compute DNA preview dynamically on the fly
  const currentPreviewDna: UserFinancialDNA = React.useMemo(() => {
    return computeMasterDna(capacity, tolerance, requirement, perception);
  }, [capacity, tolerance, requirement, perception, computeMasterDna]);

  const handleSaveAndBroadcast = async () => {
    await saveDna(currentPreviewDna);
    setSaveSuccessMsg('Financial DNA Baseline updated and broadcasted to Risk Management, MPT Optimization, and Suitability Engine.');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleApplyAlternative = (altTitle: string) => {
    if (altTitle.includes('Monthly Contribution')) {
      // Increase monthly SIP to reach target with 11.5% CAGR
      setRequirement(prev => ({
        ...prev,
        monthlyContributionINR: Math.round(prev.monthlyContributionINR * 1.55)
      }));
    } else if (altTitle.includes('Extend Investment Horizon')) {
      // Extend timeline
      setRequirement(prev => ({
        ...prev,
        goalHorizonYears: Math.min(30, prev.goalHorizonYears + 4)
      }));
    } else if (altTitle.includes('Target Goal Amount')) {
      // Adjust target
      setRequirement(prev => ({
        ...prev,
        targetGoalAmountINR: Math.round(prev.targetGoalAmountINR * 0.75)
      }));
    } else if (altTitle.includes('Calibrate Risk Capacity')) {
      // Expand emergency buffer
      setCapacity(prev => ({
        ...prev,
        emergencyFundMonths: Math.max(6, prev.emergencyFundMonths + 3),
        liquidSavingsINR: prev.liquidSavingsINR + 200000
      }));
    }
  };

  // Dimension Scores Bar Chart Data
  const dimensionChartData = [
    { dimension: 'A. Risk Capacity', score: currentPreviewDna.riskCapacityScore, fill: '#2DD4BF' },
    { dimension: 'B. Risk Tolerance', score: currentPreviewDna.riskToleranceScore, fill: '#60A5FA' },
    { dimension: 'C. Risk Requirement', score: currentPreviewDna.riskRequirementScore, fill: '#F5B841' },
    { dimension: 'D. Perception Resilience', score: currentPreviewDna.riskPerceptionScore, fill: '#A78BFA' }
  ];

  // Radar chart for perception & behavioral biases
  const perceptionRadarData = [
    { subject: 'Vol Resilience', score: 100 - perception.fearOfVolatilityScore * 10 },
    { subject: 'Drawdown Fortitude', score: 100 - perception.fearOfDrawdownScore * 10 },
    { subject: 'FOMO Resistance', score: 100 - perception.fomoScore * 10 },
    { subject: 'Calibration (Humility)', score: 100 - perception.overconfidenceScore * 10 },
    { subject: 'Loss Equanimity', score: 100 - perception.lossAversionIndex * 10 }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
              <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] font-bold">INSTITUTIONAL CORE</span>
              <span>•</span>
              <span>Central Portfolio Risk Foundation</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              User Financial DNA Engine
            </h1>
            <p className="text-xs text-[#8B96A5] max-w-2xl">
              A 4-dimensional mathematical risk capacity model replacing generic questionnaires. Sets the governing baseline for Markowitz MPT, tail-risk VaR stress tests, and automated trade sizing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAndBroadcast}
              className="px-5 py-2.5 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20 font-mono"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Broadcast Baseline</span>
            </button>
          </div>
        </div>

        {/* Save Confirmation Notification */}
        {saveSuccessMsg && (
          <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] rounded-2xl flex items-center gap-3 text-xs font-mono animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <div className="font-bold">DNA Baseline Successfully Updated</div>
              <div className="text-[11px] text-[#22C55E]/80">{saveSuccessMsg}</div>
            </div>
          </div>
        )}

        {/* MASTER FORMULA HERO CARD: Final Risk Budget = min(Capacity, Requirement, Tolerance) */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#232B36] pb-4">
            <div>
              <div className="text-xs font-mono text-[#8B96A5] uppercase tracking-wider">
                Institutional Risk Formulation
              </div>
              <h2 className="text-lg font-bold font-mono text-[#E5E7EB] mt-0.5">
                Final Risk Budget = min(Capacity, Requirement Constraint, Psychological Tolerance Ceiling)
              </h2>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#1C2530] border border-[#232B36] text-xs font-mono text-[#8B96A5]">
              Mandate: "Portfolio risk must never exceed what capacity can survive"
            </div>
          </div>

          {/* 3 Pillars Feeding into Minimum Formula */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Pillar 1: Capacity */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentPreviewDna.governingConstraint === 'RISK_CAPACITY_LIMIT'
                ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#E5E7EB]'
                : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Dimension A</span>
                <span className="font-bold text-[#2DD4BF]">{currentPreviewDna.riskCapacityScore}/100</span>
              </div>
              <div className="text-base font-bold font-display text-[#E5E7EB] mt-1">
                Risk Capacity
              </div>
              <div className="text-[11px] font-mono mt-0.5">
                Tier: <strong className="text-[#2DD4BF]">{currentPreviewDna.riskCapacityTier}</strong>
              </div>
              <div className="text-[10px] text-[#8B96A5] mt-2">
                Survival ability based on cash buffer, EMI load & debt.
              </div>
            </div>

            {/* Pillar 2: Tolerance */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentPreviewDna.governingConstraint === 'PSYCHOLOGICAL_TOLERANCE_CEILING'
                ? 'bg-[#60A5FA]/10 border-[#60A5FA] text-[#E5E7EB]'
                : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Dimension B</span>
                <span className="font-bold text-[#60A5FA]">{currentPreviewDna.riskToleranceScore}/100</span>
              </div>
              <div className="text-base font-bold font-display text-[#E5E7EB] mt-1">
                Risk Tolerance
              </div>
              <div className="text-[11px] font-mono mt-0.5">
                Tier: <strong className="text-[#60A5FA]">{currentPreviewDna.riskToleranceTier}</strong>
              </div>
              <div className="text-[10px] text-[#8B96A5] mt-2">
                Scenario response to market dips & volatility fortitude.
              </div>
            </div>

            {/* Pillar 3: Requirement */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentPreviewDna.governingConstraint === 'RISK_REQUIREMENT_LIMIT'
                ? 'bg-[#F5B841]/10 border-[#F5B841] text-[#E5E7EB]'
                : 'bg-[#1C2530] border-[#232B36] text-[#8B96A5]'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Dimension C</span>
                <span className="font-bold text-[#F5B841]">{currentPreviewDna.riskRequirementScore}/100</span>
              </div>
              <div className="text-base font-bold font-display text-[#E5E7EB] mt-1">
                Risk Requirement
              </div>
              <div className="text-[11px] font-mono mt-0.5">
                Target CAGR: <strong className="text-[#F5B841]">{currentPreviewDna.goalFeasibility.requiredAnnualReturnPct}%</strong>
              </div>
              <div className="text-[10px] text-[#8B96A5] mt-2">
                Return needed to bridge starting capital to target corpus.
              </div>
            </div>

            {/* RESULT: Final Risk Budget */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C2530] to-[#161B22] border-2 border-[#2DD4BF] text-[#E5E7EB] space-y-2 shadow-xl shadow-[#2DD4BF]/10">
              <div className="text-[10px] font-mono text-[#2DD4BF] uppercase font-bold tracking-wider">
                FINAL RISK BUDGET
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-[#2DD4BF]">
                  {currentPreviewDna.finalRiskBudget}
                </span>
                <span className="text-xs text-[#8B96A5] font-mono">/ 100</span>
              </div>
              <div className="text-xs font-bold font-mono text-[#E5E7EB]">
                {currentPreviewDna.finalRiskCategory} ALLOCATION
              </div>
              <div className="text-[10px] text-[#8B96A5] font-mono pt-1 border-t border-[#232B36]">
                Max Equity: <strong className="text-[#E5E7EB]">{currentPreviewDna.maxEquityAllocationPct}%</strong> • Max Drawdown: <strong className="text-[#FB4B5C]">-{currentPreviewDna.maxPermittedDrawdownPct}%</strong>
              </div>
            </div>
          </div>

          {/* Governing Constraint Banner */}
          <div className="p-4 bg-[#1C2530] border border-[#232B36] rounded-xl flex items-start gap-3 text-xs font-mono">
            <Info className="w-5 h-5 text-[#2DD4BF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-[#E5E7EB]">
                Active Binding Constraint: <span className="text-[#2DD4BF]">{currentPreviewDna.governingConstraint.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-[#8B96A5] leading-relaxed">
                {currentPreviewDna.governingReason}
              </p>
            </div>
          </div>
        </div>

        {/* Goal Feasibility Alert Banner (If unrealistic return detected) */}
        {!currentPreviewDna.goalFeasibility.isFeasible && (
          <div className="p-6 bg-[#FB4B5C]/10 border-2 border-[#FB4B5C]/40 rounded-2xl space-y-4 font-mono animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#FB4B5C] shrink-0 mt-1" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#FB4B5C] uppercase tracking-wide">
                  {currentPreviewDna.goalFeasibility.alertTitle}
                </h3>
                <p className="text-xs text-[#E5E7EB] leading-relaxed">
                  {currentPreviewDna.goalFeasibility.alertMessage}
                </p>
              </div>
            </div>

            {/* 4 Structured Institutional Alternatives */}
            <div className="pt-2 border-t border-[#FB4B5C]/20">
              <div className="text-xs font-bold text-[#FB4B5C] uppercase mb-3">
                Suggested Alternatives to Achieve Goal Safely:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPreviewDna.goalFeasibility.suggestedAlternatives.map((alt, i) => (
                  <div key={i} className="p-3.5 bg-[#161B22] border border-[#FB4B5C]/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E5E7EB]">{i + 1}. {alt.title}</span>
                      <button
                        onClick={() => handleApplyAlternative(alt.title)}
                        className="px-2.5 py-1 rounded bg-[#FB4B5C]/20 text-[#FB4B5C] hover:bg-[#FB4B5C] hover:text-[#0D1117] font-bold text-[10px] transition-all"
                      >
                        Apply Alternative
                      </button>
                    </div>
                    <p className="text-xs text-[#2DD4BF] font-semibold">{alt.description}</p>
                    <p className="text-[11px] text-[#8B96A5]">{alt.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TABS NAVIGATION FOR DETAILED DIMENSION CALIBRATION */}
        <div className="flex items-center gap-2 border-b border-[#232B36] pb-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'OVERVIEW', label: 'DNA Synthesis & Radar' },
            { id: 'CAPACITY', label: 'A. Risk Capacity Inputs' },
            { id: 'TOLERANCE', label: 'B. Risk Tolerance Scenarios' },
            { id: 'REQUIREMENT', label: 'C. Goal Risk Requirement' },
            { id: 'PERCEPTION', label: 'D. Perception & Biases' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2DD4BF] text-[#0D1117] font-bold'
                  : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & SYNTHESIS */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dimensions Bar Chart */}
            <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
                <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
                  4-Dimensional Score Comparison (0 - 100)
                </span>
                <span className="text-[10px] text-[#2DD4BF] font-mono">Budget: {currentPreviewDna.finalRiskBudget}</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimensionChartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#8B96A5" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="dimension" type="category" stroke="#8B96A5" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#232B36', color: '#E5E7EB' }} />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-[#8B96A5] font-mono leading-relaxed">
                The final budget is clamped to the lowest binding ceiling. A high risk score in one dimension does not compensate for deficient emergency funds or imminent cash liabilities.
              </div>
            </div>

            {/* Behavioral Biases & Radar */}
            <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
                <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider">
                  Behavioral Bias & Psychological Equanimity Radar
                </span>
                <span className="text-[10px] text-[#A78BFA] font-mono">Resilience: {currentPreviewDna.riskPerceptionScore}/100</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={perceptionRadarData}>
                    <PolarGrid stroke="#232B36" />
                    <PolarAngleAxis dataKey="subject" stroke="#8B96A5" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis domain={[0, 100]} stroke="#232B36" tick={false} />
                    <Radar name="Psychological Fortitude" dataKey="score" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {currentPreviewDna.behavioralBiases.map((b, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#1C2530] flex items-center justify-between text-[11px]">
                    <span className="text-[#E5E7EB] font-bold">{b.bias}</span>
                    <span className="text-[#8B96A5]">{b.mitigationStrategy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIMENSION A - RISK CAPACITY INPUTS */}
        {activeTab === 'CAPACITY' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#232B36] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono text-[#E5E7EB]">
                    Dimension A: Risk Capacity Calibration
                  </h3>
                  <p className="text-xs text-[#8B96A5]">
                    Measures your balance sheet's actual mathematical capacity to absorb market losses.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-[#8B96A5]">Calculated Capacity Score</div>
                  <div className="text-2xl font-bold text-[#2DD4BF]">{currentPreviewDna.riskCapacityScore}/100</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
              {/* Age */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Investor Age ({capacity.age} yrs)</label>
                <input
                  type="range"
                  min={18}
                  max={75}
                  value={capacity.age}
                  onChange={(e) => setCapacity({ ...capacity, age: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>18y (Max Runway)</span>
                  <span>75y (Preservation)</span>
                </div>
              </div>

              {/* Monthly Income */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Monthly Inflow (₹{capacity.monthlyIncomeINR.toLocaleString('en-IN')})</label>
                <input
                  type="range"
                  min={25000}
                  max={1000000}
                  step={10000}
                  value={capacity.monthlyIncomeINR}
                  onChange={(e) => setCapacity({ ...capacity, monthlyIncomeINR: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>₹25K</span>
                  <span>₹10L+</span>
                </div>
              </div>

              {/* Income Stability */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Income Stability</label>
                <select
                  value={capacity.incomeStability}
                  onChange={(e) => setCapacity({ ...capacity, incomeStability: e.target.value as any })}
                  className="w-full bg-[#161B22] border border-[#232B36] rounded-lg p-2 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="VERY_STABLE_GOVT">Very Stable / PSU / Govt</option>
                  <option value="STABLE_CORPORATE">Stable Established Corporate</option>
                  <option value="VARIABLE_BUSINESS">Variable Business Income</option>
                  <option value="VOLATILE_FREELANCE">Volatile / Commission / Freelance</option>
                </select>
              </div>

              {/* Emergency Fund Months */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Emergency Cash Buffer ({capacity.emergencyFundMonths} Months)</label>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={capacity.emergencyFundMonths}
                  onChange={(e) => setCapacity({ ...capacity, emergencyFundMonths: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0 Months (Fragile)</span>
                  <span>12+ Months (Shielded)</span>
                </div>
              </div>

              {/* Monthly EMI Obligations */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Monthly Debt EMI (₹{capacity.monthlyEMIObligationsINR.toLocaleString('en-IN')})</label>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={5000}
                  value={capacity.monthlyEMIObligationsINR}
                  onChange={(e) => setCapacity({ ...capacity, monthlyEMIObligationsINR: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>Zero Debt</span>
                  <span>High Debt Load</span>
                </div>
              </div>

              {/* Dependents */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Financial Dependents ({capacity.numberOfDependents})</label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={capacity.numberOfDependents}
                  onChange={(e) => setCapacity({ ...capacity, numberOfDependents: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0 (High Autonomy)</span>
                  <span>4+ (High Responsibility)</span>
                </div>
              </div>

              {/* Insurance Coverage */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Catastrophic Insurance Protection</label>
                <select
                  value={capacity.insuranceCoverage}
                  onChange={(e) => setCapacity({ ...capacity, insuranceCoverage: e.target.value as any })}
                  className="w-full bg-[#161B22] border border-[#232B36] rounded-lg p-2 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="ADEQUATE">Adequate Health & Term Life</option>
                  <option value="PARTIAL">Partial / Employer Group Only</option>
                  <option value="NONE">None / Self-Insured Risk</option>
                </select>
              </div>

              {/* Investment Horizon */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Core Investment Horizon ({capacity.investmentHorizonYears} Years)</label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={capacity.investmentHorizonYears}
                  onChange={(e) => setCapacity({ ...capacity, investmentHorizonYears: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>1y (Ultra Short)</span>
                  <span>20+y (Multi-cycle)</span>
                </div>
              </div>

              {/* Future Major Expense Outflow */}
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Next Major Capital Outflow in ({capacity.futureMajorExpenseYears} yrs)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={capacity.futureMajorExpenseYears}
                  onChange={(e) => setCapacity({ ...capacity, futureMajorExpenseYears: +e.target.value })}
                  className="w-full accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>&lt; 2 yrs (Liquid lockup)</span>
                  <span>7+ yrs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIMENSION B - RISK TOLERANCE SCENARIOS */}
        {activeTab === 'TOLERANCE' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#232B36] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono text-[#E5E7EB]">
                    Dimension B: Psychological Risk Tolerance (Scenario Simulation)
                  </h3>
                  <p className="text-xs text-[#8B96A5]">
                    Behavioral scenario tests to measure your panic thresholds under severe real-world market stress.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-[#8B96A5]">Tolerance Score</div>
                  <div className="text-2xl font-bold text-[#60A5FA]">{currentPreviewDna.riskToleranceScore}/100</div>
                </div>
              </div>
            </div>

            {/* Core Scenario Question */}
            <div className="p-5 bg-[#1C2530] border border-[#232B36] rounded-2xl space-y-4">
              <div className="text-xs font-mono font-bold text-[#60A5FA] uppercase tracking-wider">
                Behavioral Shock Scenario
              </div>
              <p className="text-sm text-[#E5E7EB] font-mono leading-relaxed">
                "Your ₹10,00,000 portfolio suddenly drops to ₹7,00,000 (-30% drawdown) in three months due to an unexpected global liquidity shock. How do you respond?"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {[
                  { key: 'SELL_ALL', label: 'A. Sell immediately to prevent further loss of principal', score: 15, tag: 'High Panic Risk' },
                  { key: 'REDUCE_SOME', label: 'B. Reduce some exposure and park money in Fixed Deposits', score: 40, tag: 'Defensive' },
                  { key: 'HOLD_DISCIPLINED', label: 'C. Hold disciplined and wait for economic recovery', score: 75, tag: 'Balanced Equanimity' },
                  { key: 'BUY_MORE', label: 'D. Aggressively deploy surplus cash to buy high-quality equities at a discount', score: 95, tag: 'Contrarian Accumulator' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setTolerance({ ...tolerance, marketDipReaction: opt.key as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      tolerance.marketDipReaction === opt.key
                        ? 'bg-[#60A5FA]/15 border-[#60A5FA] text-[#E5E7EB]'
                        : 'bg-[#161B22] border-[#232B36] text-[#8B96A5] hover:bg-[#161B22]/80 hover:text-[#E5E7EB]'
                    }`}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-[10px] text-[#60A5FA] mt-2 font-mono">Calibrated Score: {opt.score} pts • {opt.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Psychological Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">
                  Subjective Volatility Comfort (Rating {tolerance.volatilityComfortScore}/10)
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={tolerance.volatilityComfortScore}
                  onChange={(e) => setTolerance({ ...tolerance, volatilityComfortScore: +e.target.value })}
                  className="w-full accent-[#60A5FA]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>1 (Sleep Disrupted)</span>
                  <span>10 (Completely Unfazed)</span>
                </div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">
                  Prolonged Sideways / Stagnant Market Reaction
                </label>
                <select
                  value={tolerance.prolongedStagnationReaction}
                  onChange={(e) => setTolerance({ ...tolerance, prolongedStagnationReaction: e.target.value as any })}
                  className="w-full bg-[#161B22] border border-[#232B36] rounded-lg p-2 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="ACCUMULATE_SIP">Continue Monthly Systematic Investments (SIP)</option>
                  <option value="STAY_COURSE">Stay the course and reinvest dividends</option>
                  <option value="SWITCH_CONSERVATIVE">Shift half to Debt/FDs</option>
                  <option value="EXIT_EQUITIES">Liquidate equities out of frustration</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIMENSION C - RISK REQUIREMENT & GOAL FEASIBILITY */}
        {activeTab === 'REQUIREMENT' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#232B36] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono text-[#E5E7EB]">
                    Dimension C: Goal Risk Requirement & Mathematical Feasibility
                  </h3>
                  <p className="text-xs text-[#8B96A5]">
                    Computes the exact CAGR required to reach your target corpus and flags unrealistic goal expectations.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-[#8B96A5]">Required CAGR</div>
                  <div className={`text-2xl font-bold ${currentPreviewDna.goalFeasibility.isFeasible ? 'text-[#22C55E]' : 'text-[#FB4B5C]'}`}>
                    {currentPreviewDna.goalFeasibility.requiredAnnualReturnPct}% p.a.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Current Capital (₹{(requirement.currentCapitalINR / 100000).toFixed(1)}L)</label>
                <input
                  type="range"
                  min={50000}
                  max={20000000}
                  step={50000}
                  value={requirement.currentCapitalINR}
                  onChange={(e) => setRequirement({ ...requirement, currentCapitalINR: +e.target.value })}
                  className="w-full accent-[#F5B841]"
                />
                <div className="text-[10px] text-[#64748B]">₹{requirement.currentCapitalINR.toLocaleString('en-IN')}</div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Target Goal Corpus (₹{(requirement.targetGoalAmountINR / 10000000).toFixed(2)} Cr)</label>
                <input
                  type="range"
                  min={500000}
                  max={100000000}
                  step={500000}
                  value={requirement.targetGoalAmountINR}
                  onChange={(e) => setRequirement({ ...requirement, targetGoalAmountINR: +e.target.value })}
                  className="w-full accent-[#F5B841]"
                />
                <div className="text-[10px] text-[#64748B]">₹{requirement.targetGoalAmountINR.toLocaleString('en-IN')}</div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Goal Horizon ({requirement.goalHorizonYears} Years)</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={requirement.goalHorizonYears}
                  onChange={(e) => setRequirement({ ...requirement, goalHorizonYears: +e.target.value })}
                  className="w-full accent-[#F5B841]"
                />
                <div className="text-[10px] text-[#64748B]">{requirement.goalHorizonYears * 12} Monthly Compounding Periods</div>
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Monthly SIP Addition (₹{requirement.monthlyContributionINR.toLocaleString('en-IN')})</label>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={5000}
                  value={requirement.monthlyContributionINR}
                  onChange={(e) => setRequirement({ ...requirement, monthlyContributionINR: +e.target.value })}
                  className="w-full accent-[#F5B841]"
                />
                <div className="text-[10px] text-[#64748B]">₹{(requirement.monthlyContributionINR * 12).toLocaleString('en-IN')} p.a. deployed</div>
              </div>
            </div>

            {/* Feasibility Evaluation Card */}
            <div className={`p-4 rounded-xl border font-mono text-xs flex items-center justify-between ${
              currentPreviewDna.goalFeasibility.isFeasible
                ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
                : 'bg-[#FB4B5C]/10 border-[#FB4B5C]/30 text-[#FB4B5C]'
            }`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5" />
                <span>
                  Goal Status: <strong>{currentPreviewDna.goalFeasibility.status.replace(/_/g, ' ')}</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#8B96A5]">
                Historical Benchmark Equity Long-Term CAGR: ~12.0%
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: DIMENSION D - RISK PERCEPTION & BIASES */}
        {activeTab === 'PERCEPTION' && (
          <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#232B36] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono text-[#E5E7EB]">
                    Dimension D: Risk Perception & Emotional Biases
                  </h3>
                  <p className="text-xs text-[#8B96A5]">
                    Diagnoses confusion between temporary market volatility and permanent loss of capital.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-[#8B96A5]">Perception Resilience</div>
                  <div className="text-2xl font-bold text-[#A78BFA]">{currentPreviewDna.riskPerceptionScore}/100</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Fear of Short-Term Volatility ({perception.fearOfVolatilityScore}/10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={perception.fearOfVolatilityScore}
                  onChange={(e) => setPerception({ ...perception, fearOfVolatilityScore: +e.target.value })}
                  className="w-full accent-[#A78BFA]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Fear of Peak-to-Trough Drawdown ({perception.fearOfDrawdownScore}/10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={perception.fearOfDrawdownScore}
                  onChange={(e) => setPerception({ ...perception, fearOfDrawdownScore: +e.target.value })}
                  className="w-full accent-[#A78BFA]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">FOMO & Recency Chase Tendency ({perception.fomoScore}/10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={perception.fomoScore}
                  onChange={(e) => setPerception({ ...perception, fomoScore: +e.target.value })}
                  className="w-full accent-[#A78BFA]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Overconfidence / Concentrated Bet Bias ({perception.overconfidenceScore}/10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={perception.overconfidenceScore}
                  onChange={(e) => setPerception({ ...perception, overconfidenceScore: +e.target.value })}
                  className="w-full accent-[#A78BFA]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Loss Aversion Index ({perception.lossAversionIndex}/10)</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={perception.lossAversionIndex}
                  onChange={(e) => setPerception({ ...perception, lossAversionIndex: +e.target.value })}
                  className="w-full accent-[#A78BFA]"
                />
              </div>

              <div className="p-4 bg-[#1C2530] rounded-xl space-y-2">
                <label className="text-[#8B96A5] block">Panic Selling Historical Probability</label>
                <select
                  value={perception.panicSellingProbability}
                  onChange={(e) => setPerception({ ...perception, panicSellingProbability: e.target.value as any })}
                  className="w-full bg-[#161B22] border border-[#232B36] rounded-lg p-2 text-[#E5E7EB] focus:outline-none"
                >
                  <option value="LOW">Low (Disciplined Systematic Investor)</option>
                  <option value="MODERATE">Moderate (Occasional Anxiety)</option>
                  <option value="HIGH">High (Prone to Liquidate at Lows)</option>
                  <option value="SEVERE">Severe (Extreme Capital Protection Fear)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Downstream Cross-Section Propagation Card */}
        <div className="p-6 bg-[#161B22] border border-[#232B36] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <span className="text-xs font-bold font-display uppercase text-[#E5E7EB] tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2DD4BF]" />
              Downstream Module Propagation (Live Architecture)
            </span>
            <span className="text-[10px] text-[#2DD4BF] font-mono">Synchronized</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <Link
              to="/portfolio/pf_main_01/risk"
              className="p-4 bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] rounded-xl space-y-1.5 transition-all group"
            >
              <div className="text-xs font-bold text-[#FB4B5C] flex items-center justify-between">
                <span>Risk Management (VaR/CVaR)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-[#8B96A5]">
                Drawdown threshold clamped to <strong>-{currentPreviewDna.maxPermittedDrawdownPct}%</strong> based on your Financial DNA Capacity.
              </p>
            </Link>

            <Link
              to="/portfolio/pf_main_01/optimize"
              className="p-4 bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] rounded-xl space-y-1.5 transition-all group"
            >
              <div className="text-xs font-bold text-[#2DD4BF] flex items-center justify-between">
                <span>MPT Optimization</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-[#8B96A5]">
                Markowitz target volatility clamped to <strong>{currentPreviewDna.targetVolatilityCeilingPct}%</strong>; equity ceiling set to <strong>{currentPreviewDna.maxEquityAllocationPct}%</strong>.
              </p>
            </Link>

            <Link
              to="/recommendations"
              className="p-4 bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] rounded-xl space-y-1.5 transition-all group"
            >
              <div className="text-xs font-bold text-[#A78BFA] flex items-center justify-between">
                <span>AI Suitability Engine</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-[#8B96A5]">
                Asset risk scores calibrated against your Final Risk Budget ({currentPreviewDna.finalRiskBudget}/100) to filter unsuitable speculative instruments.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
