export interface Scheme {
  id: string;
  name: string;
  category: 'business' | 'education' | 'agriculture' | 'artisans';
  categoryLabel: string;
  ministry: string;
  maxAmount: number;
  subvention: number;
  moratorium: number;
  desc: string;
  tags: string[];
  interest: string;
  eligibility: {
    types: string[];
    minAge: number;
    maxIncome: number;
    criteria: string[];
  };
  requiredDocs: string[];
  features: string[];
}

export interface Partner {
  id: string;
  name: string;
  district: string;
  state: string;
  type: 'PSU Bank' | 'Rural Gramin Bank' | 'CSC Center';
  distance: string;
  address: string;
  status: string;
  officer: string;
  phone: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
  latitude: number;
  longitude: number;
  supportedSchemes: string[];
}

export interface CitizenApplication {
  arn: string;
  schemeId: string;
  scheme: string;
  applicant: string;
  phone: string;
  aadhaarMasked: string;
  amount: string;
  date: string;
  status: 'Submitted' | 'Under Verification' | 'Bank Review' | 'Sanctioned' | 'Disbursed' | 'Action Needed';
  stage: 1 | 2 | 3 | 4;
  bank: string;
  remarks: string;
  timeline: {
    title: string;
    description: string;
    completed: boolean;
    date: string;
  }[];
}

