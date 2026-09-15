import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Drop your Adsterra <script> tag(s) into the effect below, targeting
 * the container ref. Keeping the mount logic in one place means you
 * only edit this file when your ad unit or zone ID changes.
 *
 * Example (replace with your real Adsterra snippet):
 *
 *   useEffect(() => {
 *     const script = document.createElement('script');
 *     script.type = 'text/javascript';
 *     script.innerHTML = `
 *       atOptions = {
 *         key: 'YOUR_ADSTERRA_KEY',
 *         format: 'iframe',
 *         height: 90,
 *         width: 728,
 *         params: {}
 *       };
 *     `;
 *     const invoke = document.createElement('script');
 *     invoke.src = '//www.highperformanceformat.com/YOUR_ADSTERRA_KEY/invoke.js';
 *     containerRef.current.appendChild(script);
 *     containerRef.current.appendChild(invoke);
 *   }, []);
 */
function AdBanner() {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    // Adsterra script injection goes here — see comment above.
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-4">
      <span className="text-[11px] text-muted mb-2">{t('sponsored')}</span>
      <div
        ref={containerRef}
        className="w-[728px] max-w-full h-[90px] bg-stage-surface border border-stage-line rounded-lg flex items-center justify-center overflow-hidden"
      >
        <span className="text-xs text-muted">728 × 90</span>
      </div>
    </div>
  );
}

export default AdBanner;
