import {
  UserFinancialDNA,
  RiskCapacityInputs,
  RiskToleranceInputs,
  RiskRequirementInputs,
  RiskPerceptionInputs,
  GoalFeasibilityResult
} from '../types';

const FINANCIAL_DNA_STORAGE_KEY = 'investsense_user_financial_dna';

export const DEFAULT_CAPACITY_INPUTS: RiskCapacityInputs = {
  age: 28,
  monthlyIncomeINR: 150000,
  incomeStability: 'STABLE_CORPORATE',
  employmentType: 'SALARIED',
  liquidSavingsINR: 450000,
  emergencyFundMonths: 6,
  totalOutstandingDebtINR: 300000,
  monthlyEMIObligationsINR: 22000,
  numberOfDependents: 1,
  insuranceCoverage: 'ADEQUATE',
  existingInvestmentsINR: 1200000,
  futureMajorExpenseYears: 5,
  futureExpenseAmountINR: 500000,
  investmentHorizonYears: 10
};

export const DEFAULT_TOLERANCE_INPUTS: RiskToleranceInputs = {
  marketDipReaction: 'HOLD_DISCIPLINED',
  volatilityComfortScore: 7,
  prolongedStagnationReaction: 'ACCUMULATE_SIP',
  maxLossComfortPct: 20
};

export const DEFAULT_REQUIREMENT_INPUTS: RiskRequirementInputs = {
  currentCapitalINR: 1200000,
  targetGoalAmountINR: 10000000, // ₹1 Crore
  goalHorizonYears: 10,
  monthlyContributionINR: 35000,
  goalType: 'WEALTH_CREATION'
};

export const DEFAULT_PERCEPTION_INPUTS: RiskPerceptionInputs = {
  fearOfVolatilityScore: 4,
  fearOfDrawdownScore: 5,
  fomoScore: 3,
  overconfidenceScore: 4,
  lossAversionIndex: 5,
  panicSellingProbability: 'LOW'
};

