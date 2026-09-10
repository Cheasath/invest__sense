import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(isRegister ? 'REGISTER' : 'LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('investor@investsense.io');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (mode === 'REGISTER') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          return;
        }
        await register(name, email, password);
        navigate('/onboarding/profile');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#161B22] border border-[#232B36] rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Brand logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#0D1117] text-[#0D1117] font-bold text-xl font-display mb-2 shadow-lg">
            IS
          </div>
          <h1 className="text-2xl font-bold font-display text-[#E5E7EB]">
            {mode === 'LOGIN' ? 'Welcome Back to InvestSense' : 'Create Investor Account'}
          </h1>
          <p className="text-xs text-[#8B96A5]">
            {mode === 'LOGIN' ? 'Sign in to your decision-support portfolio dashboard' : 'Set up your profile & risk assessment model'}
          </p>
        </div>

        {/* Demo Quick Selector */}
        <div className="p-3 bg-[#1C2530] border border-[#232B36] rounded-xl text-xs space-y-1.5">
          <div className="text-[10px] font-mono text-[#8B96A5] uppercase font-semibold">Demo Access Credentials:</div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#E5E7EB]">Investor Demo:</span>
            <button
              onClick={() => { setEmail('investor@investsense.io'); setPassword('password123'); setMode('LOGIN'); }}
              className="text-[#2DD4BF] hover:underline"
            >
              Autofill Investor
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#E5E7EB]">Analyst/Admin Demo:</span>
            <button
              onClick={() => { setEmail('admin@investsense.io'); setPassword('password123'); setMode('LOGIN'); }}
              className="text-[#F5B841] hover:underline"
            >
              Autofill Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#FB4B5C]/10 border border-[#FB4B5C]/30 text-[#FB4B5C] text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'REGISTER' && (
            <div>
              <label className="block text-xs font-semibold text-[#8B96A5] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8B96A5] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. A. Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8B96A5] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B96A5] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="investor@investsense.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8B96A5] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B96A5] absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1C2530] border border-[#232B36] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#E5E7EB] focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#0D1117] font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 mt-2"
          >
            {isLoading ? (
              <span>Authenticating JWT...</span>
            ) : (
              <>
                <span>{mode === 'LOGIN' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 text-xs text-[#8B96A5]">
          {mode === 'LOGIN' ? (
            <p>
              New to InvestSense?{' '}
              <button onClick={() => setMode('REGISTER')} className="text-[#2DD4BF] font-semibold hover:underline">
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('LOGIN')} className="text-[#2DD4BF] font-semibold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
