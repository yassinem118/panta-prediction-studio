import axios from 'axios';

// Panta API Base URL with Env Variable Fallback
const PANTA_BASE_URL = process.env.NEXT_PUBLIC_PANTA_API_URL || 'https://api.panta.market/v1';

export interface PredictionMarket {
  id: string;
  title: string;
  description: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
}

export interface CreationQuote {
  estimatedFeeSOL: number;
  currency: string;
}

// 1. Fetch Active Prediction Markets
export const fetchPredictionMarkets = async (): Promise<PredictionMarket[]> => {
  try {
    const response = await axios.get<PredictionMarket[]>(`${PANTA_BASE_URL}/markets`);
    return response.data;
  } catch (error) {
    console.warn('Using fallback Panta mock data during development:', error);
    return [
      {
        id: 'panta-sol-10k',
        title: 'Will Solana TVL cross $10B before Q4 2026?',
        description: 'Market resolves YES if Solana TVL exceeds 10 Billion USD.',
        category: 'DeFi',
        yesPrice: 0.65,
        noPrice: 0.35,
        volume: 125000,
        endDate: '2026-12-31',
      },
      {
        id: 'panta-meteora-dbc',
        title: 'Will Meteora launch dynamic fee pools for all SPL tokens?',
        description: 'Market prediction on Meteora DEX tooling integration.',
        category: 'Ecosystem',
        yesPrice: 0.82,
        noPrice: 0.18,
        volume: 89000,
        endDate: '2026-10-15',
      },
    ];
  }
};

// 2. Fetch Quote for Market Creation Fee
export const getMarketCreationQuote = async (marketTitle: string): Promise<CreationQuote> => {
  try {
    const response = await axios.post<CreationQuote>(`${PANTA_BASE_URL}/markets/quote`, { title: marketTitle });
    return response.data;
  } catch (error) {
    console.warn('Using fallback quote data:', error);
    return { estimatedFeeSOL: 0.05, currency: 'SOL' };
  }
};