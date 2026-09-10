'use client';

import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';
import { OCCUPATION_CATEGORIES } from '@/components/SchemeWizard';

interface OccupationStepProps {
  onContinue: () => void;
  onPrevious: () => void;
}

export default function OccupationStep({
  onContinue,
  onPrevious,
}: OccupationStepProps) {
  const { watch, setValue, trigger } = useFormContext<CitizenProfileFormValues>();

  const selectedCategory = watch('occupationCategory');
  const selectedType = watch('occupationType');
  const customOccupation = watch('customOccupation');

  const [searchQuery, setSearchQuery] = useState('');

  // Filtered categories based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return OCCUPATION_CATEGORIES;

    return OCCUPATION_CATEGORIES.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchKeywords = cat.keywords.some((k) => k.toLowerCase().includes(q));
      const matchSub = cat.subCategories.some((sub) => sub.name.toLowerCase().includes(q));
      return matchName || matchKeywords || matchSub;
    });
  }, [searchQuery]);

  // Current active category
  const activeCategory = useMemo(() => {
    return (
      OCCUPATION_CATEGORIES.find((c) => c.id === selectedCategory) ||
      OCCUPATION_CATEGORIES[0]
    );
  }, [selectedCategory]);

  const activeSubCategoryName = useMemo(() => {
    if (!activeCategory) return '';
    const sub = activeCategory.subCategories.find((s) => s.id === selectedType);
    return sub ? sub.name : '';
  }, [activeCategory, selectedType]);

  const isCustomRequired = useMemo(() => {
    return (
      selectedCategory === 'other_livelihood' ||
      (selectedType && selectedType.startsWith('other_'))
    );
  }, [selectedCategory, selectedType]);

  const isValid = useMemo(() => {
    if (!selectedCategory || !selectedType) return false;
    if (isCustomRequired) {
      return Boolean(customOccupation && customOccupation.trim().length > 0);
    }
    return true;
  }, [selectedCategory, selectedType, isCustomRequired, customOccupation]);

  const handleNext = async () => {
    const valid = await trigger(['occupationCategory', 'occupationType']);
    if (valid && isValid) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
          Select your occupation or livelihood
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
          Choose the option that best describes your current work, business or trade:
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-civic space-y-5">
        
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <Icon name="search" className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="wizard-occupation-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occupation (e.g. tailor, milk, electric, mobile repair, artisan)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Selection Banner */}
        {selectedCategory && selectedType && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-primary/10 border border-primary/25 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Icon name="check_circle" className="w-4 h-4 text-primary shrink-0" />
              <span className="text-on-surface">
                Selected:{' '}
                <strong className="text-primary font-bold">
                  {activeCategory?.name}
                </strong>
                {' → '}
                <span className="text-secondary font-semibold">
                  {isCustomRequired && customOccupation ? customOccupation : activeSubCategoryName}
                </span>
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant">
              You can adjust categories below
            </span>
          </div>
        )}

        {/* Categories Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
            <span>Broad Occupation Category ({filteredCategories.length})</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-primary hover:underline"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setValue('occupationCategory', cat.id, { shouldValidate: true });
                    setValue('occupationType', cat.subCategories[0]?.id || '', { shouldValidate: true });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 text-xs ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-outline-variant/60 bg-surface hover:border-primary/50 text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon
                      name={cat.icon}
                      className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-secondary'}`}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  {isSelected && (
                    <Icon name="check" className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Category Selection Panel */}
        {activeCategory && (
          <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-2">
              <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Icon name={activeCategory.icon} className="w-4 h-4 text-secondary" />
                <span>Specific Activity in {activeCategory.name}</span>
              </div>
              <span className="text-[11px] text-on-surface-variant">
                Select your exact trade
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeCategory.subCategories.map((sub) => {
                const isSubSelected = selectedType === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setValue('occupationType', sub.id, { shouldValidate: true });
                    }}
                    className={`px-3 py-2 rounded-lg border text-left transition-all text-xs flex items-center justify-between gap-2 ${
                      isSubSelected
                        ? 'border-primary bg-primary text-white font-bold shadow-xs'
                        : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-primary/40'
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    {isSubSelected && (
                      <Icon name="check" className="w-3.5 h-3.5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Input for "Other" */}
            {isCustomRequired && (
              <div className="mt-3 pt-3 border-t border-outline-variant/30 space-y-1.5">
                <label
                  htmlFor="input-custom-occupation"
                  className="block text-xs font-bold text-primary"
                >
                  Please describe your occupation / livelihood:
                </label>
                <input
                  id="input-custom-occupation"
                  type="text"
                  value={customOccupation || ''}
                  onChange={(e) => setValue('customOccupation', e.target.value)}
                  placeholder="e.g. Traditional clay artisan, Mobile cobbler, Bamboo basket maker..."
                  className="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>
            )}
          </div>
        )}

      </div>

      {/* Navigation buttons */}
      <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 border border-outline-variant rounded-xl text-xs sm:text-sm font-bold text-primary hover:bg-surface-container transition-colors"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleNext}
          className={`px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            isValid
              ? 'bg-primary text-white hover:opacity-95 cursor-pointer shadow-sm active:scale-[0.99]'
              : 'bg-surface-container border border-outline-variant/60 text-on-surface-variant/50 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
