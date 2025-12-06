'use client';

import { useState } from 'react';
import AngelCard from '@/components/features/decision/AngelCard';
import DevilCard from '@/components/features/decision/DevilCard';
import api from '@/lib/axios';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [angelReason, setAngelReason] = useState('');
  const [devilReason, setDevilReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecide = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setAngelReason('');
    setDevilReason('');

    try {
      const [angelRes, devilRes] = await Promise.all([
        api.post('/validate', { promptType: 'angel', userInput }),
        api.post('/validate', { promptType: 'devil', userInput }),
      ]);

      setAngelReason(angelRes.data.result);
      setDevilReason(devilRes.data.result);
    } catch (error) {
      console.error('Error fetching decisions:', error);
      // Optional: Add visible error handling here
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex relative overflow-hidden">
      {/* Angel Side (Left) */}
      <div className="w-1/2 h-full bg-sky-100 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,#3b82f6,transparent)]" />
        <AngelCard content={angelReason} loading={loading} />
      </div>

      {/* Devil Side (Right) */}
      <div className="w-1/2 h-full bg-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,#ef4444,transparent)]" />
        <DevilCard content={devilReason} loading={loading} />
      </div>

      {/* Center Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-2xl flex gap-2 border border-slate-200">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Should I buy a third coffee today?"
            className="flex-1 bg-transparent px-6 py-3 text-lg outline-none text-slate-800 placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleDecide()}
          />
          <button
            onClick={handleDecide}
            disabled={loading || !userInput.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ASK
          </button>
        </div>
      </div>

      {/* VS Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="bg-white text-slate-900 font-black text-2xl w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-slate-100">
          VS
        </div>
      </div>
    </main>
  );
}
