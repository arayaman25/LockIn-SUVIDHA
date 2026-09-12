/**
 * The single source of truth for every language the portal offers.
 *
 * Three subsystems key off this list and previously disagreed with each
 * other: the Google Translate widget, the browser speech recognizer, and the
 * conversational intake. Add a language here and all three follow.
 */
export interface SupportedLanguage {
  /** ISO 639-1 code — what gets persisted and sent to the backend. */
  code: string;
  /** Written in its own script, so a reader who cannot read English can still find it. */
  nativeLabel: string;
  englishName: string;
  /** BCP-47 tag for the Web Speech API. */
  voiceLocale: string;
  /**
   * Chrome's speech recognizer covers fewer languages than Google Translate.
   * Where this is false the microphone is presented as unavailable rather
   * than silently transcribing the citizen into the wrong language.
   */
  speechSupported: boolean;
  dir?: 'rtl';
}

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { code: 'en', nativeLabel: 'English', englishName: 'English', voiceLocale: 'en-IN', speechSupported: true },
  { code: 'hi', nativeLabel: 'हिंदी', englishName: 'Hindi', voiceLocale: 'hi-IN', speechSupported: true },
  { code: 'bn', nativeLabel: 'বাংলা', englishName: 'Bengali', voiceLocale: 'bn-IN', speechSupported: true },
  { code: 'mr', nativeLabel: 'मराठी', englishName: 'Marathi', voiceLocale: 'mr-IN', speechSupported: true },
  { code: 'ta', nativeLabel: 'தமிழ்', englishName: 'Tamil', voiceLocale: 'ta-IN', speechSupported: true },
  { code: 'te', nativeLabel: 'తెలుగు', englishName: 'Telugu', voiceLocale: 'te-IN', speechSupported: true },
  { code: 'gu', nativeLabel: 'ગુજરાતી', englishName: 'Gujarati', voiceLocale: 'gu-IN', speechSupported: true },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ', englishName: 'Kannada', voiceLocale: 'kn-IN', speechSupported: true },
  { code: 'ml', nativeLabel: 'മലയാളം', englishName: 'Malayalam', voiceLocale: 'ml-IN', speechSupported: true },
  { code: 'pa', nativeLabel: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', voiceLocale: 'pa-Guru-IN', speechSupported: true },
  { code: 'ur', nativeLabel: 'اردو', englishName: 'Urdu', voiceLocale: 'ur-IN', speechSupported: true, dir: 'rtl' },
  { code: 'or', nativeLabel: 'ଓଡ଼ିଆ', englishName: 'Odia', voiceLocale: 'or-IN', speechSupported: false },
  { code: 'as', nativeLabel: 'অসমীয়া', englishName: 'Assamese', voiceLocale: 'as-IN', speechSupported: false },
];

const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

export const DEFAULT_LANGUAGE_CODE = DEFAULT_LANGUAGE.code;

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

const byCode = new Map(SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang]));

/**
 * Normalizes any language identifier we might receive into a supported code.
 *
 * The backend LLM reports the language it detected as a free-form string, so
 * this has to absorb `"hi"`, `"hi-IN"` and `"Hindi"` alike, and fall back to
 * English rather than throwing on something unrecognized.
 */
export function resolveLanguageCode(value?: string | null): string {
  if (!value) return DEFAULT_LANGUAGE_CODE;

  const normalized = value.toLowerCase().trim();
  const byExactOrRegion = byCode.get(normalized) ?? byCode.get(normalized.split('-')[0]);
  if (byExactOrRegion) return byExactOrRegion.code;

  const byName = SUPPORTED_LANGUAGES.find((lang) =>
    normalized.startsWith(lang.englishName.toLowerCase())
  );
  return byName?.code ?? DEFAULT_LANGUAGE_CODE;
}

export function getLanguage(value?: string | null): SupportedLanguage {
  return byCode.get(resolveLanguageCode(value)) ?? DEFAULT_LANGUAGE;
}

/** BCP-47 tag for the Web Speech API, for any language identifier. */
export function getVoiceLocale(value?: string | null): string {
  return getLanguage(value).voiceLocale;
}
