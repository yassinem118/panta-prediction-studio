import axios from 'axios';

// Panta API Base URL
const PANTA_BASE_URL = 'https://api.panta.market/v1';

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

// 1. Fetch Active Prediction Markets
export const fetchPredictionMarkets = async (): Promise<PredictionMarket[]> => {
  try {
    const response = await axios.get(`${PANTA_BASE_URL}/markets`);
    return response.data;
  } catch (error) {
    console.warn('Using fallback Panta mock data during development');
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
export const getMarketCreationQuote = async (marketTitle: string) => {
  try {
    const response = await axios.post(`${PANTA_BASE_URL}/markets/quote`, { title: marketTitle });
    return response.data;
  } catch (error) {
    return { estimatedFeeSOL: 0.05, currency: 'SOL' };
  }
};