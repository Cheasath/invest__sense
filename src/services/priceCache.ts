import { Quote } from '../types';

interface CachedQuote {
  quote: Quote;
  fetchedAtMs: number;
}

export class PriceCache {
  private cache: Map<string, CachedQuote> = new Map();

  public get(symbol: string, maxAgeMs: number = 20000): { quote: Quote | null; isStale: boolean } {
    const entry = this.cache.get(symbol.toUpperCase());
    if (!entry) {
      return { quote: null, isStale: true };
    }
    const age = Date.now() - entry.fetchedAtMs;
    return {
      quote: entry.quote,
      isStale: age > maxAgeMs,
    };
  }

  public set(symbol: string, quote: Quote): void {
    this.cache.set(symbol.toUpperCase(), {
      quote: {
        ...quote,
        fetchedAt: new Date().toISOString(),
      },
      fetchedAtMs: Date.now(),
    });
  }

  public getAll(): Record<string, Quote> {
    const result: Record<string, Quote> = {};
    for (const [symbol, entry] of this.cache.entries()) {
      result[symbol] = entry.quote;
    }
    return result;
  }
}

export const globalPriceCache = new PriceCache();