export const SUVIDHA_SCHEMES: Scheme[] = [
  {
    id: 'pmsvanidhi',
    name: 'PM SVANidhi (Street Vendor Loan)',
    category: 'business',
    categoryLabel: 'Urban Livelihoods',
    ministry: 'Ministry of Housing and Urban Affairs',
    maxAmount: 50000,
    subvention: 7,
    moratorium: 0,
    desc: 'Collateral-free working capital loan for urban micro-enterprises and vendors with prompt repayment incentives and cashbacks on digital transactions.',
    tags: ['Urban', 'Micro-loan', 'Fast Track', 'Zero Collateral'],
    interest: '7% Interest Subvention',
    eligibility: {
      types: ['vendor', 'micro'],
      minAge: 18,
      maxIncome: 300000,
      criteria: [
        'Urban street vendor vending on or before March 24, 2020 or having Certificate of Vending.',
        'Letter of Recommendation (LoR) issued by Urban Local Body (ULB) / Town Vending Committee.',
        'Active bank account linked with mobile number and Aadhaar.',
        'Zero delinquency or default history on central credit databases.'
      ]
    },
    requiredDocs: [
      'Aadhaar Card (Front & Back)',
      'Vending Identity Card or Certificate of Vending from ULB',
      'Bank Account Passbook / Cancelled Cheque',
      'Recent Passport-sized Photograph'
    ],
    features: [
      'Initial tranche of ₹10,000; scalable up to ₹20,000 and ₹50,000 on timely repayments',
      '7% per annum interest subvention credited directly through DBT',
      'Monthly cashback up to ₹100 on qualifying digital transactions'
    ]
  },
  {
    id: 'csis',
    name: 'Central Sector Interest Subsidy (CSIS)',
    category: 'education',
    categoryLabel: 'Higher Education',
    ministry: 'Ministry of Education',
    maxAmount: 1000000,
    subvention: 100,
    moratorium: 12,
    desc: 'Full interest subvention during the moratorium period (course duration + 1 year) on education loans for technical and professional higher education courses in India.',
    tags: ['Students', 'Higher Ed', '100% Subsidy', 'Merit & Need'],
    interest: '100% Moratorium Subsidy',
    eligibility: {
      types: ['student'],
      minAge: 17,
      maxIncome: 450000,
      criteria: [
        'Students belonging to economically weaker sections with parental income up to ₹4.50 Lakh p.a.',
        'Admitted to approved professional or technical degree/diploma courses in NAAC/NBA accredited institutions.',
        'Loan availed under the IBA Model Educational Loan Scheme through scheduled banks.',
        'Full interest waiver during course period plus 1 year gestation.'
      ]
    },
    requiredDocs: [
      'Bonafide Student Admission Letter / Fee Schedule',
      'Income Certificate issued by designated State Revenue Authority (Tehsildar / SDO)',
      'Aadhaar Card of student and co-borrowing parent',
      'Bank Loan Sanction Letter from Scheduled Commercial Bank'
    ],
    features: [
      'Government of India pays 100% of the loan interest during course tenure + 12 months',
      'No collateral requirement up to ₹7.5 Lakh under CGFSEL credit guarantee',
      'Available for engineering, medical, law, management, and accredited degree courses'
    ]
  },
  {
    id: 'standup',
    name: 'Stand-Up India Scheme',
    category: 'business',
    categoryLabel: 'Enterprise Support',
    ministry: 'Ministry of Finance',
    maxAmount: 10000000,
    subvention: 3,
    moratorium: 18,
    desc: 'Facilitates composite bank credit between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    tags: ['SC/ST', 'Women Entrepreneurs', 'Greenfield', 'High Capital'],
    interest: 'Base Concessional Rate',
    eligibility: {
      types: ['women', 'sc_st', 'artisan'],
      minAge: 18,
      maxIncome: 2500000,
      criteria: [
        'SC/ST and/or woman entrepreneur above 18 years of age.',
        'Loans only for greenfield (first-time venture) manufacturing, services, or trading sector.',
        'In non-individual enterprises, at least 51% shareholding & controlling stake held by SC/ST or woman.',
        'Borrower should not be in default to any bank or financial institution.'
      ]
    },
    requiredDocs: [
      'Proof of Identity & Address (Aadhaar, Voter ID, Passport)',
      'Caste Certificate (for SC/ST applicants)',
      'Detailed Project Report (DPR) with financial feasibility projection',
      'MSME Udyam Registration & Pollution Clearance (if manufacturing)'
    ],
    features: [
      'Composite loan covering term loan and working capital',
      'Margin money requirement reduced to up to 15%',
      'Handholding support through SIDBI and Lead District Managers'
    ]
  },
  {
    id: 'mudra-kishore',
    name: 'Pradhan Mantri MUDRA Yojana (Kishore)',
    category: 'business',
    categoryLabel: 'Micro-Enterprise',
    ministry: 'Ministry of Finance',
    maxAmount: 500000,
    subvention: 2,
    moratorium: 6,
    desc: 'Mid-tier concessional finance for established micro-enterprises and shopkeepers to procure machinery, expand inventory, and modernize work premises.',
    tags: ['Enterprise', 'Expansion', 'No Collateral', 'Working Capital'],
    interest: '8.5% Base Concessional',
    eligibility: {
      types: ['micro', 'artisan', 'vendor'],
      minAge: 18,
      maxIncome: 800000,
      criteria: [
        'Existing micro-unit looking for capital injection to expand capacity.',
        'Engaged in manufacturing, trading, service sector, or allied agriculture.',
        'No collateral security required under NCGTC Credit Guarantee for Micro Units.',
        'Clean CIBIL score with demonstrated cashflow receipts.'
      ]
    },
    requiredDocs: [
      'Business Registration / Trade License / GSTIN (if applicable)',
      'Bank Statement for the last 6 months',
      'Machinery Quotation / Inventory Proforma Invoice',
      'Proof of Enterprise Category / MSME Udyam certificate'
    ],
    features: [
      'Loan assistance from ₹50,001 up to ₹5,00,000 without third-party guarantee',
      'Mudra Card issued for hassle-free working capital drawdowns',
      'Subsidized processing fees across Public Sector and Regional Rural Banks'
    ]
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    category: 'artisans',
    categoryLabel: 'Traditional Artisans',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    maxAmount: 300000,
    subvention: 8,
    moratorium: 6,
    desc: 'Holistic end-to-end support for traditional craftspeople and artisans spanning recognition, skill upgradation, toolkit incentive of ₹15,000, and concessional loans at 5%.',
    tags: ['Artisans', 'Weavers', '5% Interest', 'Toolkit Support'],
    interest: '5% Fixed Concessional Interest',
    eligibility: {
      types: ['artisan', 'vendor'],
      minAge: 18,
      maxIncome: 600000,
      criteria: [
        'Artisan or craftsperson working with hands and tools in one of 18 traditional family trades.',
        'Trades include Carpenters, Blacksmiths, Goldsmiths, Potters, Sculptors, Cobblers, Tailors, Weavers.',
        'Only one member per family eligible for credit support.',
        'Beneficiary has completed Basic Skill Training verification.'
      ]
    },
    requiredDocs: [
      'Aadhaar Number and biometric thumbprint verification',
      'Trade Skill Self-Declaration / Gram Panchayat endorsement',
      'Aadhaar-linked Bank Account details',
      'Ration Card / Family Member declaration'
    ],
    features: [
      'First tranche of ₹1 Lakh (18-month tenure) followed by second tranche of ₹2 Lakh (30-month tenure)',
      'Fixed 5% interest rate with 8% subvention paid by MoMSME',
      'Free modern toolkit grant of ₹15,000 e-voucher upon skill assessment'
    ]
  },
  {
    id: 'nabard-dairying',
    name: 'Dairy & Agri Allied Credit Scheme',
    category: 'agriculture',
    categoryLabel: 'Agriculture & Allied',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    maxAmount: 700000,
    subvention: 3,
    moratorium: 12,
    desc: 'Concessional credit backed by back-ended capital subsidies for small farmers and rural youth establishing small dairy units and vermicompost processing.',
    tags: ['Agriculture', 'Dairy', 'Capital Subsidy', 'Rural Youth'],
    interest: '7.5% Concessional Rate',
    eligibility: {
      types: ['farmer', 'rural'],
      minAge: 18,
      maxIncome: 500000,
      criteria: [
        'Farmers, individual rural entrepreneurs, NGOs, and Self Help Groups (SHGs).',
        'Land possession or lease agreement for animal shed and fodder cultivation.',
        'Preference for dairy cooperative society members.',
        'Back-ended capital subsidy of 25% (33.33% for SC/ST beneficiaries).'
      ]
    },
    requiredDocs: [
      'Kisan Credit Card (KCC) or Land Record (Khatauni/Khasra)',
      'Veterinary Doctor Animal Purchase Valuation Certificate',
      'Bank Account details with Regional Rural Bank or Cooperative Bank',
      'Aadhaar and Rural Domicile Certificate'
    ],
    features: [
      'Capital subsidy credited to borrower reserve account by NABARD',
      '12-month gestation moratorium for livestock acclimatization',
      'Integrated veterinary insurance coverage support'
    ]
  }
];

