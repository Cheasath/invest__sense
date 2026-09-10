import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DisclaimerFooter } from './DisclaimerFooter';
import { useAuthStore } from '../../store/useAuthStore';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { priceService } from '../../services/priceService';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { checkAuth } = useAuthStore();
  const { activePortfolio, loadPortfolios, updateLiveQuotes } = usePortfolioStore();

  useEffect(() => {
    checkAuth();
    loadPortfolios();
  }, [checkAuth, loadPortfolios]);

  useEffect(() => {
    if (!activePortfolio || !activePortfolio.holdings.length) return;
    const symbols = activePortfolio.holdings.map(h => h.symbol);

    const unsub = priceService.subscribe(symbols, (quotes) => {
      updateLiveQuotes(quotes);
    });

    return () => unsub();
  }, [activePortfolio?.id, updateLiveQuotes]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E5E7EB] flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
      <DisclaimerFooter />
    </div>
  );
};
