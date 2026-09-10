import { Quote } from '../../types';
import { generateFallbackQuote } from '../mock/mockUniverse';

const TWELVEDATA_KEYS = [
  (import.meta as any).env?.VITE_TWELVEDATA_API_KEY || '773442fd94a34d4c81552222fedaff06',
  (import.meta as any).env?.VITE_TWELVEDATA_API_KEY_SECONDARY || 'ac99e239871a4df5b135ff88c83f642c'
];

let activeKeyIndex = 0;

export async function fetchTwelveDataQuotes(symbols: string[]): Promise<Record<string, Quote>> {
  const result: Record<string, Quote> = {};
  if (!symbols.length) return result;

  for (let attempt = 0; attempt < TWELVEDATA_KEYS.length; attempt++) {
    const apiKey = TWELVEDATA_KEYS[(activeKeyIndex + attempt) % TWELVEDATA_KEYS.length];
    try {
      const symbolString = symbols.map(s => `${s}:NSE`).join(',');
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbolString}&apikey=${apiKey}`);

      if (response.status === 429) {
        // Rotate key and try next
        activeKeyIndex = (activeKeyIndex + 1) % TWELVEDATA_KEYS.length;
        continue;
      }

      if (!response.ok) return result;

      const data = await response.json();

      if (data && data.status === 'error') {
        if (data.code === 429) {
          activeKeyIndex = (activeKeyIndex + 1) % TWELVEDATA_KEYS.length;
          continue;
        }
      }

      // If single symbol response or multi object
      const processItem = (sym: string, item: any) => {
        if (item && item.close) {
          const price = parseFloat(item.close);
          const change = parseFloat(item.change || '0');
          const changePct = parseFloat(item.percent_change || '0');
          const prevClose = parseFloat(item.previous_close || price);
          const base = generateFallbackQuote(sym);

          result[sym.toUpperCase()] = {
            ...base,
            price,
            change,
            changePct,
            prevClose,
            provider: 'Twelve Data',
            fetchedAt: new Date().toISOString()
          };
        }
      };

      if (symbols.length === 1) {
        processItem(symbols[0], data);
      } else {
        for (const sym of symbols) {
          const item = data[`${sym}:NSE`] || data[sym] || Object.values(data).find((v: any) => v && v.symbol && v.symbol.toUpperCase().startsWith(sym.toUpperCase()));
          if (item) {
            processItem(sym, item);
          }
        }
      }

      // Successfully processed
      if (Object.keys(result).length > 0) {
        return result;
      }
    } catch (error) {
      if (attempt === TWELVEDATA_KEYS.length - 1) {
        if (error instanceof Error && error.message === 'TWELVEDATA_RATE_LIMIT') {
          throw error;
        }
      }
    }
  }

  return result;
}
