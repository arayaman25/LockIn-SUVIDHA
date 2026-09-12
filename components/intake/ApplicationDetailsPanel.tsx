'use client';

import React from 'react';
import Icon from '@/components/Icon';
import { CitizenProfileFormValues } from '@/src/lib/schemas/scheme-matching';

interface ApplicationDetailsPanelProps {
  profile: Partial<CitizenProfileFormValues>;
  onReview: () => void;
  language?: string;
}

const commonFields = [
  'intent',
  'isScheduledCaste',
  'age',
  'gender',
  'annualFamilyIncome',
  'state',
  'district',
] as const;

const intentFields: Record<string, readonly string[]> = {
  business_loan: ['projectType', 'requiredLoanAmount'],
  education_loan: ['course', 'educationStatus', 'requiredLoanAmount'],
  skill_training: [],
};

const labels: Record<string, string> = {
  intent: 'Purpose',
  isScheduledCaste: 'Category',
  age: 'Age',
  gender: 'Gender',
  annualFamilyIncome: 'Annual family income',
  state: 'State',
  district: 'District',
  projectType: 'Business / trade',
  requiredLoanAmount: 'Loan amount',
  course: 'Course of study',
  educationStatus: 'Education status',
};

const translatedLabels: Record<string, Record<string, string>> = {
  hi: {
    application: 'आपकी जानकारी',
    updates: 'आपके जवाबों के अनुसार जानकारी अपडेट होती है',
    purpose: 'उद्देश्य',
    isScheduledCaste: 'श्रेणी',
    age: 'आयु',
    gender: 'लिंग',
    annualFamilyIncome: 'वार्षिक पारिवारिक आय',
    state: 'राज्य',
    district: 'जिला',
    projectType: 'व्यवसाय / व्यापार',
    requiredLoanAmount: 'ऋण राशि',
    course: 'पाठ्यक्रम',
    educationStatus: 'शिक्षा की स्थिति',
    provided: 'उपलब्ध',
    notProvided: 'उपलब्ध नहीं',
    allCollected: 'सभी आवश्यक जानकारी एकत्रित है',
    inProgress: 'जानकारी पूरी की जा रही है',
    completed: 'जानकारी पूरी',
    review: 'जानकारी की समीक्षा करें',
  },
};

const isProvided = (value: unknown) => value !== undefined && value !== null && value !== '';

const formatValue = (field: string, value: unknown): string => {
  if (!isProvided(value)) return 'Not provided';
  if (field === 'annualFamilyIncome' || field === 'requiredLoanAmount') {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }
  if (field === 'isScheduledCaste') return value ? 'Scheduled Caste (SC)' : 'Other category';
  if (field === 'intent') {
    return value === 'education_loan'
      ? 'Education loan'
      : value === 'skill_training'
        ? 'Skill training'
        : 'Business / enterprise loan';
  }
  return String(value).replaceAll('_', ' ');
};

export default function ApplicationDetailsPanel({ profile, onReview, language = 'en' }: ApplicationDetailsPanelProps) {
  const languageLabels = translatedLabels[language] || {};
  const labelFor = (field: string) => languageLabels[field] || labels[field] || field;
  const text = (key: string, fallback: string) => languageLabels[key] || fallback;
  const fields = [...commonFields, ...(intentFields[profile.intent || ''] || [])];
  const completed = fields.filter((field) => isProvided(profile[field as keyof typeof profile])).length;

  return (
    <aside className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="border-b border-stone-200 px-5 py-3.5">
        <h2 className="text-base font-serif font-bold text-stone-900">{text('application', 'Your Application')}</h2>
        <p className="mt-1 text-xs text-stone-500">{text('updates', 'Updates automatically as you answer')}</p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold leading-4 text-[#00472f]">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            <Icon name={completed === fields.length ? 'check_circle' : 'pending'} size={16} />
          </span>
          <span>{completed === fields.length ? text('allCollected', 'All required details collected') : text('inProgress', 'Details in progress')}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-500">
          <span>{completed} of {fields.length} {text('completed', 'details completed')}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full bg-[#276448] transition-[width] duration-500"
              style={{ width: `${fields.length ? (completed / fields.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-1">
        {fields.map((field) => {
          const value = profile[field as keyof typeof profile];
          const provided = isProvided(value);
          return (
            <div key={field} className={`border-b border-stone-100 py-2.5 transition-colors ${provided ? 'animate-in fade-in duration-300' : ''}`}>
              <div className="flex items-center justify-between gap-3 leading-4">
                <span className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-stone-400">{labelFor(field)}</span>
                <span className="inline-flex min-w-[76px] shrink-0 items-center justify-end gap-1 text-[10px] font-medium text-stone-400">
                  {provided ? <Icon name="check" size={13} className="text-[#276448]" /> : <Icon name="remove" size={13} className="text-stone-300" />}
                  <span>{provided ? text('provided', 'Provided') : text('notProvided', 'Not provided')}</span>
                </span>
              </div>
              <div className={`mt-0.5 text-sm font-semibold leading-5 ${provided ? 'text-stone-800' : 'text-stone-400'}`}>
                {formatValue(field, value)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-stone-200 p-4">
        <button
          type="button"
          onClick={onReview}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#00472f] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#003824]"
        >
          <Icon name="edit_document" size={15} />
          <span>{text('review', 'Review Details')}</span>
          <Icon name="arrow_forward" size={14} />
        </button>
      </div>
    </aside>
  );
}