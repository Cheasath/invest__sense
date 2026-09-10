import { Quote } from '../../types';
import { generateFallbackQuote } from '../mock/mockUniverse';

const FINNHUB_KEY = (import.meta as any).env?.VITE_FINNHUB_API_KEY || 'd0gjj7pr01qhao4u1td0d0gjj7pr01qhao4u1tdg';

// Finnhub supports US/Global stock quotes and crypto/forex, e.g. 'RELIANCE.NS' or fallback
export async function fetchFinnhubQuote(symbol: string): Promise<Quote | null> {
  try {
    const isUSOrGlobal = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BTC', 'ETH'].includes(symbol.toUpperCase());
    const querySymbol = isUSOrGlobal ? symbol.toUpperCase() : (symbol.endsWith('.NS') || symbol.endsWith('.BO') ? symbol : `${symbol}.NS`);
    
    let response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${FINNHUB_KEY}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('FINNHUB_RATE_LIMIT');
      }
      return null;
    }

    let data = await response.json();

    // If Indian suffix returned 0, try without suffix
    if ((!data || data.c === 0 || data.c === undefined) && querySymbol.endsWith('.NS')) {
      const altSymbol = symbol.replace('.NS', '');
      const altResp = await fetch(`https://finnhub.io/api/v1/quote?symbol=${altSymbol}&token=${FINNHUB_KEY}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (altResp.ok) {
        data = await altResp.json();
      }
    }

    if (!data || !data.c || data.c === 0) {
      return null; // Return null so provider chain falls back to Twelve Data / FMP
    }

    const price = data.c; // current
    const prevClose = data.pc || price;
    const change = data.d !== undefined && data.d !== null ? data.d : (price - prevClose);
    const changePct = data.dp !== undefined && data.dp !== null ? data.dp : (prevClose ? (change / prevClose) * 100 : 0);

    const base = generateFallbackQuote(symbol);
    return {
      ...base,
      price: +price.toFixed(2),
      change: +change.toFixed(2),
      changePct: +changePct.toFixed(2),
      high24h: +(data.h || price * 1.01).toFixed(2),
      low24h: +(data.l || price * 0.99).toFixed(2),
      prevClose: +prevClose.toFixed(2),
      provider: 'Finnhub Live',
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'FINNHUB_RATE_LIMIT') {
      throw error;
    }
    return null;
  }
}
