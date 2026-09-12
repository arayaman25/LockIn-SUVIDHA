'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getLanguage } from '@/lib/languages';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
  detectedLanguage?: string;
  onListeningStateChange?: (isListening: boolean) => void;
}

export default function VoiceInputButton({
  onTranscript,
  disabled = false,
  detectedLanguage = 'en',
  onListeningStateChange,
}: VoiceInputButtonProps) {
  const language = getLanguage(detectedLanguage);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  // Accumulates only isFinal speech segments so we call onTranscript exactly once.
  const finalTranscriptBufferRef = useRef<string>('');

  // Clean up any active recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    onListeningStateChange?.(false);
  }, [onListeningStateChange]);

  const toggleListening = useCallback(() => {
    if (disabled) return;

    // If currently listening, clicking again stops it
    if (isListening) {
      stopRecognition();
      return;
    }

    setErrorMessage(null);
    finalTranscriptBufferRef.current = '';

    // Say so plainly rather than letting the recognizer fall back to another
    // language and transcribe the citizen into gibberish they have to delete.
    if (!language.speechSupported) {
      setErrorMessage(
        `Voice input is not yet available in ${language.englishName}. Please type your message instead.`
      );
      return;
    }

    // 1. Check browser support for Web Speech API
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage(
        'Voice input is not supported in this browser. You can type your message instead.'
      );
      return;
    }

    try {
      // 2. Always create a fresh SpeechRecognition instance on user tap
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language.voiceLocale;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        finalTranscriptBufferRef.current = '';
        onListeningStateChange?.(true);
      };

      recognition.onresult = (event: any) => {
        // Accumulate ONLY isFinal segments into the buffer.
        // Interim results fire many times per utterance and would duplicate
        // the transcript if forwarded directly to onTranscript.
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result?.isFinal && result[0]?.transcript) {
            finalTranscriptBufferRef.current += result[0].transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        onListeningStateChange?.(false);
        recognitionRef.current = null;

        const err = event.error;
        if (err === 'not-allowed' || err === 'permission-denied') {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permissions or type your message.'
          );
        } else if (err === 'no-speech') {
          // No speech detected during timeout - silent reset without intrusive error
          setErrorMessage(null);
        } else if (err === 'audio-capture') {
          setErrorMessage(
            'No microphone was detected on your device. Please ensure your microphone is connected.'
          );
        } else if (err === 'network') {
          setErrorMessage(
            'Voice recognition network connection error. You can type your message instead.'
          );
        } else if (err === 'aborted') {
          setErrorMessage(null);
        } else {
          setErrorMessage(
            'Unable to process voice input. You can type your message instead.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningStateChange?.(false);
        recognitionRef.current = null;
        // Deliver the complete utterance exactly once when recognition finishes.
        const buffered = finalTranscriptBufferRef.current.trim();
        if (buffered) {
          onTranscript(buffered);
          finalTranscriptBufferRef.current = '';
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('[VoiceInputButton] Start error:', err);
      setIsListening(false);
      onListeningStateChange?.(false);
      recognitionRef.current = null;
      setErrorMessage(
        'Could not start voice recognition. You can type your message instead.'
      );
    }
  }, [disabled, isListening, language, onTranscript, onListeningStateChange, stopRecognition]);

  return (
    <div className="relative inline-flex items-center shrink-0 z-20">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={
          isListening
            ? 'Stop voice recording'
            : `Use voice input in ${language.englishName}`
        }
        aria-pressed={isListening}
        title={
          isListening
            ? 'Listening... Click to stop'
            : language.speechSupported
              ? `Click to speak in ${language.nativeLabel}`
              : `Voice input is not available in ${language.englishName}`
        }
        className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00472f]/40 shrink-0 cursor-pointer ${
          isListening
            ? 'bg-red-600 text-white shadow-lg ring-4 ring-red-200 animate-pulse scale-105'
            : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-[#00472f] border border-stone-300 hover:border-[#00472f]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Visible SVG Microphone Icon (Reliable and never dependent on external font glyphs) */}
        {isListening ? (
          <svg
            className="w-5 h-5 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-stone-700 hover:text-[#00472f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        )}
      </button>

      {/* Inline Feedback / Error Popover if needed */}
      {errorMessage && (
        <div
          role="alert"
          className="absolute bottom-full right-0 mb-2 w-72 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs shadow-xl z-50 text-left"
        >
          <p className="whitespace-pre-line leading-relaxed font-medium">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="mt-2 text-[11px] font-bold text-amber-800 underline hover:text-amber-950 block"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
