import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  isNegative,
  subtitle,
  icon,
  badge,
  accentColor,
  children
}) => {
  return (
    <div className="bg-[#161B22] border border-[#232B36] rounded-xl p-4 hover:border-[#232B36]/80 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[#8B96A5] tracking-wide uppercase">{title}</span>
        {icon && <div className="text-[#8B96A5]">{icon}</div>}
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#232B36] text-[#2DD4BF]">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span
          className="text-2xl font-bold tracking-tight text-[#E5E7EB] font-mono"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded font-mono ${
              isPositive
                ? 'text-[#22C55E] bg-[#22C55E]/10'
                : isNegative
                ? 'text-[#FB4B5C] bg-[#FB4B5C]/10'
                : 'text-[#8B96A5] bg-[#232B36]'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-[#8B96A5] mt-1.5">{subtitle}</p>}
      {children && <div className="mt-3 pt-2 border-t border-[#232B36]">{children}</div>}
    </div>
  );
};
