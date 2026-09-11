'use client';

import React from 'react';
import Icon from '@/components/Icon';

export default function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-3 my-4 animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-label="SUVIDHA Assistant is thinking"
    >
      {/* Assistant Avatar */}
      <div className="w-9 h-9 rounded-full bg-[#00472f] text-white flex items-center justify-center shrink-0 shadow-sm">
        <Icon name="smart_toy" size={18} />
      </div>

      {/* Bubble */}
      <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">
            SUVIDHA is thinking
          </span>
          <span className="text-xs text-stone-400 font-normal">
            (सोच रहा है)
          </span>

          <div className="flex items-center gap-1 ml-1" aria-hidden="true">
            <span className="w-1.5 h-1.5 bg-[#00472f] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-[#00472f] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-[#00472f] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