export const SUVIDHA_PARTNERS: Partner[] = [
  {
    id: 'sbi-civil-lines',
    name: 'State Bank of India - Civil Lines Branch',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'PSU Bank',
    distance: '1.2 km',
    address: 'Kachahari Road, Civil Lines, Varanasi, UP 221002',
    status: 'Active Dedicated Desk',
    officer: 'Rajesh Kumar (Lead District Nodal Officer)',
    phone: '0542-250123',
    pincode: '221002',
    coordinates: { lat: 25.334, lng: 82.998 },
    latitude: 25.334,
    longitude: 82.998,
    supportedSchemes: ['PM SVANidhi', 'PM MUDRA (Kishore)', 'Stand-Up India', 'CSIS Higher Education'],
  },
  {
    id: 'baroda-up-cholapur',
    name: 'Baroda UP Gramin Bank - Cholapur',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'Rural Gramin Bank',
    distance: '4.8 km',
    address: 'Main Market Road, Cholapur Block, Varanasi, UP 221101',
    status: 'Active Dedicated Desk',
    officer: 'Anita Verma (Branch Manager)',
    phone: '0542-261445',
    pincode: '221101',
    coordinates: { lat: 25.421, lng: 83.051 },
    latitude: 25.421,
    longitude: 83.051,
    supportedSchemes: ['PM Vishwakarma', 'Dairy & Agri Allied Credit', 'PM MUDRA (Kishore)'],
  },
  {
    id: 'csc-kabir-chaura',
    name: 'Common Service Center (CSC) - Kabir Chaura',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'CSC Center',
    distance: '2.1 km',
    address: 'Shop 14, Near Kabir Math Complex, Kabir Chaura, Varanasi, UP 221001',
    status: 'Digital Verification Node',
    officer: 'Vikram Patel (CSC Village Level Entrepreneur)',
    phone: '9876543210',
    pincode: '221001',
    coordinates: { lat: 25.318, lng: 83.006 },
    latitude: 25.318,
    longitude: 83.006,
    supportedSchemes: ['PM SVANidhi', 'PM Vishwakarma Toolkit & Loan', 'Aadhaar e-KYC'],
  },
  {
    id: 'pnb-sigra',
    name: 'Punjab National Bank - Sigra Branch',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'PSU Bank',
    distance: '3.5 km',
    address: 'Sigra Cross Road, Opp. Nagar Nigam, Varanasi, UP 221010',
    status: 'Active Dedicated Desk',
    officer: 'Manish Gupta (Credit Senior Manager)',
    phone: '0542-222890',
    pincode: '221010',
    coordinates: { lat: 25.312, lng: 82.986 },
    latitude: 25.312,
    longitude: 82.986,
    supportedSchemes: ['PM MUDRA (Kishore)', 'CSIS Higher Education', 'Stand-Up India'],
  },
  {
    id: 'bob-godowlia',
    name: 'Bank of Baroda - Godowlia Crossing',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'PSU Bank',
    distance: '2.8 km',
    address: 'Near Dashashwamedh Link, Godowlia, Varanasi, UP 221001',
    status: 'Active Dedicated Desk',
    officer: 'Sunil Trivedi (Nodal Desk)',
    phone: '0542-245671',
    pincode: '221001',
    coordinates: { lat: 25.308, lng: 83.007 },
    latitude: 25.308,
    longitude: 83.007,
    supportedSchemes: ['PM SVANidhi', 'PM MUDRA (Kishore)', 'PM Vishwakarma'],
  },
  {
    id: 'csc-sarnath',
    name: 'CSC Citizen Suvidha Kendra - Sarnath',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'CSC Center',
    distance: '6.2 km',
    address: 'Museum Road, Sarnath, Varanasi, UP 221007',
    status: 'Digital Verification Node',
    officer: 'Meera Sharma (CSC Operator)',
    phone: '9451002233',
    pincode: '221007',
    coordinates: { lat: 25.378, lng: 83.024 },
    latitude: 25.378,
    longitude: 83.024,
    supportedSchemes: ['PM Vishwakarma', 'PM SVANidhi', 'Aadhaar e-KYC'],
  },
  // Pune Centers
  {
    id: 'bom-shivajinagar',
    name: 'Bank of Maharashtra - Lokmangal Nodal Hub',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'PSU Bank',
    distance: '1.5 km',
    address: '1501 Lokmangal, Shivaji Nagar, Pune, MH 411005',
    status: 'Active Dedicated Desk',
    officer: 'Pradeep Deshmukh (Lead District Manager)',
    phone: '020-25532731',
    pincode: '411005',
    coordinates: { lat: 18.531, lng: 73.844 },
    latitude: 18.531,
    longitude: 73.844,
    supportedSchemes: ['PM MUDRA (Kishore)', 'Stand-Up India', 'PM SVANidhi'],
  },
  {
    id: 'sbi-pune-camp',
    name: 'State Bank of India - Pune Main Branch',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'PSU Bank',
    distance: '2.9 km',
    address: 'Solapur Road, Pune Camp, Pune, MH 411001',
    status: 'Active Dedicated Desk',
    officer: 'Kavita Joshi (Senior Credit Manager)',
    phone: '020-26123456',
    pincode: '411001',
    coordinates: { lat: 18.517, lng: 73.878 },
    latitude: 18.517,
    longitude: 73.878,
    supportedSchemes: ['CSIS Higher Education', 'Stand-Up India', 'PM MUDRA (Kishore)'],
  },
  {
    id: 'csc-kothrud',
    name: 'Common Service Center - Kothrud Suvidha Kendra',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'CSC Center',
    distance: '4.2 km',
    address: 'Near Gandhi Bhavan, Kothrud, Pune, MH 411038',
    status: 'Digital Verification Node',
    officer: 'Sachin Kulkarni (CSC VLE)',
    phone: '9822012345',
    pincode: '411038',
    coordinates: { lat: 18.507, lng: 73.808 },
    latitude: 18.507,
    longitude: 73.808,
    supportedSchemes: ['PM Vishwakarma', 'PM SVANidhi', 'Aadhaar e-KYC'],
  },
  // Mumbai Centers
  {
    id: 'sbi-fort',
    name: 'State Bank of India - Mumbai Main Desk',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'PSU Bank',
    distance: '1.1 km',
    address: 'Mumbai Samachar Marg, Horniman Circle, Fort, Mumbai, MH 400001',
    status: 'Active Dedicated Desk',
    officer: 'Alok Singhania (Lead Nodal Officer)',
    phone: '022-22661234',
    pincode: '400001',
    coordinates: { lat: 18.932, lng: 72.836 },
    latitude: 18.932,
    longitude: 72.836,
    supportedSchemes: ['Stand-Up India', 'PM MUDRA (Kishore)', 'CSIS Higher Education'],
  },
  {
    id: 'union-bkc',
    name: 'Union Bank of India - Nodal MSME Center',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'PSU Bank',
    distance: '5.8 km',
    address: 'G Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, MH 400051',
    status: 'Active Dedicated Desk',
    officer: 'Sunita Rao (Zonal Credit Head)',
    phone: '022-26598800',
    pincode: '400051',
    coordinates: { lat: 19.066, lng: 72.868 },
    latitude: 19.066,
    longitude: 72.868,
    supportedSchemes: ['PM MUDRA (Kishore)', 'PM SVANidhi', 'Stand-Up India'],
  },
  {
    id: 'csc-dadar',
    name: 'CSC Citizen Suvidha Kendra - Dadar West',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'CSC Center',
    distance: '3.4 km',
    address: 'Ranade Road, Near Railway Station, Dadar West, Mumbai, MH 400028',
    status: 'Digital Verification Node',
    officer: 'Nilesh Patil (CSC Operator)',
    phone: '9820098765',
    pincode: '400028',
    coordinates: { lat: 19.018, lng: 72.843 },
    latitude: 19.018,
    longitude: 72.843,
    supportedSchemes: ['PM Vishwakarma', 'PM SVANidhi', 'Aadhaar e-KYC'],
  },
];

