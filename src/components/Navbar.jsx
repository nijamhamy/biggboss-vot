import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function Navbar() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-stage-black/95 backdrop-blur border-b border-stage-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <h1
            className={`font-display text-3xl sm:text-4xl tracking-wide text-ivory leading-none truncate ${
              lang === 'ta' ? 'font-body font-extrabold text-2xl sm:text-3xl' : ''
            }`}
          >
            {t('wordmark')}
          </h1>
          <span className="hidden sm:inline text-xs text-muted font-medium">{t('subWordmark')}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-crimson-dim/60 border border-crimson/50 pl-2 pr-3 py-1.5 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-bright opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crimson-bright" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-crimson-bright whitespace-nowrap">
              {t('livePoll')}
            </span>
          </div>

          <button
            onClick={toggleLang}
            className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-stage-line bg-stage-surface text-ivory hover:border-gold/60 hover:text-gold transition-colors"
            aria-label="Switch language"
          >
            {t('langToggle')}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
