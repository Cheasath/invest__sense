import { Quote } from '../../types';
import { generateFallbackQuote } from '../mock/mockUniverse';

const FMP_KEY = (import.meta as any).env?.VITE_FMP_API_KEY || '7wEwwxrjrcf35MmBwtlVCPMHqA6rypGs';

export async function fetchFMPQuotes(symbols: string[]): Promise<Record<string, Quote>> {
  const result: Record<string, Quote> = {};
  if (!symbols.length) return result;

  try {
    const formattedList = symbols.map(s => {
      const isUS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BTC', 'ETH'].includes(s.toUpperCase());
      return isUS || s.includes('.') ? s.toUpperCase() : `${s.toUpperCase()}.NS`;
    });

    const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${formattedList.join(',')}?apikey=${FMP_KEY}`);

    if (response.status === 429) {
      throw new Error('FMP_RATE_LIMIT');
    }

    if (!response.ok) return result;

    const list = await response.json();
    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item || !item.price) continue;
        const rawSymbol = (item.symbol || '').replace('.NS', '').replace('.BO', '').toUpperCase();
        if (rawSymbol) {
          const base = generateFallbackQuote(rawSymbol);
          result[rawSymbol] = {
            ...base,
            price: +item.price.toFixed(2),
            change: +(item.change || 0).toFixed(2),
            changePct: +(item.changesPercentage || 0).toFixed(2),
            high24h: +(item.dayHigh || item.price * 1.01).toFixed(2),
            low24h: +(item.dayLow || item.price * 0.99).toFixed(2),
            prevClose: +(item.previousClose || item.price).toFixed(2),
            provider: 'Financial Modeling Prep',
            fetchedAt: new Date().toISOString()
          };
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'FMP_RATE_LIMIT') {
      throw error;
    }
  }

  return result;
}
