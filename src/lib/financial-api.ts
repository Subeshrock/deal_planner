// Financial API integrations
export interface ExchangeRateData {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export interface InflationData {
  country: string;
  inflation: number;
  year: number;
}

export interface InterestRateData {
  rate: number;
  country: string;
  lastUpdated: string;
}

class FinancialAPIService {
  private baseURL = 'https://api.exchangerate-api.com/v4/latest'; // Free tier

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRateData> {
    try {
      const response = await fetch(`${this.baseURL}/${baseCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      const data = await response.json();
      return {
        rates: data.rates,
        base: data.base,
        date: data.date
      };
    } catch (error) {
      console.error('Exchange rate API error:', error);
      // Fallback to static rates
      return {
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110,
          CAD: 1.25,
          AUD: 1.35
        },
        base: 'USD',
        date: new Date().toISOString().split('T')[0]
      };
    }
  }

  async getInflationRate(country: string = 'US'): Promise<number> {
    // Note: Most free APIs don't provide real-time inflation data
    // This would need a paid API like Alpha Vantage or similar
    // For demo purposes, return reasonable estimates
    const inflationRates: Record<string, number> = {
      'US': 3.1,
      'EU': 2.8,
      'GB': 2.5,
      'JP': 1.2,
      'CA': 2.9,
      'AU': 2.1
    };

    return inflationRates[country] || 2.5;
  }

  async getInterestRate(country: string = 'US'): Promise<number> {
    // Similar to inflation, would need paid API
    // Return reasonable estimates
    const interestRates: Record<string, number> = {
      'US': 5.25,
      'EU': 4.25,
      'GB': 5.0,
      'JP': 0.1,
      'CA': 4.75,
      'AU': 4.35
    };

    return interestRates[country] || 4.0;
  }

  convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number {
    if (from === to) return amount;

    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;

    return (amount / fromRate) * toRate;
  }
}

export const financialAPI = new FinancialAPIService();