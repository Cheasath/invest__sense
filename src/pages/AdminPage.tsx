import React from 'react';
import { AppShell } from '../components/ui/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { Shield, Cpu, Activity, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5B841]">
              <Shield className="w-4 h-4" />
              <span className="px-2 py-0.5 rounded bg-[#F5B841]/20 text-[#F5B841] font-bold">PHASE 2 ANALYST PORTAL STUB</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Admin & Model Telemetry Portal
            </h1>
            <p className="text-xs text-[#8B96A5]">
              Real-time model drift monitoring, asset universe governance, and quantitative audit logs.
            </p>
          </div>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="MODEL PREDICTION LATENCY"
            value="142 ms"
            subtitle="P99 inference window"
            badge="Healthy"
            accentColor="#22C55E"
          />
          <StatCard
            title="ASSET UNIVERSE INSTRUMENTS"
            value="28 Active"
            subtitle="Curated India NSE/BSE & RBI Gold"
            badge="Bounded Scope"
          />
          <StatCard
            title="PRICE ENGINE CONSUMPTION"
            value="3.2% Quota"
            subtitle="Finnhub • TwelveData • FMP • EOD"
            badge="Token Bucket OK"
            accentColor="#2DD4BF"
          />
        </div>

        {/* Phase 2 Coming Soon Notice */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-[#F5B841]/10 border border-[#F5B841]/30 flex items-center justify-center text-[#F5B841] mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-[#E5E7EB]">
            Admin / Analyst Management Portal (Phase 2)
          </h3>
          <p className="text-xs text-[#8B96A5] leading-relaxed font-mono">
            Full admin capabilities for managing asset universe listings, tuning model feature weights, viewing aggregated risk telemetry, and inspecting user audit logs are scheduled for Phase 2 deployment following initial investor decision-support verification.
          </p>
        </div>
      </div>
    </AppShell>
  );
};
