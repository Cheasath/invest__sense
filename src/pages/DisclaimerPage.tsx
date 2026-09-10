import React from 'react';
import { AppShell } from '../components/ui/AppShell';
import { ShieldCheck, AlertTriangle, Cpu, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerPage: React.FC = () => {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-[#232B36] pb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F5B841]/10 border border-[#F5B841]/30 flex items-center justify-center text-[#F5B841]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-[#E5E7EB]">
                AI Governance & Risk Disclosure
              </h1>
              <p className="text-sm text-[#8B96A5]">
                InvestSense Operating Philosophy, Regulatory Boundaries, and Decision-Support Disclosures
              </p>
            </div>
          </div>

          {/* Core Principles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#2DD4BF] font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Decision-Support Platform</span>
              </div>
              <p className="text-xs text-[#8B96A5] leading-relaxed">
                InvestSense is an AI-assisted analytics and decision-support tool designed to synthesize financial metrics, risk metrics, and Modern Portfolio Theory calculations into explainable insights.
              </p>
            </div>

            <div className="p-5 bg-[#1C2530] border border-[#232B36] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#F5B841] font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Market Risk Disclaimer</span>
              </div>
              <p className="text-xs text-[#8B96A5] leading-relaxed">
                Investment in equity securities, ETFs, mutual funds, derivatives, and sovereign bonds carries inherent capital risk. Historical backtest performance does not guarantee future financial returns.
              </p>
            </div>
          </div>

          {/* Disclosure Points */}
          <div className="space-y-4 text-xs text-[#8B96A5] leading-relaxed border-t border-[#232B36] pt-6">
            <h3 className="text-sm font-bold text-[#E5E7EB] font-display uppercase tracking-wider">
              1. Non-Brokerage & SEBI Regulatory Status
            </h3>
            <p>
              InvestSense is not registered as a SEBI Investment Adviser (RIA), Portfolio Manager (PMSA), or Stockbroker under Indian financial regulations. InvestSense does not hold client funds or execute securities orders on exchanges directly.
            </p>

            <h3 className="text-sm font-bold text-[#E5E7EB] font-display uppercase tracking-wider">
              2. Explainable AI & Algorithm Transparency
            </h3>
            <p>
              Every recommendation score, risk metric (VaR/CVaR), and portfolio optimization output produced by InvestSense includes a factor breakdown explaining the mathematical calculation. Recommendations rely on mean-variance optimization, Herfindahl concentration indices, and hybrid suitability weighting.
            </p>

            <h3 className="text-sm font-bold text-[#E5E7EB] font-display uppercase tracking-wider">
              3. Independent Investor Verification
            </h3>
            <p>
              Users are advised to independently evaluate financial decisions and consult qualified financial planners or tax advisers before committing capital.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#232B36]">
            <span className="text-xs text-[#8B96A5] font-mono">
              By continuing, you acknowledge and agree to these decision-support terms.
            </span>
            <Link
              to="/home"
              className="px-6 py-2.5 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20"
            >
              <span>Accept & Continue to Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
