import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="bg-[#0D1117] border-t border-[#232B36] py-6 px-4 md:px-8 mt-12 text-xs text-[#8B96A5]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <ShieldAlert className="w-5 h-5 text-[#F5B841] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#E5E7EB]">Responsible AI & Regulatory Disclosure:</strong> InvestSense provides AI-assisted investment decision-support and analysis tools. It is not a SEBI-registered investment advisor, portfolio manager, or stockbroker, and does not execute financial transactions directly. Market investments are subject to risk. Past performance is no guarantee of future returns.{' '}
            <Link to="/disclaimer" className="text-[#2DD4BF] hover:underline inline-flex items-center gap-0.5 font-medium">
              Read Full AI Governance Disclaimer <Info className="w-3 h-3 ml-0.5" />
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#8B96A5] self-end md:self-center font-mono">
          <span>Region: IN (INR)</span>
          <span>•</span>
          <span>Engine: v1.0 MPT+GenAI</span>
          <span>•</span>
          <span>AI Studio Build</span>
        </div>
      </div>
    </footer>
  );
};