export class FinancialDnaEngine {
  /**
   * Calculates Dimension A: Risk Capacity (0-100)
   * The financial ability to absorb capital drawdown without insolvency or distress.
   */
  public static calculateRiskCapacity(inputs: RiskCapacityInputs): {
    score: number;
    tier: UserFinancialDNA['riskCapacityTier'];
    breakdown: { factor: string; score: number; comment: string }[];
  } {
    let score = 0;
    const breakdown: { factor: string; score: number; comment: string }[] = [];

    // 1. Age & Human Capital (12% weight)
    let ageScore = 100;
    if (inputs.age <= 30) ageScore = 95;
    else if (inputs.age <= 40) ageScore = 80;
    else if (inputs.age <= 50) ageScore = 65;
    else if (inputs.age <= 60) ageScore = 45;
    else ageScore = 30;
    score += ageScore * 0.12;
    breakdown.push({
      factor: 'Age & Human Capital Runaway',
      score: ageScore,
      comment: inputs.age <= 35 ? 'Long compounding runway ahead.' : 'Prudent capital preservation horizon.'
    });

    // 2. Income Stability & Career Risk (15% weight)
    let incomeScore = 75;
    if (inputs.incomeStability === 'VERY_STABLE_GOVT') incomeScore = 100;
    else if (inputs.incomeStability === 'STABLE_CORPORATE') incomeScore = 85;
    else if (inputs.incomeStability === 'VARIABLE_BUSINESS') incomeScore = 55;
    else if (inputs.incomeStability === 'VOLATILE_FREELANCE') incomeScore = 35;
    score += incomeScore * 0.15;
    breakdown.push({
      factor: 'Income Stability',
      score: incomeScore,
      comment: `${inputs.incomeStability.replace('_', ' ')} employment profile.`
    });

    // 3. Emergency Liquidity Buffer (15% weight)
    let emgScore = 20;
    if (inputs.emergencyFundMonths >= 12) emgScore = 100;
    else if (inputs.emergencyFundMonths >= 6) emgScore = 85;
    else if (inputs.emergencyFundMonths >= 3) emgScore = 60;
    else if (inputs.emergencyFundMonths >= 1) emgScore = 35;
    score += emgScore * 0.15;
    breakdown.push({
      factor: 'Emergency Cash Cushion',
      score: emgScore,
      comment: `${inputs.emergencyFundMonths} months living expenses liquid.`
    });

    // 4. Debt-to-Income / EMI Burden (15% weight)
    const emiRatio = inputs.monthlyIncomeINR > 0 ? (inputs.monthlyEMIObligationsINR / inputs.monthlyIncomeINR) : 0;
    let debtScore = 100;
    if (emiRatio <= 0.10) debtScore = 100;
    else if (emiRatio <= 0.25) debtScore = 80;
    else if (emiRatio <= 0.40) debtScore = 50;
    else debtScore = 25;
    score += debtScore * 0.15;
    breakdown.push({
      factor: 'EMI & Debt Encumbrance',
      score: debtScore,
      comment: `${(emiRatio * 100).toFixed(1)}% of monthly income allocated to EMIs.`
    });

    // 5. Dependents Liability (10% weight)
    let depScore = 100;
    if (inputs.numberOfDependents === 0) depScore = 100;
    else if (inputs.numberOfDependents === 1) depScore = 80;
    else if (inputs.numberOfDependents === 2) depScore = 65;
    else depScore = 40;
    score += depScore * 0.10;
    breakdown.push({
      factor: 'Family Dependents',
      score: depScore,
      comment: `${inputs.numberOfDependents} financial dependents.`
    });

    // 6. Insurance Protection Shield (8% weight)
    let insScore = 30;
    if (inputs.insuranceCoverage === 'ADEQUATE') insScore = 100;
    else if (inputs.insuranceCoverage === 'PARTIAL') insScore = 65;
    else insScore = 20;
    score += insScore * 0.08;
    breakdown.push({
      factor: 'Health & Term Insurance Shield',
      score: insScore,
      comment: `${inputs.insuranceCoverage} coverage against catastrophic life events.`
    });

    // 7. Investment Horizon & Future Major Outflows (15% weight)
    let horizonScore = 50;
    if (inputs.investmentHorizonYears >= 12) horizonScore = 100;
    else if (inputs.investmentHorizonYears >= 7) horizonScore = 85;
    else if (inputs.investmentHorizonYears >= 4) horizonScore = 60;
    else horizonScore = 30;

    if (inputs.futureMajorExpenseYears <= 2 && inputs.futureExpenseAmountINR > (inputs.liquidSavingsINR * 0.7)) {
      horizonScore = Math.min(horizonScore, 40); // penalize imminent large expense
    }
    score += horizonScore * 0.15;
    breakdown.push({
      factor: 'Horizon & Capital Outflow Lockup',
      score: horizonScore,
      comment: `${inputs.investmentHorizonYears}-year horizon with future major outflow in ${inputs.futureMajorExpenseYears}y.`
    });

    // 8. Net Wealth Buffer (10% weight)
    let wealthScore = 70;
    if (inputs.existingInvestmentsINR >= 5000000) wealthScore = 95;
    else if (inputs.existingInvestmentsINR >= 1500000) wealthScore = 80;
    else if (inputs.existingInvestmentsINR >= 500000) wealthScore = 65;
    else wealthScore = 45;
    score += wealthScore * 0.10;

    const finalScore = Math.round(Math.min(98, Math.max(15, score)));
    let tier: UserFinancialDNA['riskCapacityTier'] = 'MEDIUM';
    if (finalScore >= 80) tier = 'HIGH';
    else if (finalScore >= 65) tier = 'MEDIUM_HIGH';
    else if (finalScore >= 50) tier = 'MEDIUM';
    else if (finalScore >= 35) tier = 'LOW_MEDIUM';
    else tier = 'LOW';

    return { score: finalScore, tier, breakdown };
  }

  /**
   * Calculates Dimension B: Risk Tolerance (0-100)
   * Psychological willingness to endure drawdown and volatility without panic.
   */
  public static calculateRiskTolerance(inputs: RiskToleranceInputs): {
    score: number;
    tier: UserFinancialDNA['riskToleranceTier'];
  } {
    let dipScore = 70;
    if (inputs.marketDipReaction === 'BUY_MORE') dipScore = 95;
    else if (inputs.marketDipReaction === 'HOLD_DISCIPLINED') dipScore = 75;
    else if (inputs.marketDipReaction === 'REDUCE_SOME') dipScore = 40;
    else if (inputs.marketDipReaction === 'SELL_ALL') dipScore = 15;

    let stagScore = 70;
    if (inputs.prolongedStagnationReaction === 'ACCUMULATE_SIP') stagScore = 95;
    else if (inputs.prolongedStagnationReaction === 'STAY_COURSE') stagScore = 75;
    else if (inputs.prolongedStagnationReaction === 'SWITCH_CONSERVATIVE') stagScore = 45;
    else stagScore = 20;

    const volScore = Math.min(100, Math.max(10, inputs.volatilityComfortScore * 10));
    const lossScore = Math.min(100, Math.max(10, (inputs.maxLossComfortPct / 35) * 100));

    const composite = Math.round((dipScore * 0.35) + (volScore * 0.25) + (stagScore * 0.20) + (lossScore * 0.20));
    const score = Math.min(95, Math.max(15, composite));

    let tier: UserFinancialDNA['riskToleranceTier'] = 'BALANCED';
    if (score >= 78) tier = 'HIGH';
    else if (score >= 58) tier = 'BALANCED';
    else if (score >= 40) tier = 'MODERATE';
    else tier = 'LOW';

    return { score, tier };
  }

