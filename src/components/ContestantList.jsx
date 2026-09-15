import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const RISK_COUNT = 2;
const MIN_CONTESTANTS_FOR_RISK = 4;

function ContestantList({ contestants, totalVotes, onVote, hasVotedToday }) {
  const { t, lang } = useLanguage();

  if (!contestants || contestants.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16 bg-gray-900/40 border border-gray-800 rounded-2xl backdrop-blur-md text-sm">
        {lang === 'ta' ? 'போட்டியாளர்கள் யாரும் இல்லை.' : 'No contestants found.'}
      </div>
    );
  }

  const sorted = [...contestants].sort((a, b) => b.votes_count - a.votes_count);
  const riskIds =
    sorted.length >= MIN_CONTESTANTS_FOR_RISK
      ? new Set(sorted.slice(-RISK_COUNT).map((c) => c.id))
      : new Set();

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
      {sorted.map((person, index) => {
        const percentage = totalVotes > 0 ? ((person.votes_count / totalVotes) * 100).toFixed(1) : '0.0';
        const isAtRisk = riskIds.has(person.id);
        const rank = index + 1;

        return (
          <div
            key={person.id}
            className="relative bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950 border border-gray-800/80 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-gray-700"
          >
            {/* Rank Ribbon */}
            <div className="absolute top-2 left-2 z-10 h-6 w-6 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center shadow-md">
              <span className="font-display text-amber-400 text-xs font-bold leading-none">{rank}</span>
            </div>

            {/* Elimination Risk Ribbon */}
            {isAtRisk && (
              <div className="absolute top-2 right-0 z-10 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-l-full shadow-lg animate-pulse">
                {lang === 'ta' ? 'ஆபத்து' : 'Risk'}
              </div>
            )}

            <div>
              {/* Contestant Image */}
              <div className="aspect-square w-full bg-gray-950 overflow-hidden relative">
                <img
                  src={person.image_url}
                  alt={person.name}
                  className="w-full h-full object-cover object-top filter saturate-110"
                  loading="lazy"
                />
              </div>

              {/* Short & Clean Text Details */}
              <div className="p-2 flex flex-col gap-1.5 text-center">
                <h3 className="text-xs font-bold text-white truncate">{person.name}</h3>
                
                <div className="text-[10px] text-gray-400 flex justify-between px-1">
                  <span>{lang === 'ta' ? 'வாக்கு:' : 'Votes:'}</span>
                  <span className="text-amber-400 font-bold">{person.votes_count.toLocaleString()}</span>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-gray-400 mb-0.5 px-1">
                    <span>{lang === 'ta' ? 'பங்கு' : 'Share'}</span>
                    <span className="text-white font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vote Button */}
            <div className="p-2 pt-0">
              <button
                onClick={() => onVote(person.id)}
                disabled={hasVotedToday}
                className={`w-full font-extrabold py-1.5 px-1 rounded-lg text-[10px] sm:text-xs transition-all shadow-lg active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1 ${
                  hasVotedToday
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-orange-900/50 border border-orange-400/40'
                }`}
              >
                🔥 {hasVotedToday ? (lang === 'ta' ? 'முடிந்தது' : 'Voted') : (lang === 'ta' ? 'வொட்டு' : 'Vote')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContestantList;