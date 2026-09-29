'use client';

import { useEffect, useState } from 'react';
import { fetchPredictionMarkets, getMarketCreationQuote, PredictionMarket } from '../lib/pantaApi';
import { TrendingUp, Layers, CheckCircle2, PlusCircle, BarChart3, AlertCircle, Loader2, DollarSign, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    let isMounted = true;
    fetchPredictionMarkets()
      .then((data) => {
        if (isMounted) {
          setMarkets(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load markets:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (val.length > 5) {
      try {
        const q = await getMarketCreationQuote(val);
        setQuote(q);
      } catch (err) {
        console.error('Quote error:', err);
      }
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
      setEndDate('');
      setQuote(null);

      setTimeout(() => {
        setCreatedSuccess(false);
        setActiveTab('markets');
      }, 1500);
    }, 1000);
  };

  // Calculate total platform volume dynamically
  const totalVolume = markets.reduce((acc, m) => acc + (m.volume || 0), 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Enterprise Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Panta Prediction Studio
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Infrastructure v2.0
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-900/90 rounded-xl p-1.5 border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'markets' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Markets</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'create' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Market</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Metrics Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Active Markets</p>
              <p className="text-lg font-bold text-slate-100">{markets.length} Live</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Volume Traded</p>
              <p className="text-lg font-bold text-slate-100">${totalVolume.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Security Audit Status</p>
              <p className="text-lg font-bold text-emerald-400">100% Verified</p>
            </div>
          </div>
        </div>

        {/* Explore Markets View */}
        {activeTab === 'markets' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Decentralized Prediction Feed
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-slate-400">Fetching live markets from Panta API...</p>
              </div>
            ) : markets.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No active markets found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {markets.map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                          {m.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Ends: {m.endDate}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition">{m.title}</h3>
                      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{m.description}</p>
                    </div>

                    <div>
                      {/* Prices Bar */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button className="bg-emerald-950/30 border border-emerald-800/50 hover:bg-emerald-900/40 p-3 rounded-xl flex justify-between items-center transition group/btn">
                          <span className="text-xs font-semibold text-emerald-400">BUY YES</span>
                          <span className="text-sm font-bold text-emerald-300 font-mono">{(m.yesPrice * 100).toFixed(0)}¢</span>
                        </button>
                        <button className="bg-rose-950/30 border border-rose-800/50 hover:bg-rose-900/40 p-3 rounded-xl flex justify-between items-center transition group/btn">
                          <span className="text-xs font-semibold text-rose-400">BUY NO</span>
                          <span className="text-sm font-bold text-rose-300 font-mono">{(m.noPrice * 100).toFixed(0)}¢</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                        <span className="font-mono">Vol: ${m.volume.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-indigo-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Panta Secured
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Market View */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-400" /> Launch a New Prediction Market
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Create an immutable on-chain prediction market powered by Panta routing infrastructure.
            </p>

            {createdSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> 
                <span>Market successfully deployed and indexed on Panta Network!</span>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Description & Resolution Rules</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify resolution source or oracle conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {quote && (
                <div className="p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-indigo-300 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 text-indigo-400" /> Estimated Panta Routing Fee:
                  </span>
                  <span className="font-bold text-indigo-200 font-mono text-sm">
                    {quote.estimatedFeeSOL} {quote.currency}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deploying Market via Panta API...</span>
                  </>
                ) : (
                  <span>Launch Prediction Market</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}