import { SchemeFinancialTerms } from './calculator.types';

export const NSFDC_SCHEMES: SchemeFinancialTerms[] = [
  {
    code: 'MCF',
    name: 'Micro Finance Scheme (MFS)',
    nameHindi: 'माइक्रो फाइनेंस योजना',
    category: 'Micro Finance / Self-Employment',
    description:
      'Provides quick small-scale financial assistance through State Channelising Agencies (SCAs) to promote tiny self-employment activities for target group beneficiaries.',
    purpose: 'Small shops, artisanal micro-production, petty trades, and working capital',
    projectCostMin: 10000,
    projectCostMax: 150000,
    minLoanAmount: 10000,
    maxLoanAmount: 140000,
    maxProjectCostCoveragePercent: 95,
    moratoriumMonthsMin: 0,
    moratoriumMonthsMax: 3,
    repaymentTenureMonthsMax: 36,
    repaymentFrequency: 'quarterly',
    defaultBeneficiaryRatePercent: 6.5,
    sourceUrl: 'https://nsfdc.nic.in/en/micro-credit-scheme',
    lastVerifiedAt: '2025-01-15',
    hasChannelDependentRates: false,
    requiresEducationLocation: false,
    channelSlabs: [
      {
        channel: 'sca',
        channelName: 'State Channelising Agency (SCA)',
        ratePercent: 6.5,
        description: 'Concessional interest rate for SC beneficiaries via designated State Agencies.',
      },
    ],
    specialNotes:
      'Quarterly repayment schedule. Repayment is collected in quarterly installments through designated State Channelising Agencies.',
  },
  {
    code: 'TL',
    name: 'Term Loan Scheme',
    nameHindi: 'सावधि ऋण योजना',
    category: 'Enterprise & Medium Business',
    description:
      'Term loan assistance for viable income-generating ventures in industrial, service, agricultural, and transport sectors for individual SC entrepreneurs.',
    purpose: 'Machinery acquisition, commercial vehicle, enterprise establishment, workshop setup',
    projectCostMin: 50000,
    projectCostMax: 5000000,
    minLoanAmount: 50000,
    maxLoanAmount: 5000000,
    maxProjectCostCoveragePercent: 90,
    moratoriumMonthsMin: 6,
    moratoriumMonthsMax: 12,
    repaymentTenureMonthsMax: 120,
    repaymentFrequency: 'quarterly',
    defaultBeneficiaryRatePercent: 8.0,
    sourceUrl: 'https://nsfdc.nic.in/en/term-loan',
    lastVerifiedAt: '2025-01-15',
    hasChannelDependentRates: false,
    requiresEducationLocation: false,
    channelSlabs: [
      {
        channel: 'sca',
        channelName: 'State Channelising Agency (SCA)',
        ratePercent: 8.0,
        description: 'Fixed term credit at 8% per annum through SCAs.',
      },
    ],
    specialNotes:
      'Repayment is scheduled on a quarterly basis with up to 12 months moratorium during project setup and gestation.',
  },
  {
    code: 'ELS',
    name: 'Educational Loan Scheme',
    nameHindi: 'शिक्षा ऋण योजना',
    category: 'Higher & Professional Education',
    description:
      'Concessional education loans to support eligible Scheduled Caste students pursuing professional and technical courses in India or abroad.',
    purpose: 'Admission & tuition fees, books, laboratory equipment, hostel fees, and air travel',
    minLoanAmount: 50000,
    maxLoanAmount: 4000000,
    maxProjectCostCoveragePercent: 90,
    moratoriumMonthsMin: 6,
    moratoriumMonthsMax: 12,
    repaymentTenureMonthsMax: 120,
    repaymentFrequency: 'monthly',
    defaultBeneficiaryRatePercent: 6.5,
    sourceUrl: 'https://nsfdc.nic.in/en/educational-loan-scheme',
    lastVerifiedAt: '2025-01-15',
    hasChannelDependentRates: false,
    requiresEducationLocation: true,
    locationSpecificLimits: {
      india: {
        maxLoanAmount: 3000000,
        label: 'Studies in India (भारत में अध्ययन - Max ₹30 Lakh)',
        description: 'Eligible for recognized universities, colleges, and polytechnics within India.',
      },
      abroad: {
        maxLoanAmount: 4000000,
        label: 'Studies Abroad (विदेश में अध्ययन - Max ₹40 Lakh)',
        description: 'Eligible for accredited universities and educational institutions abroad.',
      },
    },
    channelSlabs: [
      {
        channel: 'sca',
        channelName: 'State Channelising Agency (SCA)',
        ratePercent: 6.5,
        description: 'Interest rate capped at 6.5% p.a. (with additional rebate for women students).',
      },
    ],
    specialNotes:
      'Repayment moratorium: course duration plus 6 months (or getting employment, whichever is earlier). Monthly amortized repayment.',
  },
  {
    code: 'AMY',
    name: 'Aajeevika Micro-Finance Yojana',
    nameHindi: 'आजीविका माइक्रो-फाइनेंस योजना',
    category: 'Micro-Credit via NBFC-MFIs',
    description:
      'Direct livelihood micro-credit delivered in collaboration with non-banking financial company - microfinance institutions (NBFC-MFIs).',
    purpose: 'Street vending, cottage production, tailoring, livestock rearing, local vending',
    projectCostMin: 10000,
    projectCostMax: 100000,
    minLoanAmount: 10000,
    maxLoanAmount: 100000,
    maxProjectCostCoveragePercent: 100,
    moratoriumMonthsMin: 0,
    moratoriumMonthsMax: 1,
    repaymentTenureMonthsMax: 36,
    repaymentFrequency: 'monthly',
    defaultBeneficiaryRatePercent: 15.0,
    sourceUrl: 'https://nsfdc.nic.in/en/aajeevika-microfinance-yojana',
    lastVerifiedAt: '2025-01-15',
    hasChannelDependentRates: false,
    requiresEducationLocation: false,
    channelSlabs: [
      {
        channel: 'nbfc_mfi',
        channelName: 'NBFC - Micro Finance Institution (MFI)',
        ratePercent: 15.0,
        description: 'Channel delivery through verified microfinance institutions.',
      },
    ],
    specialNotes:
      'Repayable in monthly installments over a maximum tenure of 36 months directly to accredited MFI field branches.',
  },
  {
    code: 'UNY',
    name: 'Udyam Nidhi Yojana',
    nameHindi: 'उद्यम निधि योजना',
    category: 'Livelihood & Small Enterprise',
    description:
      'Targeted credit delivery channelizing funds through Cooperative Banks and Small Finance Banks for micro-business operations.',
    purpose: 'Working capital, service center expansion, retail enterprise enhancement',
    projectCostMin: 25000,
    projectCostMax: 400000,
    minLoanAmount: 25000,
    maxLoanAmount: 400000,
    maxProjectCostCoveragePercent: 95,
    moratoriumMonthsMin: 0,
    moratoriumMonthsMax: 3,
    repaymentTenureMonthsMax: 60,
    repaymentFrequency: 'monthly',
    defaultBeneficiaryRatePercent: 13.0,
    sourceUrl: 'https://nsfdc.nic.in/en/udyam-nidhi-yojana',
    lastVerifiedAt: '2025-01-15',
    hasChannelDependentRates: true,
    requiresEducationLocation: false,
    channelSlabs: [
      {
        channel: 'cooperative_bank',
        channelName: 'Cooperative Bank (सहकारी बैंक)',
        ratePercent: 13.0,
        description: '13.0% per annum when financed through State/District Cooperative Banks.',
      },
      {
        channel: 'small_finance_bank',
        channelName: 'Small Finance Bank (लघु वित्त बैंक)',
        ratePercent: 15.0,
        description: '15.0% per annum when financed through partner Small Finance Banks.',
      },
    ],
    specialNotes:
      'Channel-dependent rate: 13% p.a. via Cooperative Banks or 15% p.a. via Small Finance Banks. Repayable in monthly installments up to 5 years.',
  },
];

export const DEFAULT_SCHEME_CODE = 'MCF';

export function getSchemeByCode(code: string): SchemeFinancialTerms {
  const found = NSFDC_SCHEMES.find((s) => s.code === code);
  return found || NSFDC_SCHEMES[0];
}
