'use client';

import React from 'react';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface IntakeProfileReviewProps {
  profile: Partial<CitizenProfileFormValues>;
  onFindSchemes: () => void;
  onEditInForm: () => void;
  isLoading?: boolean;
}

export default function IntakeProfileReview({
  profile,
  onFindSchemes,
  onEditInForm,
  isLoading = false,
}: IntakeProfileReviewProps) {
  const formatINR = (val?: number) => {
    if (val === undefined || isNaN(val)) return 'Not specified (उल्लेख नहीं)';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const intentLabel =
    profile.intent === 'education_loan'
      ? 'Education Loan (शिक्षा ऋण)'
      : profile.intent === 'skill_training'
      ? 'Skill Development Training (कौशल प्रशिक्षण)'
      : 'Business / Enterprise Loan (व्यवसाय ऋण)';

  const enterpriseOrCourse =
    profile.projectType ||
    profile.customOccupation ||
    profile.occupationType ||
    profile.course ||
    'Small Business Enterprise (लघु व्यवसाय)';

  return (
    <div className="bg-white border-2 border-[#00472f]/30 rounded-2xl p-5 sm:p-6 shadow-md my-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00472f] flex items-center justify-center">
            <Icon name="check_circle" size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
              We have collected your details
            </h3>
            <p className="text-xs text-stone-500">
              (हमने आपका विवरण संकलित कर लिया है - कृपया समीक्षा करें)
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-[#00472f] border border-emerald-200 rounded-full">
          Ready for Scheme Matching
        </span>
      </div>

      {/* Grid of collected fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">Purpose (उद्देश्य)</span>
          <span className="font-semibold text-stone-900">{intentLabel}</span>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">
            {profile.intent === 'education_loan' ? 'Course of Study (पाठ्यक्रम)' : 'Business / Trade (व्यवसाय/कार्य)'}
          </span>
          <span className="font-semibold text-stone-900">{enterpriseOrCourse}</span>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">Loan Amount (ऋण राशि)</span>
          <span className="font-semibold text-stone-900 font-mono">
            {formatINR(profile.requiredLoanAmount || profile.estimatedProjectCost)}
          </span>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">Annual Family Income (वार्षिक पारिवारिक आय)</span>
          <span className="font-semibold text-stone-900 font-mono">
            {formatINR(profile.annualFamilyIncome)}
          </span>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">Age & Gender (आयु एवं लिंग)</span>
          <span className="font-semibold text-stone-900">
            {profile.age ? `${profile.age} years` : 'Not specified'},{' '}
            {profile.gender === 'female' ? 'Female (महिला)' : profile.gender === 'male' ? 'Male (पुरुष)' : 'Not specified'}
          </span>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
          <span className="text-stone-500 block text-[11px]">Category & Domicile (वर्ग एवं स्थान)</span>
          <span className="font-semibold text-stone-900">
            {profile.isScheduledCaste !== false ? 'Scheduled Caste (SC)' : 'General / Other'},{' '}
            {profile.state || 'Not specified'}{profile.district ? ` (${profile.district})` : ''}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          type="button"
          onClick={onEditInForm}
          className="px-4 py-2.5 rounded-xl border border-stone-300 hover:border-[#00472f] text-stone-700 hover:text-[#00472f] text-xs sm:text-sm font-semibold bg-white transition-colors flex items-center justify-center gap-1.5"
        >
          <Icon name="edit_document" size={16} />
          <span>Review / Edit Details (विवरण संपादित करें)</span>
        </button>

        <button
          type="button"
          onClick={onFindSchemes}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-[#00472f] hover:bg-[#003824] text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Matching Schemes... (योजनाएं खोज रहे हैं...)</span>
            </>
          ) : (
            <>
              <Icon name="search" size={16} />
              <span>Find Suitable Schemes (उपयुक्त योजनाएं खोजें)</span>
              <Icon name="arrow_forward" size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
