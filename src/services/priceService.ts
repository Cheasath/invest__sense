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

    // Fill any missing symbol with EOD Cache fallback with isDelayed badge
    for (const sym of symbolsToFetch) {
      if (!result[sym]) {
        const fallback = generateFallbackQuote(sym);
        fallback.isDelayed = true;
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

    // 1. Try Finnhub if available
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

    // 2. Try Twelve Data for missing symbols
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

    // 3. Try Financial Modeling Prep (FMP) for missing symbols
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

    // 4. Fallback only for remaining missing symbols
    for (const sym of missingSymbols) {
      const q = generateFallbackQuote(sym);
      q.isDelayed = true;
      result[sym] = q;
    }

    return result;
  }

  public subscribe(symbols: string[], callback: QuoteUpdateCallback): () => void {
    const key = symbols.slice().sort().join(',');
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    this.subscriptions.get(key)!.add(callback);

    // Initial fetch
    this.getQuotes(symbols).then(quotes => callback(quotes));

    return () => {
      const set = this.subscriptions.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.subscriptions.delete(key);
        }
      }
    };
  }

  public getAllUniverseSymbols(): string[] {
    return CURATED_UNIVERSE.map(a => a.symbol);
  }
}

export const priceService = new PriceServiceEngine();
