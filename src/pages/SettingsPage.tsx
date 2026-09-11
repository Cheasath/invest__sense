import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/ui/AppShell';
import { useAuthStore } from '../store/useAuthStore';
import { Settings, User, ShieldCheck, Sliders, CheckCircle2, LogOut } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || 'A. Kumar');
  const [email, setEmail] = useState(user?.email || 'investor@investsense.io');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, email });
    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <Settings className="w-4 h-4" />
              <span>User Profile & Risk Parameters</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
              Account & Profile Settings
            </h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold font-display uppercase text-[#E5E7EB] tracking-wider border-b border-[#232B36] pb-3">
            Investor Profile
          </h3>

          {savedMsg && (
            <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs rounded-xl flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#8B96A5] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            <div>
              <label className="block text-[#8B96A5] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl px-4 py-2.5 text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 shadow-lg shadow-[#2DD4BF]/20"
              >
                Save Settings
              </button>

              <button
                type="button"
                onClick={() => { logout(); navigate('/login'); }}
                className="px-4 py-2.5 rounded-xl bg-[#FB4B5C]/10 border border-[#FB4B5C]/30 text-[#FB4B5C] font-bold text-xs hover:bg-[#FB4B5C]/20"
              >
                Sign Out
              </button>
            </div>
          </form>

          {/* Risk Re-assessment Link */}
          <div className="pt-4 border-t border-[#232B36] space-y-3">
            <h4 className="text-xs font-bold text-[#E5E7EB] font-display uppercase tracking-wider">
              Assessed Risk Profile & Calibration
            </h4>
            <div className="p-4 bg-[#1C2530] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="text-sm font-bold text-[#2DD4BF]">
                  {user?.riskProfile?.category || 'GROWTH'} Risk Profile
                </div>
                <div className="text-[11px] text-[#8B96A5] mt-0.5">
                  Risk Score: {user?.riskProfile?.score || 68}/100 • Max Drawdown Tolerance: -{user?.riskProfile?.maxDrawdownTolerancePct || 22}%
                </div>
              </div>

              <Link
                to="/onboarding/risk"
                className="px-4 py-2 rounded-xl bg-[#232B36] hover:bg-[#2DD4BF] hover:text-[#0D1117] text-[#E5E7EB] font-bold text-xs transition-all shrink-0"
              >
                Retake Risk Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* Codebase Export & Offline Documentation Card */}
        <div className="bg-[#161B22] border border-[#232B36] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232B36] pb-3">
            <h3 className="text-sm font-bold font-display uppercase text-[#E5E7EB] tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              Project Codebase Export & Documentation
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30">
              51 Files Bundled
            </span>
          </div>

          <p className="text-xs text-[#8B96A5] leading-relaxed">
            Download the complete source code of the entire application as a single structured text document, or open the print-ready PDF book format.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="/api/download-full-code"
              download="InvestSense_Complete_Codebase.txt"
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#1C2530] border border-[#232B36] hover:border-[#2DD4BF] text-[#E5E7EB] hover:text-[#2DD4BF] text-xs font-mono font-bold transition-all shadow-md group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">📥</span>
              <span>Download Full Code (.txt)</span>
            </a>

            <a
              href="/api/download-code-doc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-mono font-bold transition-all shadow-md group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">📄</span>
              <span>Print / Save as PDF Document</span>
            </a>
          </div>

          <div className="p-3 bg-[#0D1117] rounded-xl border border-[#232B36] text-[11px] text-[#8B96A5] space-y-1 font-mono">
            <div className="text-[#E5E7EB] font-bold">Alternative: Download as ZIP via AI Studio</div>
            <div>You can also click the top-right AI Studio project menu and choose <strong>"Export to ZIP"</strong> or <strong>"Export to GitHub"</strong> to download the entire repository with folder structure.</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
