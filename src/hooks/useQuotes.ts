import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Quote } from '../types';
import { priceService } from '../services/priceService';
import { useVisiblePolling } from './useVisiblePolling';

export function useQuotes(symbols: string[], pollIntervalMs: number = 20000) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stabilize symbols so changing array references don't trigger constant re-fetching
  const symbolsKey = symbols.slice().sort().join(',');
  const stableSymbols = useMemo(() => symbols, [symbolsKey]);

  const fetchLatest = useCallback(async () => {
    if (!stableSymbols.length) return;
    try {
      const result = await priceService.getQuotes(stableSymbols);
      setQuotes(prev => ({ ...prev, ...result }));
    } catch (e) {
      // Silent error handling with fallback cache
    } finally {
      setIsLoading(false);
    }
  }, [symbolsKey]);

  // Subscribe to real-time updates and trigger polling when element is visible
  useEffect(() => {
    if (!stableSymbols.length) return;
    fetchLatest();
    const unsub = priceService.subscribe(stableSymbols, (newQuotes) => {
      setQuotes(prev => ({ ...prev, ...newQuotes }));
      setIsLoading(false);
    });
    return () => unsub();
  }, [symbolsKey]);

  useVisiblePolling(fetchLatest, pollIntervalMs, containerRef);

  return { quotes, isLoading, fetchLatest, refetch: fetchLatest, containerRef };
}
