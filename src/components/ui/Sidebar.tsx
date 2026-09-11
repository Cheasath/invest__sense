import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  PieChart,
  SlidersHorizontal,
  BarChart3,
  ShieldAlert,
  Repeat,
  Sparkles,
  Gamepad2,
  History,
  Star,
  Settings,
  Info,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export const Sidebar: React.FC = () => {
  const { activePortfolio } = usePortfolioStore();
  const pfId = activePortfolio?.id || 'pf_main_01';

  const navGroups = [
    {
      title: 'CORE RISK ARCHITECTURE',
      items: [
        { to: '/financial-dna', label: 'Financial DNA Engine', icon: ShieldCheck, badge: 'Baseline' }
      ]
    },
    {
      title: 'MARKET & DASHBOARD',
      items: [
        { to: '/home', label: 'Investment Universe', icon: Globe },
        { to: '/dashboard', label: 'Investor Dashboard', icon: LayoutDashboard, badge: 'TradeZella' }
      ]
    },
    {
      title: 'PORTFOLIO ANALYTICS',
      items: [
        { to: `/portfolio/${pfId}`, label: 'Holdings & Summary', icon: PieChart },
        { to: `/portfolio/${pfId}/optimize`, label: 'MPT Optimization', icon: SlidersHorizontal },
        { to: `/portfolio/${pfId}/analysis`, label: 'Performance Heatmap', icon: BarChart3 },
        { to: `/portfolio/${pfId}/risk`, label: 'Risk Management', icon: ShieldAlert, badge: 'VaR/CVaR' },
        { to: `/portfolio/${pfId}/rebalance`, label: 'Rebalance Engine', icon: Repeat }
      ]
    },
    {
      title: 'AI DECISION SUPPORT',
      items: [
        { to: '/recommendations', label: 'AI Suitability Engine', icon: Sparkles },
        { to: '/simulator', label: 'Paper Simulator', icon: Gamepad2 },
        { to: '/backtest', label: 'Strategy Backtest', icon: History }
      ]
    },
    {
      title: 'ACCOUNT & GOVERNANCE',
      items: [
        { to: '/watchlist', label: 'Watchlist', icon: Star },
        { to: '/settings', label: 'Settings & Risk Profile', icon: Settings },
        { to: '/disclaimer', label: 'AI Disclosure & Risk', icon: Info },
        { to: '/admin/overview', label: 'Analyst / Admin Portal', icon: Shield, badge: 'Phase 2' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#232B36] min-h-[calc(100vh-57px)] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-[10px] font-bold text-[#8B96A5] tracking-wider uppercase mb-2 font-mono">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#161B22] text-[#2DD4BF] font-semibold border border-[#232B36]'
                          : 'text-[#8B96A5] hover:text-[#E5E7EB] hover:bg-[#161B22]/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#232B36] text-[#2DD4BF]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Compliance Disclaimer Banner */}
      <div className="p-3 bg-[#161B22] border border-[#232B36] rounded-xl space-y-1 text-[11px] font-mono text-[#8B96A5]">
        <div className="flex items-center gap-1.5 text-[#2DD4BF] font-bold text-[10px]">
          <Shield className="w-3.5 h-3.5" />
          <span>RESEARCH & EDUCATIONAL</span>
        </div>
        <p className="text-[10px] leading-tight">
          SEBI / SEC compliant non-discretionary decision-support framework.
        </p>
      </div>
    </aside>
  );
};
