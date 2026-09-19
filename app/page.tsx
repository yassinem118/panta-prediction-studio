'use client';

import { useEffect, useState } from 'react';
import { fetchPredictionMarkets, getMarketCreationQuote, PredictionMarket } from '../lib/pantaApi';
import { TrendingUp, Layers, CheckCircle2, PlusCircle, BarChart3, AlertCircle } from 'lucide-react';

export default function Home() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [activeTab, setActiveTab] = useState<'markets' | 'create'>('markets');
  
  // Market Creation Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DeFi');
  const [endDate, setEndDate] = useState('');
  const [quote, setQuote] = useState<{ estimatedFeeSOL: number; currency: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  useEffect(() => {
    fetchPredictionMarkets().then(setMarkets);
  }, []);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (val.length > 5) {
      const q = await getMarketCreationQuote(val);
      setQuote(q);
    } else {
      setQuote(null);
    }
  };

  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    setTimeout(() => {
      const newMarket: PredictionMarket = {
        id: `panta-custom-${Date.now()}`,
        title,
        description,
        category,
        yesPrice: 0.50,
        noPrice: 0.50,
        volume: 0,
        endDate: endDate || '2026-12-31',
      };

      setMarkets([newMarket, ...markets]);
      setIsCreating(false);
      setCreatedSuccess(true);
      setTitle('');
      setDescription('');
      setQuote(null);

      setTimeout(() => {
        setCreatedSuccess(false);
        setActiveTab('markets');
      }, 1500);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Panta Prediction Studio
              </h1>
              <p className="text-xs text-slate-400">Powered by Panta API Infrastructure</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-800/80 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === 'markets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Markets</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Market</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* Explore Markets View */}
        {activeTab === 'markets' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-400" /> Active Prediction Markets
              </h2>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full">
                {markets.length} Markets Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {markets.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition duration-300 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-indigo-400 border border-slate-700">
                        {m.category}
                      </span>
                      <span className="text-xs text-slate-500">Ends: {m.endDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-2">{m.title}</h3>
                    <p className="text-sm text-slate-400 mb-6">{m.description}</p>
                  </div>

                  <div>
                    {/* Prices Bar */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button className="bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/50 p-3 rounded-xl flex justify-between items-center transition">
                        <span className="text-xs font-medium text-emerald-400">BUY YES</span>
                        <span className="text-sm font-bold text-emerald-300">{(m.yesPrice * 100).toFixed(0)}¢</span>
                      </button>
                      <button className="bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/50 p-3 rounded-xl flex justify-between items-center transition">
                        <span className="text-xs font-medium text-rose-400">BUY NO</span>
                        <span className="text-sm font-bold text-rose-300">{(m.noPrice * 100).toFixed(0)}¢</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs text-slate-500">
                      <span>Volume: ${m.volume.toLocaleString()}</span>
                      <span className="flex items-center gap-1 text-indigo-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Panta Verified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Market View */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-400" /> Launch a New Market
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Create an on-chain prediction market powered by Panta API routing.
            </p>

            {createdSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Market successfully created and added to Panta Network!
              </div>
            )}

            <form onSubmit={handleCreateMarket} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Market Title / Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Will Solana reach $300 in 2026?"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Description & Resolution Rules</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify resolution source or condition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DeFi">DeFi</option>
                    <option value="Ecosystem">Ecosystem</option>
                    <option value="Sports">Sports</option>
                    <option value="AI">AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {quote && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-indigo-400" /> Estimated Panta Fee:
                  </span>
                  <span className="font-bold text-indigo-300">
                    {quote.estimatedFeeSOL} {quote.currency}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isCreating ? 'Creating Market via Panta API...' : 'Create Prediction Market'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
 }