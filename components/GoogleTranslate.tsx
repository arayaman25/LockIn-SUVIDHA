'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          opts: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          containerId: string
        ) => void;
      };
    };
  }
}

const GT_LANG_MAP: Record<string, string> = {
  en: 'en', hi: 'hi', bn: 'bn', mr: 'mr',
  ta: 'ta', te: 'te', gu: 'gu', kn: 'kn',
};

export default function GoogleTranslate() {
  const { selectedLanguage } = useApp();

  /* Load Google Translate once */
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,hi,bn,mr,ta,te,gu,kn', autoDisplay: false },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* Drive translation whenever selectedLanguage changes */
  useEffect(() => {
    const targetLang = GT_LANG_MAP[selectedLanguage] ?? 'en';

    const applyTranslation = () => {
      const gtSelect = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (gtSelect) {
        gtSelect.value = targetLang;
        gtSelect.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      if (applyTranslation() || ++attempts > 20) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [selectedLanguage]);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />
      <style>{`
        .goog-te-banner-frame, #goog-gt-tt, .goog-tooltip { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget { display: none !important; }
        .goog-te-highlight { background: transparent !important; }
      `}</style>
    </>
  );
}
