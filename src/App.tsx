import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingProfilePage } from './pages/OnboardingProfilePage';
import { OnboardingRiskPage } from './pages/OnboardingRiskPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { PortfolioHoldingsPage } from './pages/PortfolioHoldingsPage';
import { PortfolioOptimizePage } from './pages/PortfolioOptimizePage';
import { PortfolioAnalysisPage } from './pages/PortfolioAnalysisPage';
import { PortfolioRiskPage } from './pages/PortfolioRiskPage';
import { PortfolioRebalancePage } from './pages/PortfolioRebalancePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { BacktestPage } from './pages/BacktestPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { FinancialDnaPage } from './pages/FinancialDnaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/login" element={<AuthPage isRegister={false} />} />
        <Route path="/register" element={<AuthPage isRegister={true} />} />
        <Route path="/onboarding/profile" element={<OnboardingProfilePage />} />
        <Route path="/onboarding/risk" element={<OnboardingRiskPage />} />
        <Route path="/financial-dna" element={<FinancialDnaPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/asset/:id" element={<AssetDetailPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/portfolio/:id" element={<PortfolioHoldingsPage />} />
        <Route path="/portfolio/:id/optimize" element={<PortfolioOptimizePage />} />
        <Route path="/portfolio/:id/analysis" element={<PortfolioAnalysisPage />} />
        <Route path="/portfolio/:id/risk" element={<PortfolioRiskPage />} />
        <Route path="/portfolio/:id/rebalance" element={<PortfolioRebalancePage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/backtest" element={<BacktestPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
