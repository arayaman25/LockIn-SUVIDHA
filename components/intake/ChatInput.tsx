'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Icon from '@/components/Icon';
import VoiceInputButton from './VoiceInputButton';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isPending?: boolean;
  detectedLanguage?: string;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  isPending = false,
  detectedLanguage = 'en',
  placeholder,
}: ChatInputProps) {
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 160);
    textarea.style.height = `${newHeight}px`;
  }, [inputText]);

  // Handle voice transcript update (replaces or appends text without auto-submitting)
  const handleTranscript = (transcript: string) => {
    setInputText((prev) => {
      if (!prev.trim()) {
        return transcript;
      }
      return `${prev} ${transcript}`.trim();
    });

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled || isPending) return;

    onSendMessage(trimmed);
    setInputText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSendDisabled = !inputText.trim() || disabled || isPending;

  const defaultPlaceholder =
    'Tell us what you need in your own words... (e.g. I need a loan for business or education)';

  return (
    <div className="w-full relative">
      {/* Listening State Banner */}
      {isListening && (
        <div className="mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
            <span className="font-semibold">
              Listening... Speak clearly into your microphone
            </span>
          </div>
          <span className="text-[11px] text-red-700 font-medium hidden sm:inline">
            Review text below before sending
          </span>
        </div>
      )}

      {/* Input Card Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-300 focus-within:border-[#00472f] focus-within:ring-4 focus-within:ring-[#00472f]/10 shadow-sm transition-all duration-200 p-2 sm:p-3 relative z-10">
        <div className="flex flex-col gap-2">
          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isPending}
            placeholder={placeholder || defaultPlaceholder}
            rows={1}
            aria-label="Describe your requirement in your preferred language"
            className="w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none leading-relaxed"
          />

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 px-1 border-t border-stone-100">
            {/* Keyboard shortcut hint */}
            <div className="text-[11px] text-stone-400 hidden sm:flex items-center gap-1">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 border border-stone-200 rounded text-stone-600">
                Enter
              </kbd>
              <span>to send,</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 border border-stone-200 rounded text-stone-600">
                Shift+Enter
              </kbd>
              <span>for new line</span>
            </div>

            {/* Buttons: Microphone + Send */}
            <div className="flex items-center gap-2.5 ml-auto shrink-0 z-20">
              {/* Prominent Voice Input Button */}
              <VoiceInputButton
                onTranscript={handleTranscript}
                disabled={disabled || isPending}
                detectedLanguage={detectedLanguage}
                onListeningStateChange={setIsListening}
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={isSendDisabled}
                aria-label="Send message"
                className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 shrink-0 ${
                  isSendDisabled
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    : 'bg-[#00472f] hover:bg-[#003824] text-white shadow-md cursor-pointer'
                }`}
              >
                <span>Send</span>
                <Icon name="arrow_forward" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
