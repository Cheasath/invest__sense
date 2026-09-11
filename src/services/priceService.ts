import { Quote } from '../types';
import { TokenBucketRateLimiter } from './rateLimiter';
import { globalPriceCache } from './priceCache';
import { fetchFinnhubQuote } from './providers/finnhub.adapter';
import { fetchTwelveDataQuotes } from './providers/twelvedata.adapter';
import { fetchFMPQuotes } from './providers/fmp.adapter';
import { CURATED_UNIVERSE, generateFallbackQuote } from './mock/mockUniverse';

export type QuoteUpdateCallback = (quotes: Record<string, Quote>) => void;

class PriceServiceEngine {
  private finnhubLimiter = new TokenBucketRateLimiter(50, 60000);
  private twelveDataLimiter = new TokenBucketRateLimiter(8, 60000);
  private fmpLimiter = new TokenBucketRateLimiter(30, 60000);

  private finnhubCooldownUntil = 0;
  private twelveDataCooldownUntil = 0;
  private fmpCooldownUntil = 0;

  private subscriptions: Map<string, Set<QuoteUpdateCallback>> = new Map();

  /**
   * Primary method requested by spec:
   * interface PriceService {
   *   getQuotes(symbols: string[]): Promise<Record<string, Quote>>;
   *   subscribe(symbols: string[], onUpdate: (q: Quote) => void): Unsubscribe;
   * }
   */
  public async getQuotes(symbols: string[]): Promise<Record<string, Quote>> {
    const result: Record<string, Quote> = {};
    const symbolsToFetch: string[] = [];

    // Check cache first (stale-while-revalidate pattern)
    for (const sym of symbols) {
      const upper = sym.toUpperCase();
      const { quote, isStale } = globalPriceCache.get(upper, 15000); // 15 sec fresh TTL
      if (quote) {
        result[upper] = quote;
      }
      if (!quote || isStale) {
        symbolsToFetch.push(upper);
      }
    }

    if (symbolsToFetch.length === 0) {
      return result;
    }

    // Attempt provider fallback chain
    const fetched = await this.executeProviderChain(symbolsToFetch);

    for (const [sym, quote] of Object.entries(fetched)) {
      globalPriceCache.set(sym, quote);
      result[sym] = quote;
    }

    // Fill any missing symbol with calibrated fallback
    for (const sym of symbolsToFetch) {
      if (!result[sym]) {
        const fallback = generateFallbackQuote(sym);
        globalPriceCache.set(sym, fallback);
        result[sym] = fallback;
      }
    }

    return result;
  }

  private async executeProviderChain(symbols: string[]): Promise<Record<string, Quote>> {
    const now = Date.now();
    const result: Record<string, Quote> = {};
    let missingSymbols = [...symbols];

    // 1. Try our unified backend API endpoint first (handles Finnhub, Google Finance real-time, etc.)
    try {
      const resp = await fetch(`/api/quotes?symbols=${encodeURIComponent(missingSymbols.join(','))}`);
      if (resp.ok) {
        const data = await resp.json();
        for (const [sym, q] of Object.entries(data as Record<string, any>)) {
          if (q && q.price > 0) {
            result[sym] = {
              symbol: q.symbol || sym,
              name: q.name || sym,
              price: q.price,
              change: q.change || 0,
              changePct: q.changePct || 0,
              high24h: q.high24h || +(q.price * 1.01).toFixed(2),
              low24h: q.low24h || +(q.price * 0.99).toFixed(2),
              prevClose: q.prevClose || q.price,
              volume: q.volume || 150000,
              peRatio: q.peRatio,
              yieldPct: q.yieldPct,
              provider: q.provider || 'Live API',
              fetchedAt: q.fetchedAt || new Date().toISOString(),
              isDelayed: false
            };
          }
        }
        missingSymbols = missingSymbols.filter(s => !result[s]);
      }
    } catch (e) {
      // Server endpoint not yet available or failed, continue with client-side providers
    }

    // 2. Try Finnhub if available
    if (missingSymbols.length > 0 && now > this.finnhubCooldownUntil && this.finnhubLimiter.tryConsume()) {
      try {
        for (const sym of missingSymbols) {
          const q = await fetchFinnhubQuote(sym);
          if (q) result[sym] = q;
        }
        missingSymbols = missingSymbols.filter(s => !result[s]);
      } catch (err) {
        this.finnhubCooldownUntil = Date.now() + 60000; // 60s cooldown
      }
    }

    // 3. Try Twelve Data for missing symbols
    if (missingSymbols.length > 0 && now > this.twelveDataCooldownUntil && this.twelveDataLimiter.tryConsume()) {
      try {
        const tdResult = await fetchTwelveDataQuotes(missingSymbols);
        for (const [sym, q] of Object.entries(tdResult)) {
          if (q) result[sym] = q;
        }
        missingSymbols = missingSymbols.filter(s => !result[s]);
      } catch (err) {
        this.twelveDataCooldownUntil = Date.now() + 60000;
      }
    }

    // 4. Try Financial Modeling Prep (FMP) for missing symbols
    if (missingSymbols.length > 0 && now > this.fmpCooldownUntil && this.fmpLimiter.tryConsume()) {
      try {
        const fmpResult = await fetchFMPQuotes(missingSymbols);
        for (const [sym, q] of Object.entries(fmpResult)) {
          if (q) result[sym] = q;
        }
        missingSymbols = missingSymbols.filter(s => !result[s]);
      } catch (err) {
        this.fmpCooldownUntil = Date.now() + 60000;
      }
    }

    // 5. Fallback only for remaining missing symbols using calibrated 2026 accurate price
    for (const sym of missingSymbols) {
      const q = generateFallbackQuote(sym);
      result[sym] = q;
    }

    return result;
  }

  private intervalIds: Map<string, any> = new Map();

  public subscribe(symbols: string[], callback: QuoteUpdateCallback): () => void {
    const key = symbols.slice().sort().join(',');
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    this.subscriptions.get(key)!.add(callback);

    // Initial fetch
    this.getQuotes(symbols).then(quotes => callback(quotes));

    // Periodic live update every 12 seconds
    if (!this.intervalIds.has(key)) {
      const timer = setInterval(() => {
        this.getQuotes(symbols).then(quotes => {
          const listeners = this.subscriptions.get(key);
          if (listeners) {
            listeners.forEach(cb => cb(quotes));
          }
        });
      }, 12000);
      this.intervalIds.set(key, timer);
    }

    return () => {
      const set = this.subscriptions.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.subscriptions.delete(key);
          const timer = this.intervalIds.get(key);
          if (timer) {
            clearInterval(timer);
            this.intervalIds.delete(key);
          }
        }
      }
    };
  }

  public getAllUniverseSymbols(): string[] {
    return CURATED_UNIVERSE.map(a => a.symbol);
  }
}

export const priceService = new PriceServiceEngine();
