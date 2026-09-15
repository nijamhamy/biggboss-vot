import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function AdBanner() {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // பழைய விளம்பரம் ஏதேனும் இருந்தால் அதை சுத்தப்படுத்தல்
    containerRef.current.innerHTML = '';

    // 1. atOptions ஸ்கிரிப்டை உருவாக்குதல்
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '2bacf5179a7c0b38b518b913a59646a5',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // 2. invoke.js ஸ்கிரிப்டை உருவாக்குதல்
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.async = true;
    invokeScript.src = 'https://www.highrevenueformat.com/2bacf5179a7c0b38b518b913a59646a5/invoke.js';

    // இரண்டையும் கன்டெய்னருக்குள் சேர்த்தல்
    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-4">
      <span className="text-[11px] text-muted mb-2">{t('sponsored') || 'Sponsored'}</span>
      <div
        ref={containerRef}
        className="w-[728px] max-w-full h-[90px] bg-stage-surface border border-stage-line rounded-lg flex items-center justify-center overflow-hidden"
      >
        {/* Adsterra script will inject the 728x90 iframe here automatically */}
      </div>
    </div>
  );
}

export default AdBanner;