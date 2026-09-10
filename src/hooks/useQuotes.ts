import { useState, useEffect, useCallback, useRef } from 'react';
import { Quote } from '../types';
import { priceService } from '../services/priceService';
import { useVisiblePolling } from './useVisiblePolling';

export function useQuotes(symbols: string[], pollIntervalMs: number = 20000) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLatest = useCallback(async () => {
    if (!symbols.length) return;
    try {
      const result = await priceService.getQuotes(symbols);
      setQuotes(prev => ({ ...prev, ...result }));
    } catch (e) {
      // Silent error handling with fallback cache
    } finally {
      setIsLoading(false);
    }
  }, [symbols]);

  // Subscribe to real-time updates and trigger polling when element is visible
  useEffect(() => {
    if (!symbols.length) return;
    const unsub = priceService.subscribe(symbols, (newQuotes) => {
      setQuotes(prev => ({ ...prev, ...newQuotes }));
      setIsLoading(false);
    });
    return () => unsub();
  }, [symbols]);

  useVisiblePolling(fetchLatest, pollIntervalMs, containerRef);

  return { quotes, isLoading, fetchLatest, containerRef };
}
