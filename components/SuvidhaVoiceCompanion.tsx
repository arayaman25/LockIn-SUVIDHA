'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from '@/components/Icon';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export default function SuvidhaVoiceCompanion() {
  const { isCompanionOpen, setIsCompanionOpen } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'नमस्ते! Hello! I am your SUVIDHA companion. Ask me about interest subventions, required documents, or bank branches in simple words.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSend = (text?: string) => {
    const query = (text || inputVal).trim();
    if (!query) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputVal('');

    // Generate intelligent civic response
    setTimeout(() => {
      let botReply =
        'I am here to guide you. You can check the Schemes Directory or use the "Find My Scheme" quiz to match schemes tailored to your trade or study.';
      const lower = query.toLowerCase();

      if (
        lower.includes('education') ||
        lower.includes('csis') ||
        lower.includes('student') ||
        lower.includes('moratorium')
      ) {
        botReply =
          'Under the Central Sector Interest Subsidy (CSIS), 100% full interest subsidy is provided during your entire course tenure plus 1 year moratorium for families earning up to ₹4.5 Lakhs. No collateral required!';
      } else if (
        lower.includes('mudra') ||
        lower.includes('50,000') ||
        lower.includes('50000') ||
        lower.includes('document')
      ) {
        botReply =
          'For PM SVANidhi and Mudra micro-loans up to ₹50,000, only basic Aadhaar KYC and vending/business activity proof are needed. No mortgage or third-party guarantor is required!';
      } else if (
        lower.includes('varanasi') ||
        lower.includes('branch') ||
        lower.includes('bank') ||
        lower.includes('center') ||
        lower.includes('partner')
      ) {
        botReply =
          'In Varanasi district, active dedicated SUVIDHA desks are available at State Bank of India (Civil Lines), Baroda UP Gramin Bank (Cholapur), and Kabir Chaura CSC Center.';
      } else if (
        lower.includes('subvention') ||
        lower.includes('subsidy') ||
        lower.includes('interest') ||
        lower.includes('dbt')
      ) {
        botReply =
          'Interest subvention is paid directly by the Government into your Aadhaar-linked savings bank account via Direct Benefit Transfer (DBT), lowering your monthly installments!';
      } else if (
        lower.includes('fee') ||
        lower.includes('commission') ||
        lower.includes('charge') ||
        lower.includes('agent')
      ) {
        botReply =
          'Zero fees! All government schemes on SUVIDHA are 100% free. If anyone demands money or commission, call the toll-free vigilance helpline 1800-111-7788.';
      } else if (
        lower.includes('hindi') ||
        lower.includes('सहायता') ||
        lower.includes('नमस्ते') ||
        lower.includes('ऋण')
      ) {
        botReply =
          'नमस्ते! पीएम स्वनिधि में रेहड़ी-पटरी विक्रेताओं को ₹50,000 तक का ऋण 7% ब्याज छूट के साथ मिलता है। क्या आप आवेदन करना चाहते हैं?';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <aside className="fixed bottom-6 right-6 z-50">
      {/* Floating Pill Button */}
      <button
        onClick={() => setIsCompanionOpen((prev) => !prev)}
        className="bg-primary text-surface hover:bg-primary-container px-5 py-3 rounded-full shadow-lg hover:shadow-xl border border-primary-fixed/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
        id="bot-trigger-btn"
        aria-label="Open SUVIDHA Voice Assistant"
        aria-expanded={isCompanionOpen}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping shrink-0"></span>
        <Icon name="record_voice_over" className="w-5 h-5 text-surface" />
        <span className="font-title-md text-sm font-bold whitespace-nowrap">
          Ask for Help / सहायता
        </span>
      </button>

      {/* Floating Dialogue Window */}
      {isCompanionOpen && (
        <div
          className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          id="bot-dialogue-modal"
          role="dialog"
          aria-label="Civic Assistant Window"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <Icon name="record_voice_over" className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h3 className="font-title-md text-sm text-primary font-bold">
                  SUVIDHA Companion
                </h3>
                <p className="text-[11px] text-secondary font-medium">
                  Multilingual Civic Voice Assistant
                </p>
              </div>
            </div>
            <button
              aria-label="Close Assistant"
              className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container transition-colors"
              onClick={() => setIsCompanionOpen(false)}
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>

          {/* Assistant Conversation Body */}
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'bot'
                    ? 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/30'
                    : 'bg-primary text-white rounded-tr-none ml-6'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span>{m.text}</span>
                  {m.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeak(m.text)}
                      title="Read aloud"
                      className="text-secondary hover:text-primary shrink-0 pt-0.5"
                    >
                      <Icon
                        name={isSpeaking ? 'volume_up' : 'volume_down'}
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Suggested Queries */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] text-on-surface-variant font-bold">
                Frequently Asked Civic Questions:
              </p>
              <button
                className="w-full text-left p-2 bg-surface hover:bg-secondary-container/30 rounded-xl border border-outline-variant/40 text-[11px] text-primary transition-colors block"
                onClick={() =>
                  handleSend('Am I eligible for 100% education loan interest subsidy?')
                }
              >
                • Am I eligible for 100% education loan interest subsidy?
              </button>
              <button
                className="w-full text-left p-2 bg-surface hover:bg-secondary-container/30 rounded-xl border border-outline-variant/40 text-[11px] text-primary transition-colors block"
                onClick={() => handleSend('What documents are needed for Mudra under ₹50,000?')}
              >
                • What documents are needed for Mudra under ₹50,000?
              </button>
              <button
                className="w-full text-left p-2 bg-surface hover:bg-secondary-container/30 rounded-xl border border-outline-variant/40 text-[11px] text-primary transition-colors block"
                onClick={() => handleSend('Where is the nearest partner bank in Varanasi?')}
              >
                • Where is the nearest partner bank in Varanasi?
              </button>
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2 border-t border-outline-variant/30 flex items-center gap-2"
          >
            <input
              className="flex-grow p-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Ask in Hindi, English, or any trade..."
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Send query"
              className="p-2 bg-primary text-surface hover:bg-primary-container rounded-xl transition-colors shrink-0"
            >
              <Icon name="send" className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