export const INITIAL_APPLICATIONS: CitizenApplication[] = [
  {
    arn: 'ARN-2025-UP-8841',
    schemeId: 'pmsvanidhi',
    scheme: 'PM SVANidhi (Street Vendor Loan)',
    applicant: 'Sunita Devi',
    phone: '9876543210',
    aadhaarMasked: 'XXXX-XXXX-4812',
    amount: '₹50,000',
    date: '12 Feb 2025',
    status: 'Sanctioned',
    stage: 4,
    bank: 'State Bank of India - Civil Lines, Varanasi',
    remarks: 'Direct benefit interest subvention active. Disbursed to Jan Dhan Account.',
    timeline: [
      { title: 'Application Submitted Online', description: 'Citizen digital receipt registered with nodal portal.', completed: true, date: '12 Feb 2025' },
      { title: 'Automated Eligibility & KYC Check', description: 'Aadhaar e-KYC and Town Vending Committee verification matched.', completed: true, date: '13 Feb 2025' },
      { title: 'Bank Branch Credit Officer Review', description: 'Desk evaluation completed by SBI Civil Lines.', completed: true, date: '15 Feb 2025' },
      { title: 'Concessional Sanction & DBT Disbursal', description: 'Loan sanctioned and credit guarantee invoked. ₹50,000 transferred.', completed: true, date: '18 Feb 2025' }
    ]
  },
  {
    arn: 'ARN-2025-UP-9102',
    schemeId: 'pm-vishwakarma',
    scheme: 'PM Vishwakarma Scheme',
    applicant: 'Ramesh Patel',
    phone: '9811223344',
    aadhaarMasked: 'XXXX-XXXX-7109',
    amount: '₹1,00,000',
    date: '02 Mar 2025',
    status: 'Under Verification',
    stage: 2,
    bank: 'Baroda UP Gramin Bank - Cholapur',
    remarks: 'Artisan skill certification verified. Awaiting Lead District Manager concurrence.',
    timeline: [
      { title: 'Application Submitted Online', description: 'Biometric registration validated at local CSC center.', completed: true, date: '02 Mar 2025' },
      { title: 'Automated Eligibility & KYC Check', description: 'Gram Panchayat craftsperson verification completed.', completed: true, date: '04 Mar 2025' },
      { title: 'Bank Branch Credit Officer Review', description: 'Scheduled for Baroda UP Gramin Bank evaluation.', completed: false, date: 'Pending' },
      { title: 'Concessional Sanction & DBT Disbursal', description: 'Subject to 5% fixed subvention certificate.', completed: false, date: 'Pending' }
    ]
  }
];

