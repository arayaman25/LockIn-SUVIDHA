'use client';

import React from 'react';
import Icon from '@/components/Icon';

interface CalculatorSliderProps {
  label: string;
  labelHindi?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  isCurrency?: boolean;
  unitSuffix?: string;
  onChange: (val: number) => void;
  error?: string;
  helperText?: string;
}

export default function CalculatorSlider({
  label,
  labelHindi,
  value,
  min,
  max,
  step = 1,
  isCurrency = false,
  unitSuffix = '',
  onChange,
  error,
  helperText,
}: CalculatorSliderProps) {
  const formatDisplay = (val: number) => {
    if (isCurrency) {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    return `${val} ${unitSuffix}`.trim();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value);
    if (!isNaN(nextVal)) {
      onChange(nextVal);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const nextVal = raw ? parseInt(raw, 10) : 0;
    onChange(nextVal);
  };

  return (
    <div className="space-y-3">
      {/* Header with Title and Value display input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs sm:text-sm font-bold text-on-surface block">
            {label} {labelHindi && <span className="text-on-surface-variant font-normal">({labelHindi})</span>}
          </label>
          {helperText && (
            <p className="text-[11px] text-on-surface-variant mt-0.5">{helperText}</p>
          )}
        </div>

        {/* Precision numeric input box */}
        <div className="relative self-start sm:self-auto">
          {isCurrency && (
            <span className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-on-surface-variant pointer-events-none">
              ₹
            </span>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={isCurrency ? value.toLocaleString('en-IN') : value}
            onChange={handleInputChange}
            className={`w-36 py-2 rounded-xl text-right font-bold text-xs sm:text-sm bg-surface border focus:outline-none focus:ring-1 transition-all ${
              isCurrency ? 'pl-7 pr-3' : 'px-3'
            } ${
              error
                ? 'border-error text-error focus:ring-error'
                : 'border-outline-variant text-primary focus:ring-primary focus:border-primary'
            }`}
          />
          {!isCurrency && unitSuffix && (
            <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold text-on-surface-variant pointer-events-none">
              {unitSuffix}
            </span>
          )}
        </div>
      </div>

      {/* Range slider */}
      <div className="pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={handleSliderChange}
          className="emi-slider w-full cursor-pointer"
        />
      </div>

      {/* Min and Max bounds */}
      <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant px-0.5">
        <span>Min: {formatDisplay(min)}</span>
        <span>Max: {formatDisplay(max)}</span>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-[11px] font-semibold text-error flex items-center gap-1 mt-1">
          <Icon name="alert-circle" size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
