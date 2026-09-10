import React from 'react';
import { ViewMode } from '../../types';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export const ViewModeToggle: React.FC = () => {
  const { viewMode, setViewMode } = usePortfolioStore();

  const modes: { id: ViewMode; label: string; tooltip: string }[] = [
    { id: 'ABSOLUTE', label: '₹ Absolute', tooltip: 'View monetary values in Indian Rupees (INR)' },
    { id: 'PERCENTAGE', label: '% Percentage', tooltip: 'View metrics relative to cost basis / portfolio weight' },
    { id: 'RISK_ADJUSTED', label: 'Risk-Adj.', tooltip: 'View Sharpe & Beta adjusted return ratios' }
  ];

  return (
    <div className="inline-flex items-center p-1 bg-[#161B22] border border-[#232B36] rounded-lg text-xs font-medium">
      {modes.map(mode => {
        const isActive = viewMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            title={mode.tooltip}
            className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
              isActive
                ? 'bg-[#2DD4BF] text-[#0D1117] font-semibold shadow-sm'
                : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#1C2530]'
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};
