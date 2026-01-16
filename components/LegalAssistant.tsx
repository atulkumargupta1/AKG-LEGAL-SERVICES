
import React, { useState } from 'react';
import { getLegalAdvice } from '../services/geminiService';
import GlassCard from './GlassCard';

const LegalAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await getLegalAdvice(query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <GlassCard className="p-7 border-white/10">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3 text-white/90">
          <span className="p-1.5 bg-white/10 rounded-lg">
            <i className="fas fa-brain text-white text-xs"></i>
          </span>
          AI Jurisconsult
        </h3>
        <p className="text-[11px] font-medium text-slate-500 mb-6 leading-relaxed">
          Access immediate preliminary guidance on general legal procedures and terminology.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., What are the standard requirements for a partnership deed?"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none h-28 transition-all placeholder:text-white/70"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black hover:bg-slate-200 transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <i className="fas fa-snowflake animate-spin"></i>
            ) : (
              <i className="fas fa-bolt-lightning"></i>
            )}
            {loading ? 'Processing...' : 'Analyze Query'}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-5 bg-white/[0.03] border-l-2 border-white/60 rounded-r-xl">
            <p className="text-[12px] text-slate-300 leading-relaxed font-medium">
              {response}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default LegalAssistant;