export const FAQS = [
  {
    q: 'Is there any processing or application fee for SUVIDHA portal schemes?',
    a: 'Zero fees. All application procedures, eligibility checks, and interest subvention enrollments through the SUVIDHA portal are 100% free of cost. Government of India has not authorized any middleman or commission agent.'
  },
  {
    q: 'What is an "Interest Subvention" and how does it benefit me?',
    a: 'Interest subvention is a financial relief where the central government directly pays a substantial portion (or the entirety) of the interest charged by the bank on your behalf, drastically reducing your monthly EMI installments.'
  },
  {
    q: 'Can I apply if I do not have a registered commercial business premises?',
    a: 'Yes! Schemes like PM SVANidhi and PM Mudra are tailored specifically for street vendors, mobile carts, cottage artisans, and home-based workshops without requiring formal commercial mortgage deeds.'
  },
  {
    q: 'What should I do if a bank official or private agent asks for commission?',
    a: 'Immediately report the incident to the National Anti-Corruption Helpline or dial the SUVIDHA National Grievance Toll-Free Number 1800-111-7788 or file a complaint on CPGRAMS.'
  },
  {
    q: 'How do I receive the money once approved?',
    a: 'All sanctioned funds and subsequent interest subvention subsidies are credited strictly via Direct Benefit Transfer (DBT) directly into your Aadhaar-seeded Jan Dhan or regular savings bank account.'
  }
];