  /**
   * Calculates Dimension C: Risk Requirement & Goal Feasibility
   * How much risk is required to reach the target wealth given horizon and contribution.
   */
  public static calculateRiskRequirement(
    reqInputs: RiskRequirementInputs,
    capacityScore: number
  ): {
    score: number;
    feasibility: GoalFeasibilityResult;
  } {
    const P = Math.max(0, reqInputs.currentCapitalINR);
    const A = Math.max(P, reqInputs.targetGoalAmountINR);
    const t = Math.max(1, reqInputs.goalHorizonYears);
    const S = Math.max(0, reqInputs.monthlyContributionINR);

    // Solve for required annual return r using numerical bisection
    const calculateFutureValue = (rate: number): number => {
      const monthlyRate = rate / 12;
      const months = t * 12;
      if (monthlyRate <= 0.0001) {
        return P + (S * months);
      }
      const compoundPrincipal = P * Math.pow(1 + rate, t);
      const annuityFV = S * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      return compoundPrincipal + annuityFV;
    };

    let low = 0.0;
    let high = 0.50; // 50% max test
    let requiredRate = 0.12;

    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      const fv = calculateFutureValue(mid);
      if (fv < A) {
        low = mid;
      } else {
        high = mid;
      }
    }
    requiredRate = (low + high) / 2;
    const requiredReturnPct = +(requiredRate * 100).toFixed(1);

    // Analyze Feasibility
    const benchmarkEquityCagr = 12.0; // Institutional Indian equity long-term benchmark
    const maxPrudentReturn = capacityScore >= 75 ? 13.5 : capacityScore >= 50 ? 11.5 : 9.5;

    let status: GoalFeasibilityResult['status'] = 'CALIBRATED_REALISTIC';
    let isFeasible = true;
    let alertTitle: string | undefined;
    let alertMessage: string | undefined;
    const suggestedAlternatives: GoalFeasibilityResult['suggestedAlternatives'] = [];

    if (requiredReturnPct > 15.0 || requiredReturnPct > maxPrudentReturn) {
      status = 'FEASIBILITY_ALERT_UNREALISTIC';
      isFeasible = false;
      alertTitle = 'GOAL FEASIBILITY ALERT: UNREALISTIC RETURN REQUIRED';
      alertMessage = `Required annual return is ${requiredReturnPct}%. Your current financial risk capacity (${capacityScore}/100) cannot safely support a portfolio designed for this return without severe downside liquidation risk.`;

      // Alternative 1: Increase monthly SIP to reach goal with realistic 11.5% CAGR
      const targetRateForAlt = 0.115;
      const monthlyR = targetRateForAlt / 12;
      const totalMonths = t * 12;
      const compP = P * Math.pow(1 + targetRateForAlt, t);
      const neededFromSIP = Math.max(0, A - compP);
      const annuityFactor = ((Math.pow(1 + monthlyR, totalMonths) - 1) / monthlyR);
      const neededSIP = Math.round(neededFromSIP / annuityFactor);

      suggestedAlternatives.push({
        title: 'Increase Monthly Contribution',
        description: `Boost monthly allocation from ₹${S.toLocaleString('en-IN')} to ₹${neededSIP.toLocaleString('en-IN')}`,
        impact: 'Achieves target with institutional 11.5% equity-debt balanced portfolio.'
      });

      // Alternative 2: Extend Horizon
      const extendedYears = Math.min(30, Math.ceil(t * (requiredReturnPct / 11.5)));
      suggestedAlternatives.push({
        title: 'Extend Investment Horizon',
        description: `Extend timeline from ${t} years to ${extendedYears} years`,
        impact: `Allows power of compounding to close the gap at conservative volatility.`
      });

      // Alternative 3: Calibrate Target Corpus
      const achievableCorpus = Math.round(calculateFutureValue(targetRateForAlt));
      suggestedAlternatives.push({
        title: 'Adjust Target Goal Amount',
        description: `Recalibrate realistic target to ₹${(achievableCorpus / 10000000).toFixed(2)} Crore`,
        impact: 'Maintains 99% probability of achievement within your safe risk capacity.'
      });

      // Alternative 4: Moderate Risk Increase
      suggestedAlternatives.push({
        title: 'Calibrate Risk Capacity Upward',
        description: 'Expand emergency reserves and reduce EMI debt to unlock higher equity limits',
        impact: 'Safely elevates permissible equity allocation without behavioral panic risk.'
      });
    } else if (requiredReturnPct <= 7.5) {
      status = 'HIGHLY_FEASIBLE';
      alertTitle = 'GOAL HIGHLY ATTAINABLE';
      alertMessage = `Required annual return is only ${requiredReturnPct}%. Your goal can be achieved with low-risk instruments without exposing capital to equity volatility.`;
    }

