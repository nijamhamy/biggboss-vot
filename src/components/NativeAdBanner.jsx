import React, { useEffect, useRef } from 'react';

function NativeAdBanner() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl31360706.profitableratecpmnetwork.com/ebedc763d005987bfddf9bce320edc99/invoke.js';

        const div = document.createElement('div');
        div.id = 'container-ebedc763d005987bfddf9bce320edc99';

        containerRef.current.appendChild(script);
        containerRef.current.appendChild(div);
    }, []);

    return (
        <div className="w-full flex justify-center my-6 overflow-hidden">
            <div ref={containerRef} className="w-full max-w-xl flex justify-center"></div>
        </div>
    );
}

export default NativeAdBanner;