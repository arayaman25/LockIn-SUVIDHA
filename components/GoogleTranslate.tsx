'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DEFAULT_LANGUAGE_CODE, SUPPORTED_LANGUAGE_CODES } from '@/lib/languages';

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

const GT_INCLUDED_LANGUAGES = SUPPORTED_LANGUAGE_CODES.join(',');
const GT_LANGUAGES = new Set<string>(SUPPORTED_LANGUAGE_CODES);

export default function GoogleTranslate() {
  const { selectedLanguage } = useApp();

  /* Load Google Translate once */
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: GT_INCLUDED_LANGUAGES, autoDisplay: false },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* Use Google's cookie and a reload so it never mutates React nodes in place. */
  useEffect(() => {
    const targetLang = GT_LANGUAGES.has(selectedLanguage)
      ? selectedLanguage
      : DEFAULT_LANGUAGE_CODE;
    const cookieValue = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('googtrans='))
      ?.split('=')[1];
    const cookieLanguage = decodeURIComponent(cookieValue ?? '').split('/').pop() ?? 'en';
    const currentLang = GT_LANGUAGES.has(cookieLanguage)
      ? cookieLanguage
      : DEFAULT_LANGUAGE_CODE;

    if (currentLang === targetLang) return;

    if (targetLang === DEFAULT_LANGUAGE_CODE) {
      document.cookie = 'googtrans=; Max-Age=0; path=/';
    } else {
      document.cookie = `googtrans=/en/${targetLang}; path=/`;
    }
    window.location.reload();
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
