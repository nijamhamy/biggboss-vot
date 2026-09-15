import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useLanguage } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import AdBanner from './components/AdBanner';
import NativeAdBanner from './components/NativeAdBanner';
import ContestantList from './components/ContestantList';
import LiveChat from './components/LiveChat';

const VOTE_LOCK_KEY = 'bb_voted_date';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function App() {
  const { t, lang } = useLanguage();
  const [nominatedContestants, setNominatedContestants] = useState([]);
  const [safeContestants, setSafeContestants] = useState([]);
  const [eliminatedContestants, setEliminatedContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasVotedToday, setHasVotedToday] = useState(
    () => localStorage.getItem(VOTE_LOCK_KEY) === getTodayKey()
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchContestants();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  async function fetchContestants() {
    setLoading(true);

    // 1. இந்த வாரம் நாமினேஷனில் உள்ளவர்கள் (ஓட்டிங்க்கு தகுதியானவர்கள்)
    const { data: nomData, error: nomError } = await supabase
      .from('contestants')
      .select('*')
      .eq('is_active', true)
      .eq('is_nominated', true)
      .order('votes_count', { ascending: false });

    // 2. வீட்டில் இருக்கிறார்கள் ஆனால் இந்த வாரம் நாமினேஷனில் இல்லாதவர்கள் (Safe)
    const { data: safeData, error: safeError } = await supabase
      .from('contestants')
      .select('*')
      .eq('is_active', true)
      .eq('is_nominated', false);

    // 3. வெளியேறியவர்கள் (Eliminated)
    const { data: elimData, error: elimError } = await supabase
      .from('contestants')
      .select('*')
      .eq('is_active', false);

    if (!nomError && nomData) setNominatedContestants(nomData);
    if (!safeError && safeData) setSafeContestants(safeData);
    if (!elimError && elimData) setEliminatedContestants(elimData);

    setLoading(false);
  }

  async function handleVote(contestantId) {
    const today = getTodayKey();

    if (localStorage.getItem(VOTE_LOCK_KEY) === today) {
      setToast({ type: 'info', message: t('voteAlreadyDone') || 'இன்றைய உங்களுடைய ஓட்டு ஏற்கனவே பதிவு செய்யப்பட்டுவிட்டது!' });
      return;
    }

    const contestant = nominatedContestants.find((c) => c.id === contestantId);
    if (!contestant) return;

    const updatedVotes = contestant.votes_count + 1;

    // Optimistic UI Update for instant reflection
    setNominatedContestants(prev =>
      prev.map(c => c.id === contestantId ? { ...c, votes_count: updatedVotes } : c)
        .sort((a, b) => b.votes_count - a.votes_count)
    );

    const { error } = await supabase
      .from('contestants')
      .update({ votes_count: updatedVotes })
      .eq('id', contestantId);

    if (error) {
      setToast({ type: 'error', message: t('voteError') || 'வோட்டு பதிவு செய்வதில் பிழை ஏற்பட்டுள்ளது.' });
      fetchContestants(); // Rollback on error
      return;
    }

    localStorage.setItem(VOTE_LOCK_KEY, today);
    setHasVotedToday(true);
    setToast({ type: 'success', message: t('voteSuccess') || 'உங்கள் ஓட்டு வெற்றிகரமாக பதிவு செய்யப்பட்டது!' });
  }

  const totalVotes = nominatedContestants.reduce((sum, c) => sum + c.votes_count, 0);
  const leader = nominatedContestants[0];

  return (
    <div className="relative min-h-screen bg-stage-black text-ivory font-body overflow-hidden selection:bg-red-600 selection:text-white">

      {/* Background Animated Glowing Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-red-600/10 rounded-full filter blur-[140px] animate-blob pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-orange-600/10 rounded-full filter blur-[140px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-700/10 rounded-full filter blur-[140px] animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="relative z-10">

        {/* Sticky Navbar */}
        <Navbar />

        {/* Top 728x90 Adsterra Banner Right Below Navbar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <AdBanner />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

          {/* Stats Bar (Total Votes & Current Leader) */}
          {!loading && nominatedContestants.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-950 border border-gray-800 rounded-xl px-6 py-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {t('totalVotesToday') || 'Total Votes'}: <span className="text-gold font-display text-lg font-bold ml-1">{totalVotes.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {t('currentLeader') || 'Current Leader'}: <span className="text-orange-400 font-bold ml-1">{leader?.name ?? '—'}</span>
                </p>
              </div>
            </div>
          )}

          {/* Heading for Nominated Contestants */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span>🔥</span> {lang === 'ta' ? 'இந்த வார நாமினேஷன் (வாக்களிக்க தகுதியானவர்கள்)' : 'This Week Nomination (Eligible for Voting)'}
            </h2>
          </div>

          {/* Contestants Grid (6 per row on PC, 3 per row on Mobile) */}
          {loading ? (
            <div className="text-center text-muted py-20 text-sm">{t('loading') || 'Loading contestants...'}</div>
          ) : (
            <ContestantList
              contestants={nominatedContestants}
              totalVotes={totalVotes}
              onVote={handleVote}
              hasVotedToday={hasVotedToday}
            />
          )}

          {/* Native Banner Ad placed right below Voting Grid */}
          <NativeAdBanner />

          {/* Safe Contestants Section (Not Nominated This Week) */}
          {safeContestants.length > 0 && (
            <div className="border-t border-stage-line pt-8 mt-8 pb-6">
              <h2 className="text-center text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">
                {lang === 'ta' ? 'இந்த வாரம் நாமினேஷனில் இல்லாதவர்கள் (Safe)' : 'Safe Contestants (Not Nominated)'}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {safeContestants.map((safe) => (
                  <div
                    key={safe.id}
                    className="bg-stage-surface/60 border border-gray-800 rounded-lg p-2.5 text-center shadow-md backdrop-blur-sm"
                  >
                    <div className="h-12 w-12 mx-auto rounded-full overflow-hidden mb-1.5 bg-stage-raised border border-gray-700">
                      <img src={safe.image_url} alt={safe.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <h3 className="text-[11px] font-medium text-white truncate">{safe.name}</h3>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full mt-1 inline-block border border-emerald-800/50">
                      {lang === 'ta' ? 'பாதுகாப்பு (Safe)' : 'Safe'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Fan Chat */}
          <LiveChat />

          {/* Eliminated Section */}
          {eliminatedContestants.length > 0 && (
            <div className="border-t border-stage-line pt-8 mt-4 pb-16">
              <h2 className="text-center text-sm font-semibold text-muted mb-6">
                {t('eliminatedHeading') || 'Eliminated Contestants'}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {eliminatedContestants.map((elim) => (
                  <div
                    key={elim.id}
                    className="bg-stage-surface border border-stage-line rounded-lg p-2.5 text-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition duration-300 shadow-md"
                  >
                    <div className="h-12 w-12 mx-auto rounded-full overflow-hidden mb-1.5 bg-stage-raised border border-stage-line">
                      <img src={elim.image_url} alt={elim.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <h3 className="text-[11px] font-medium text-ivory/90 truncate">{elim.name}</h3>
                    <span className="text-[9px] bg-crimson-dim text-crimson-bright px-1.5 py-0.5 rounded-full mt-1 inline-block border border-crimson/30">
                      {t('eliminatedBadge') || 'Eliminated'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-stage-line text-center py-6 px-4 text-[11px] text-muted bg-stage-surface/40">
          {t('footer') || '© Bigg Boss Tamil Fan Poll. Unofficial website for entertainment purposes only.'}
        </footer>

        {/* Toast Notification */}
        {toast && (
          <div
            role="status"
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-lg text-sm font-medium shadow-2xl border backdrop-blur-md ${toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : toast.type === 'error'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'bg-gray-900/90 border-gray-700 text-gray-200'
              }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;