import { useState, useEffect, useCallback } from 'react';
import { UserFinancialDNA } from '../types';
import { FinancialDnaEngine } from '../services/financialDnaService';
import { useAuthStore } from '../store/useAuthStore';

export function useFinancialDna() {
  const { user, updateProfile } = useAuthStore();
  const [financialDna, setFinancialDna] = useState<UserFinancialDNA>(() => {
    return user?.financialDna || FinancialDnaEngine.getStoredFinancialDna();
  });

  useEffect(() => {
    // Listen for cross-component and cross-tab update events
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserFinancialDNA>;
      if (customEvent.detail) {
        setFinancialDna(customEvent.detail);
      }
    };

    window.addEventListener('investsense_financial_dna_updated', handleUpdate);
    return () => {
      window.removeEventListener('investsense_financial_dna_updated', handleUpdate);
    };
  }, []);

  const saveDna = useCallback(async (updated: UserFinancialDNA) => {
    FinancialDnaEngine.saveFinancialDna(updated);
    setFinancialDna(updated);

    // Also update auth user profile so riskProfile stays in sync
    await updateProfile({
      financialDna: updated,
      riskProfile: {
        score: updated.finalRiskBudget,
        category: updated.finalRiskCategory,
        maxDrawdownTolerancePct: updated.maxPermittedDrawdownPct,
        assessedAt: updated.lastUpdated,
        factors: [
          {
            factor: 'Risk Capacity Tier',
            impact: updated.riskCapacityTier === 'HIGH' ? 'HIGH' : 'MEDIUM',
            description: `Assessed ${updated.riskCapacityTier} capacity based on cash buffer, EMI load, and horizon.`
          },
          {
            factor: 'Governing Constraint',
            impact: 'HIGH',
            description: updated.governingReason
          },
          {
            factor: 'Goal Feasibility Status',
            impact: updated.goalFeasibility.isFeasible ? 'LOW' : 'HIGH',
            description: `Target CAGR required: ${updated.goalFeasibility.requiredAnnualReturnPct}%.`
          }
        ]
      }
    });
  }, [updateProfile]);

  return {
    financialDna,
    saveDna,
    calculateCapacity: FinancialDnaEngine.calculateRiskCapacity,
    calculateTolerance: FinancialDnaEngine.calculateRiskTolerance,
    calculateRequirement: FinancialDnaEngine.calculateRiskRequirement,
    calculatePerception: FinancialDnaEngine.calculateRiskPerception,
    computeMasterDna: FinancialDnaEngine.computeMasterFinancialDna
  };
}