    // Convert required return into a 0-100 requirement score
    let score = Math.round((requiredReturnPct / 15) * 80);
    score = Math.min(95, Math.max(25, score));

    return {
      score,
      feasibility: {
        requiredAnnualReturnPct: requiredReturnPct,
        isFeasible,
        status,
        alertTitle,
        alertMessage,
        suggestedAlternatives
      }
    };
  }

  /**
   * Calculates Dimension D: Risk Perception & Behavioral Biases
   */
  public static calculateRiskPerception(inputs: RiskPerceptionInputs): {
    score: number;
    biases: UserFinancialDNA['behavioralBiases'];
  } {
    const biases: UserFinancialDNA['behavioralBiases'] = [];

    if (inputs.lossAversionIndex >= 7) {
      biases.push({
        bias: 'High Loss Aversion',
        level: 'HIGH',
        mitigationStrategy: 'Automated rules-based rebalancing to avoid emotionally checking daily swings.'
      });
    }

    if (inputs.fomoScore >= 7) {
      biases.push({
        bias: 'FOMO & Recency Bias',
        level: 'HIGH',
        mitigationStrategy: 'Strict allocation caps on hot momentum assets and structured SIPs.'
      });
    }

    if (inputs.overconfidenceScore >= 8) {
      biases.push({
        bias: 'Overconfidence Effect',
        level: 'HIGH',
        mitigationStrategy: 'Enforce position sizing constraints (maximum 8% per single stock).'
      });
    }

    if (inputs.fearOfDrawdownScore >= 7) {
      biases.push({
        bias: 'Drawdown Anxiety',
        level: 'MODERATE',
        mitigationStrategy: 'Dynamic downside hedging via Gold and Sovereign G-Sec allocations.'
      });
    }

    // Perception score reflects psychological resilience (higher = more resilient)
    const rawPerception = 100 - (
      (inputs.fearOfVolatilityScore * 2.5) +
      (inputs.fearOfDrawdownScore * 3.0) +
      (inputs.lossAversionIndex * 2.5) +
      (inputs.panicSellingProbability === 'SEVERE' ? 20 : inputs.panicSellingProbability === 'HIGH' ? 14 : inputs.panicSellingProbability === 'MODERATE' ? 7 : 0)
    );

    const score = Math.round(Math.min(95, Math.max(15, rawPerception)));
    return { score, biases };
  }

  /**
   * MASTER RISK BUDGET FORMULATION
   *
   * Final Risk Budget = min(Risk Capacity, Risk Requirement Constraint, Psychological Tolerance Ceiling)
   * "The portfolio should never exceed what the user's financial capacity can reasonably support."
   */
  public static computeMasterFinancialDna(
    capacityInputs: RiskCapacityInputs,
    toleranceInputs: RiskToleranceInputs,
    requirementInputs: RiskRequirementInputs,
    perceptionInputs: RiskPerceptionInputs
  ): UserFinancialDNA {
    const capacity = this.calculateRiskCapacity(capacityInputs);
    const tolerance = this.calculateRiskTolerance(toleranceInputs);
    const requirement = this.calculateRiskRequirement(requirementInputs, capacity.score);
    const perception = this.calculateRiskPerception(perceptionInputs);

    // Apply psychological ceiling adjustment based on perception & loss aversion
    const psychologicalToleranceCeiling = Math.min(
      tolerance.score,
      perception.score + 10
    );

    // Requirement constraint: if user only needs 45 to reach goal, cap risk requirement constraint
    const riskRequirementConstraint = Math.max(30, requirement.score);

    // The Institutional Triple-Min Formulation
    const finalRiskBudget = Math.min(
      capacity.score,
      riskRequirementConstraint,
      psychologicalToleranceCeiling
    );

    // Determine Governing Constraint
    let governingConstraint: UserFinancialDNA['governingConstraint'] = 'RISK_CAPACITY_LIMIT';
    let governingReason = '';

    if (finalRiskBudget === capacity.score) {
      governingConstraint = 'RISK_CAPACITY_LIMIT';
      governingReason = 'Governed by Financial Capacity. Even if psychological risk appetite is elevated, financial commitments (EMIs, family obligations, emergency reserves, or capital lockups) dictate the safe volatility ceiling.';
    } else if (finalRiskBudget === riskRequirementConstraint) {
      governingConstraint = 'RISK_REQUIREMENT_LIMIT';
      governingReason = 'Governed by Goal Requirement. You have financial capacity for higher volatility, but your financial goals are achievable with lower risk without taking uncompensated market drawdowns.';
    } else {
      governingConstraint = 'PSYCHOLOGICAL_TOLERANCE_CEILING';
      governingReason = 'Governed by Behavioral Tolerance Ceiling. Although your financial balance sheet is resilient, your emotional loss comfort ceiling restricts equity allocation to prevent destructive panic-selling during corrections.';
    }

    // Determine Category & Portfolio Constraints
    let finalRiskCategory: UserFinancialDNA['finalRiskCategory'] = 'BALANCED';
    let maxDrawdown = 20;
    let maxEquity = 65;
    let targetVol = 12.5;

    if (finalRiskBudget < 40) {
      finalRiskCategory = 'CONSERVATIVE';
      maxDrawdown = 10;
      maxEquity = 30;
      targetVol = 7.5;
    } else if (finalRiskBudget < 55) {
      finalRiskCategory = 'MODERATE';
      maxDrawdown = 15;
      maxEquity = 50;
      targetVol = 10.0;
    } else if (finalRiskBudget < 72) {
      finalRiskCategory = 'BALANCED';
      maxDrawdown = 20;
      maxEquity = 65;
      targetVol = 13.0;
    } else if (finalRiskBudget < 85) {
      finalRiskCategory = 'GROWTH';
      maxDrawdown = 26;
      maxEquity = 80;
      targetVol = 16.5;
    } else {
      finalRiskCategory = 'AGGRESSIVE';
      maxDrawdown = 35;
      maxEquity = 92;
      targetVol = 21.0;
    }

    return {
      capacityInputs,
      toleranceInputs,
      requirementInputs,
      perceptionInputs,

      riskCapacityScore: capacity.score,
      riskCapacityTier: capacity.tier,

      riskToleranceScore: tolerance.score,
      riskToleranceTier: tolerance.tier,

      riskRequirementScore: requirement.score,
      goalFeasibility: requirement.feasibility,

      riskPerceptionScore: perception.score,
      behavioralBiases: perception.biases,

      finalRiskBudget,
      finalRiskCategory,
      maxPermittedDrawdownPct: maxDrawdown,
      maxEquityAllocationPct: maxEquity,
      targetVolatilityCeilingPct: targetVol,
      governingConstraint,
      governingReason,

      lastUpdated: new Date().toISOString()
    };
  }

  public static getStoredFinancialDna(): UserFinancialDNA {
    const raw = localStorage.getItem(FINANCIAL_DNA_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse financial DNA from storage', e);
      }
    }

    // Default institutional baseline profile
    const initial = this.computeMasterFinancialDna(
      DEFAULT_CAPACITY_INPUTS,
      DEFAULT_TOLERANCE_INPUTS,
      DEFAULT_REQUIREMENT_INPUTS,
      DEFAULT_PERCEPTION_INPUTS
    );
    this.saveFinancialDna(initial);
    return initial;
  }

  public static saveFinancialDna(dna: UserFinancialDNA): void {
    localStorage.setItem(FINANCIAL_DNA_STORAGE_KEY, JSON.stringify(dna));
    // Dispatch custom window event so any open tab or view immediately reacts
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('investsense_financial_dna_updated', { detail: dna }));
    }
  }
}
