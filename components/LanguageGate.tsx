'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/Icon';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

interface LanguageGateProps {
  value: string;
  onSelect: (code: string) => void;
}

/**
 * First-run language chooser, shown over the landing page before the citizen
 * reads anything.
 *
 * Choosing up front rather than inferring after the fact is what makes voice
 * input usable: the speech recognizer has to be told a locale before it hears
 * the first word, and assuming English mis-transcribes everyone else.
 *
 * Every option is labelled in its own script, because a citizen who cannot
 * read English cannot be asked to find their language in an English list.
 */
export default function LanguageGate({ value, onSelect }: LanguageGateProps) {
  // The page behind the overlay must not scroll while it is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-gate-title"
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm overflow-y-auto p-4 flex items-start sm:items-center justify-center"
    >
      <div className="w-full max-w-2xl my-auto bg-surface rounded-2xl border border-outline-variant/60 shadow-2xl p-6 sm:p-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-sm mx-auto">
            <Icon name="translate" size={28} className="text-white" />
          </div>
          <h2
            id="language-gate-title"
            className="mt-4 text-xl sm:text-2xl font-serif font-bold text-primary"
          >
            Choose your language
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            अपनी भाषा चुनें · Select the language you are most comfortable with
          </p>
          <p className="mt-2 text-xs text-on-surface-variant/80">
            The whole portal and the assistant will switch to it. You can change it any time from
            the top of the page.
          </p>
        </div>

        <ul className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang, index) => {
            const isSelected = lang.code === value;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  lang={lang.code}
                  autoFocus={index === 0}
                  onClick={() => onSelect(lang.code)}
                  aria-current={isSelected}
                  className={`w-full h-full min-h-19 px-3 py-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 text-center transition-all duration-150 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary/25 ${
                    isSelected
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'bg-surface-container-lowest border-outline-variant hover:border-primary hover:bg-secondary-container/40 text-on-surface'
                  }`}
                >
                  <span
                    dir={lang.dir}
                    className="text-lg sm:text-xl font-semibold leading-tight"
                  >
                    {lang.nativeLabel}
                  </span>
                  <span
                    className={`text-[11px] ${isSelected ? 'text-white/75' : 'text-on-surface-variant'}`}
                  >
                    {lang.englishName}
                  </span>
                  {!lang.speechSupported && (
                    <span
                      className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/60' : 'text-on-surface-variant/70'}`}
                    >
                      Typing only
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-[11px] text-on-surface-variant/70">
          Languages marked “Typing only” are fully supported for reading and typing, but your
          browser cannot yet transcribe speech in them.
        </p>
      </div>
    </div>
  );
}
