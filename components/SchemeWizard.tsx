'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SUVIDHA_SCHEMES, Scheme } from '@/lib/data';
import Icon from '@/components/Icon';

export interface SubCategory {
  id: string;
  name: string;
}

export interface OccupationCategory {
  id: string;
  name: string;
  keywords: string[];
  icon: string;
  subCategories: SubCategory[];
}

export const OCCUPATION_CATEGORIES: OccupationCategory[] = [
  {
    id: 'agriculture_farming',
    name: 'Agriculture & Crop Farming',
    icon: 'agriculture',
    keywords: ['farming', 'kisan', 'kheti', 'crop', 'farmer', 'agriculture', 'horticulture', 'krishi', 'soil', 'harvest'],
    subCategories: [
      { id: 'crop_farmer', name: 'Crop Farmer' },
      { id: 'small_marginal_farmer', name: 'Small / Marginal Farmer' },
      { id: 'agricultural_worker', name: 'Agricultural Worker' },
      { id: 'horticulture', name: 'Horticulture & Floriculture' },
      { id: 'organic_farming', name: 'Organic Farming' },
      { id: 'other_agri', name: 'Other Agricultural Activity' },
    ],
  },
  {
    id: 'dairy_livestock',
    name: 'Dairy & Livestock',
    icon: 'pets',
    keywords: ['dairy', 'milk', 'cow', 'buffalo', 'cattle', 'goat', 'sheep', 'poultry', 'chicken', 'egg', 'livestock', 'doodh', 'pashupalan'],
    subCategories: [
      { id: 'dairy_farming', name: 'Dairy Farming' },
      { id: 'cattle_rearing', name: 'Cattle Rearing' },
      { id: 'goat_rearing', name: 'Goat / Sheep Rearing' },
      { id: 'poultry', name: 'Poultry Farming' },
      { id: 'other_livestock', name: 'Other Livestock Activity' },
    ],
  },
  {
    id: 'fisheries_aquaculture',
    name: 'Fisheries & Aquaculture',
    icon: 'travel_explore',
    keywords: ['fish', 'fisher', 'macchli', 'aquaculture', 'matsya', 'pond', 'marine', 'trawler', 'hatchery'],
    subCategories: [
      { id: 'marine_fisher', name: 'Marine / Coastal Fisher' },
      { id: 'fish_farming', name: 'Inland Fish Farming' },
      { id: 'aquaculture', name: 'Aquaculture & Hatchery' },
      { id: 'fish_vending', name: 'Fish Processing & Vending' },
      { id: 'other_fisheries', name: 'Other Fisheries Activity' },
    ],
  },
  {
    id: 'food_catering',
    name: 'Food & Catering',
    icon: 'storefront',
    keywords: ['food', 'tiffin', 'catering', 'bakery', 'tea', 'stall', 'dhaba', 'restaurant', 'snack', 'canteen', 'sweets', 'chaat'],
    subCategories: [
      { id: 'food_stall', name: 'Food Stall / Dhaba' },
      { id: 'tiffin_service', name: 'Tiffin / Meal Service' },
      { id: 'catering', name: 'Catering Services' },
      { id: 'bakery', name: 'Bakery & Confectionery' },
      { id: 'small_food_processing', name: 'Food Processing Unit' },
      { id: 'other_food', name: 'Other Food Business' },
    ],
  },
  {
    id: 'retail_shops',
    name: 'Retail & Small Shop',
    icon: 'store',
    keywords: ['kirana', 'grocery', 'dukan', 'shop', 'store', 'retail', 'general store', 'stationery', 'footwear', 'clothes'],
    subCategories: [
      { id: 'kirana_grocery', name: 'Kirana / Grocery Store' },
      { id: 'general_store', name: 'General Store / Stationery' },
      { id: 'mobile_accessories', name: 'Mobile & Accessories Shop' },
      { id: 'apparel_footwear', name: 'Clothing & Footwear Retail' },
      { id: 'other_retail', name: 'Other Retail Business' },
    ],
  },
  {
    id: 'street_vendor',
    name: 'Street Vendor / Hawker',
    icon: 'track_changes',
    keywords: ['vendor', 'hawker', 'thela', 'cart', 'stall', 'vegetable', 'sabzi', 'fruit', 'fal', 'street', 'roadside', 'haat', 'feriwala'],
    subCategories: [
      { id: 'vegetable_vendor', name: 'Vegetable Vendor' },
      { id: 'fruit_seller', name: 'Fruit Seller' },
      { id: 'roadside_eatery', name: 'Roadside Cart / Stall' },
      { id: 'mobile_vendor', name: 'Mobile Goods Vendor / Hawker' },
      { id: 'weekly_market_vendor', name: 'Weekly Haat / Market Trader' },
      { id: 'other_vendor', name: 'Other Street Vending' },
    ],
  },
  {
    id: 'handicrafts_artisan',
    name: 'Handicrafts & Artisan Work',
    icon: 'handyman',
    keywords: ['artisan', 'handicraft', 'pottery', 'clay', 'woodwork', 'bamboo', 'blacksmith', 'lohar', 'kumhar', 'sculptor', 'craft'],
    subCategories: [
      { id: 'pottery', name: 'Pottery & Clay Artisan' },
      { id: 'wood_craft', name: 'Woodwork & Carving' },
      { id: 'bamboo_cane', name: 'Bamboo & Cane Craft' },
      { id: 'metal_craft', name: 'Metalwork & Blacksmith' },
      { id: 'traditional_artisan', name: 'Traditional Folk Artisan' },
      { id: 'other_handicrafts', name: 'Other Craft & Artisan Work' },
    ],
  },
  {
    id: 'handloom_textile',
    name: 'Handloom & Textile',
    icon: 'brush',
    keywords: ['weaver', 'handloom', 'bunkar', 'textile', 'chikan', 'zari', 'embroidery', 'fabric', 'loom', 'carpet', 'spinning'],
    subCategories: [
      { id: 'handloom_weaver', name: 'Handloom Weaver' },
      { id: 'powerloom_operator', name: 'Powerloom Operator' },
      { id: 'embroidery_zari', name: 'Embroidery / Zari / Chikan Work' },
      { id: 'block_printing_dyeing', name: 'Block Printing & Fabric Dyeing' },
      { id: 'other_textile', name: 'Other Textile Work' },
    ],
  },
  {
    id: 'tailoring_garments',
    name: 'Tailoring & Garments',
    icon: 'edit_document',
    keywords: ['tailor', 'stitching', 'clothes', 'dress', 'boutique', 'sewing', 'garment', 'silai', 'darzi', 'fashion'],
    subCategories: [
      { id: 'tailor', name: 'Custom Tailor' },
      { id: 'boutique', name: 'Boutique / Dressmaking' },
      { id: 'stitching_unit', name: 'Small Stitching Unit' },
      { id: 'garment_making', name: 'Readymade Garments' },
      { id: 'other_tailoring', name: 'Other Tailoring / Garment Work' },
    ],
  },
  {
    id: 'beauty_personal_care',
    name: 'Beauty & Personal Care',
    icon: 'accessibility_new',
    keywords: ['beauty', 'parlour', 'salon', 'barber', 'hair', 'makeup', 'naai', 'grooming', 'mehendi', 'spa'],
    subCategories: [
      { id: 'beauty_parlour', name: 'Beauty Parlour' },
      { id: 'barber_salon', name: "Barber / Men's Salon" },
      { id: 'hair_styling', name: 'Hair Stylist / Makeup Artist' },
      { id: 'wellness_grooming', name: 'Personal Grooming & Wellness' },
      { id: 'other_beauty', name: 'Other Personal Care Services' },
    ],
  },
  {
    id: 'transport_mobility',
    name: 'Transport & Mobility',
    icon: 'map',
    keywords: ['auto', 'rickshaw', 'e-rickshaw', 'taxi', 'cab', 'driver', 'tempo', 'truck', 'transport', 'goods carrier'],
    subCategories: [
      { id: 'auto_rickshaw', name: 'Auto-Rickshaw Driver / Owner' },
      { id: 'e_rickshaw', name: 'E-Rickshaw Operator' },
      { id: 'taxi_cab', name: 'Taxi / Cab Driver' },
      { id: 'goods_vehicle', name: 'Small Goods Carrier / Pickup' },
      { id: 'other_transport', name: 'Other Transport Operator' },
    ],
  },
  {
    id: 'repair_maintenance',
    name: 'Repair & Maintenance',
    icon: 'handyman',
    keywords: ['mobile repair', 'phone repair', 'electronics', 'tv', 'ac', 'fridge', 'mechanic', 'bike', 'bicycle', 'appliance', 'motorcycle'],
    subCategories: [
      { id: 'mobile_repair', name: 'Mobile & Smartphone Repair' },
      { id: 'electronics_repair', name: 'TV & Electronics Repair' },
      { id: 'appliance_repair', name: 'Home Appliance Repair (AC/Fridge)' },
      { id: 'vehicle_repair', name: 'Two-Wheeler / Auto Mechanic' },
      { id: 'bicycle_repair', name: 'Bicycle Repair' },
      { id: 'other_repair', name: 'Other Repair Services' },
    ],
  },
  {
    id: 'construction_trades',
    name: 'Construction & Skilled Trades',
    icon: 'handyman',
    keywords: ['mason', 'carpenter', 'plumber', 'electrician', 'welder', 'painter', 'construction', 'electric', 'mistri', 'badhai', 'rajmistri'],
    subCategories: [
      { id: 'mason', name: 'Mason (Rajmistri)' },
      { id: 'carpenter', name: 'Carpenter (Badhai)' },
      { id: 'electrician', name: 'Electrician' },
      { id: 'plumber', name: 'Plumber' },
      { id: 'welder_fabricator', name: 'Welder / Metal Fabricator' },
      { id: 'painter', name: 'House / Commercial Painter' },
      { id: 'other_construction', name: 'Other Skilled Trade' },
    ],
  },
  {
    id: 'manufacturing_production',
    name: 'Manufacturing & Small Production',
    icon: 'storefront',
    keywords: ['manufacturing', 'factory', 'karkhana', 'production', 'fabrication', 'packaging', 'unit', 'furniture', 'boxes', 'plastic'],
    subCategories: [
      { id: 'light_engineering', name: 'Light Engineering & Lathe' },
      { id: 'furniture_making', name: 'Furniture Manufacturing' },
      { id: 'packaging_boxes', name: 'Packaging & Box Making' },
      { id: 'plastic_paper_products', name: 'Paper & Eco Products' },
      { id: 'other_manufacturing', name: 'Other Small Manufacturing' },
    ],
  },
  {
    id: 'service_business',
    name: 'Service Business',
    icon: 'support_agent',
    keywords: ['cleaning', 'laundry', 'photography', 'printing', 'tent', 'event', 'service', 'dry cleaning', 'photocopy', 'xerox'],
    subCategories: [
      { id: 'cleaning_sanitation', name: 'Commercial / Home Cleaning' },
      { id: 'laundry_drycleaning', name: 'Laundry / Dhobi / Dry Cleaning' },
      { id: 'photography_videography', name: 'Photography & Videography' },
      { id: 'printing_photocopy', name: 'Printing, DTP & Photocopy' },
      { id: 'event_tent_house', name: 'Tent House & Event Supplies' },
      { id: 'other_services', name: 'Other Local Services' },
    ],
  },
  {
    id: 'education_professional',
    name: 'Education & Professional Services',
    icon: 'library_books',
    keywords: ['tuition', 'coaching', 'school', 'teacher', 'consultancy', 'ca', 'advocate', 'classes', 'preschool', 'daycare'],
    subCategories: [
      { id: 'tuition_coaching', name: 'Tuition & Coaching Centre' },
      { id: 'pre_school_daycare', name: 'Daycare & Early Learning' },
      { id: 'consulting_advisory', name: 'Consultancy & Bookkeeping' },
      { id: 'legal_tax_services', name: 'Tax & Document Facilitation' },
      { id: 'other_education_professional', name: 'Other Professional Practice' },
    ],
  },
  {
    id: 'digital_technology',
    name: 'Digital & Technology Services',
    icon: 'document_scanner',
    keywords: ['computer', 'csc', 'kiosk', 'online', 'cyber', 'internet', 'digital', 'freelance', 'data entry', 'seva kendra'],
    subCategories: [
      { id: 'csc_kiosk', name: 'CSC / Digital Seva Kendra Operator' },
      { id: 'cyber_cafe_computer', name: 'Computer Centre / Cyber Café' },
      { id: 'digital_services_freelance', name: 'Freelance Tech / Web / Graphic Work' },
      { id: 'data_entry_bpo', name: 'Data Entry & Office Support' },
      { id: 'other_digital', name: 'Other Tech & Digital Services' },
    ],
  },
  {
    id: 'waste_sanitation',
    name: 'Waste Management & Sanitation',
    icon: 'sync',
    keywords: ['waste', 'scrap', 'kabadi', 'recycling', 'sanitation', 'safai', 'garbage', 'kabadiwala', 'scrap dealer'],
    subCategories: [
      { id: 'scrap_recycling', name: 'Scrap Dealer (Kabadiwala) & Recycling' },
      { id: 'waste_collection', name: 'Waste Segregation & Collection' },
      { id: 'sanitation_worker', name: 'Sanitation & Septic Services' },
      { id: 'other_sanitation', name: 'Other Waste & Environmental Services' },
    ],
  },
  {
    id: 'student_education',
    name: 'Student / Higher Education',
    icon: 'school',
    keywords: ['student', 'study', 'college', 'degree', 'engineering', 'medical', 'mba', 'education', 'school', 'polytechnic', 'btech', 'mbbs'],
    subCategories: [
      { id: 'technical_degree', name: 'Engineering / Technology Degree' },
      { id: 'medical_nursing', name: 'Medical / Nursing / Allied Health' },
      { id: 'management_law', name: 'Management / MBA / Law Course' },
      { id: 'diploma_polytechnic', name: 'Polytechnic / Vocational Diploma' },
      { id: 'other_student', name: 'Other Approved Higher Education Course' },
    ],
  },
  {
    id: 'other_livelihood',
    name: 'Other Self-Employment / Business',
    icon: 'diversity_3',
    keywords: ['other', 'business', 'work', 'trade', 'self-employed', 'freelance', 'unlisted', 'art', 'miscellaneous'],
    subCategories: [
      { id: 'other_business', name: 'Other Small Business / Livelihood' },
    ],
  },
];

export interface OccupationSelection {
  occupationCategory: string;
  occupationType: string;
  customOccupation: string;
}

export default function SchemeWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [purpose, setPurpose] = useState<'business' | 'education' | 'agriculture' | 'artisans'>('business');
  
  // Structured occupation state
  const [occupation, setOccupation] = useState<OccupationSelection>({
    occupationCategory: 'street_vendor',
    occupationType: 'vegetable_vendor',
    customOccupation: '',
  });

  // Search state for Step 2
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [income, setIncome] = useState<number>(250000);
  const [state, setState] = useState<string>('Uttar Pradesh');

  // Filtered categories based on search
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
    return OCCUPATION_CATEGORIES.find((c) => c.id === occupation.occupationCategory) || OCCUPATION_CATEGORIES[0];
  }, [occupation.occupationCategory]);

  // Current active subcategory name
  const activeSubCategoryName = useMemo(() => {
    if (!activeCategory) return '';
    const sub = activeCategory.subCategories.find((s) => s.id === occupation.occupationType);
    return sub ? sub.name : '';
  }, [activeCategory, occupation.occupationType]);

  // Check if current selection requires custom input
  const isCustomRequired = useMemo(() => {
    return (
      occupation.occupationCategory === 'other_livelihood' ||
      occupation.occupationType.startsWith('other_')
    );
  }, [occupation.occupationCategory, occupation.occupationType]);

  // Step 2 validation
  const isStep2Valid = useMemo(() => {
    if (!occupation.occupationCategory || !occupation.occupationType) return false;
    if (isCustomRequired) {
      return occupation.customOccupation.trim().length > 0;
    }
    return true;
  }, [occupation, isCustomRequired]);

  // Recommendation engine matching function
  // Evaluates combination of occupation, purpose, and financial parameters
  const getMatchedSchemes = (): Scheme[] => {
    const cat = OCCUPATION_CATEGORIES.find((c) => c.id === occupation.occupationCategory);
    const candidateTypes: string[] = [];

    if (cat) {
      if (cat.id === 'agriculture_farming' || cat.id === 'dairy_livestock' || cat.id === 'fisheries_aquaculture') {
        candidateTypes.push('farmer', 'rural', 'micro');
      } else if (cat.id === 'street_vendor') {
        candidateTypes.push('vendor', 'micro');
      } else if (cat.id === 'handicrafts_artisan' || cat.id === 'handloom_textile') {
        candidateTypes.push('artisan', 'micro');
      } else if (cat.id === 'student_education') {
        candidateTypes.push('student');
      } else if (cat.id === 'construction_trades') {
        if (['carpenter', 'mason', 'welder_fabricator', 'plumber'].includes(occupation.occupationType)) {
          candidateTypes.push('artisan', 'micro');
        } else {
          candidateTypes.push('micro');
        }
      } else {
        candidateTypes.push('micro', 'vendor');
      }
    }

    return SUVIDHA_SCHEMES.filter((s) => {
      const catMatch =
        s.category === purpose ||
        (purpose === 'business' && s.category === 'artisans') ||
        (purpose === 'agriculture' && s.category === 'business');

      const typeMatch = s.eligibility.types.some((t) => candidateTypes.includes(t));
      const incomeMatch = income <= s.eligibility.maxIncome;

      return (catMatch || typeMatch) && incomeMatch;
    });
  };

  const matches = getMatchedSchemes();

  return (
    <div className="max-w-3xl mx-auto bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/50 shadow-civic">
      {/* Wizard Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-outline-variant/40 mb-6 gap-2">
        <div>
          <span className="text-xs font-bold text-secondary uppercase">
            Gentle Guided Questionnaire
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">
            Citizen Scheme Discovery Wizard
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Answer 3 quick questions to discover schemes matching your trade, income, and aspirations.
          </p>
        </div>
        <div className="text-xs font-bold text-secondary bg-surface-container px-3 py-1 rounded-full">
          Step {step} of 4
        </div>
      </div>

      {/* Wizard Progress Bar */}
      <div className="w-full bg-surface-container h-1.5 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step 1: Purpose */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-primary">
            What is your primary requirement?
          </h3>
          <p className="text-xs text-on-surface-variant">
            Select the focus area where you seek government financial or educational assistance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPurpose('business')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                purpose === 'business'
                  ? 'border-primary bg-secondary-container/20 shadow-xs'
                  : 'border-outline-variant/60 bg-surface hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon name="storefront" className="w-7 h-7 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">
                    Micro-Business &amp; Vendor
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Working capital, daily stock, equipment, expansion
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPurpose('education')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                purpose === 'education'
                  ? 'border-primary bg-secondary-container/20 shadow-xs'
                  : 'border-outline-variant/60 bg-surface hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon name="school" className="w-7 h-7 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">
                    Higher Education Loan Subsidy
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Technical/professional degrees, 100% moratorium relief
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPurpose('artisans')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                purpose === 'artisans'
                  ? 'border-primary bg-secondary-container/20 shadow-xs'
                  : 'border-outline-variant/60 bg-surface hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon name="handyman" className="w-7 h-7 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">
                    Traditional Artisan / Vishwakarma
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Handloom weaver, carpenter, potter, toolkit voucher &amp; 5% credit
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPurpose('agriculture')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                purpose === 'agriculture'
                  ? 'border-primary bg-secondary-container/20 shadow-xs'
                  : 'border-outline-variant/60 bg-surface hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon name="agriculture" className="w-7 h-7 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">
                    Agri-Allied &amp; Dairy Farming
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Milch livestock, vermicompost, rural farming capital subsidy
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Occupational Category & Sub-Category Selection */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-primary">
              Select your occupation or livelihood
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Choose the option that best describes your current work, business or livelihood.
            </p>
          </div>

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
              placeholder="Search occupation, trade, or livelihood (e.g. tailor, milk, electric, mobile repair)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active selection banner if chosen */}
          {occupation.occupationCategory && occupation.occupationType && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-primary/10 border border-primary/25 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" className="w-4 h-4 text-primary shrink-0" />
                <span className="text-on-surface">
                  Selected:{' '}
                  <strong className="text-primary font-bold">
                    {activeCategory?.name}
                  </strong>
                  {' → '}
                  <span className="text-secondary font-semibold">
                    {isCustomRequired && occupation.customOccupation
                      ? occupation.customOccupation
                      : activeSubCategoryName}
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant">
                You can change category or sub-category below
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

            {filteredCategories.length === 0 ? (
              <div className="p-6 rounded-xl border border-outline-variant/60 bg-surface text-center space-y-3">
                <p className="text-xs text-on-surface-variant">
                  No matching occupation found for &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOccupation({
                      occupationCategory: 'other_livelihood',
                      occupationType: 'other_business',
                      customOccupation: searchQuery,
                    });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Select &ldquo;Other / Not Listed&rdquo; with &ldquo;{searchQuery}&rdquo;</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredCategories.map((cat) => {
                  const isSelected = occupation.occupationCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setOccupation((prev) => ({
                          ...prev,
                          occupationCategory: cat.id,
                          occupationType:
                            prev.occupationCategory === cat.id
                              ? prev.occupationType
                              : cat.subCategories[0].id,
                        }));
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
            )}
          </div>

          {/* Sub-Category Selection Panel */}
          {activeCategory && (
            <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-2">
                <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon name={activeCategory.icon} className="w-4 h-4 text-secondary" />
                  <span>Specific Trade / Activity in {activeCategory.name}</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Select your exact trade
                </span>
              </div>

              {/* Sub-category chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCategory.subCategories.map((sub) => {
                  const isSubSelected = occupation.occupationType === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setOccupation((prev) => ({
                          ...prev,
                          occupationType: sub.id,
                        }));
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

              {/* Custom occupation input when "Other" is chosen */}
              {isCustomRequired && (
                <div className="mt-3 pt-3 border-t border-outline-variant/30 space-y-1.5">
                  <label
                    htmlFor="wizard-custom-occupation"
                    className="block text-xs font-bold text-primary"
                  >
                    Please describe your occupation / livelihood:
                  </label>
                  <input
                    id="wizard-custom-occupation"
                    type="text"
                    value={occupation.customOccupation}
                    onChange={(e) =>
                      setOccupation((prev) => ({
                        ...prev,
                        customOccupation: e.target.value,
                      }))
                    }
                    placeholder="e.g. Pottery painter, Handmade toy maker, Bookbinder..."
                    className="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                  <p className="text-[11px] text-on-surface-variant">
                    Enter your specific trade to help match targeted local credit and training schemes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Helpful note */}
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Note: Occupation is combined with income, state domicile, and social category in the next steps to determine specific program eligibility.
          </p>
        </div>
      )}

      {/* Step 3: Financial & Location Details */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-primary">
            Financial &amp; State Information
          </h3>
          <p className="text-xs text-on-surface-variant">
            Used strictly to confirm economic subvention eligibility and authorized nodal branches:
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="wizard-income-select" className="text-xs font-bold text-on-surface-variant block mb-1">
                Annual Household Family Income
              </label>
              <select
                id="wizard-income-select"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={150000}>Below ₹1.5 Lakhs / year (Highest priority welfare tier)</option>
                <option value={250000}>₹1.5 Lakhs - ₹3.0 Lakhs / year (Eligible for all central subsidies)</option>
                <option value={450000}>₹3.0 Lakhs - ₹4.5 Lakhs / year (CSIS Higher Education ceiling)</option>
                <option value={800000}>Above ₹4.5 Lakhs / year (Eligible for Mudra &amp; Stand-Up India)</option>
              </select>
            </div>

            <div>
              <label htmlFor="wizard-state-select" className="text-xs font-bold text-on-surface-variant block mb-1">
                State of Residence / Domicile
              </label>
              <select
                id="wizard-state-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Uttar Pradesh">Uttar Pradesh (Active pilot district: Varanasi)</option>
                <option value="Bihar">Bihar</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Icon name="shield" className="w-4 h-4 text-secondary" />
                <span>Civic Data Protection</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Self-declarations are authenticated against state beneficiary records through secure Aadhaar e-KYC with zero intermediary charges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-secondary-container/30 p-4 rounded-2xl border border-secondary-container flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Icon name="verified" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-primary text-sm">
                Match Verified: Found {matches.length} Suitable Schemes
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Evaluated for {state} domicile, {activeCategory?.name} ({isCustomRequired && occupation.customOccupation ? occupation.customOccupation : activeSubCategoryName}), and annual income up to ₹{income.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {matches.map((scheme) => (
              <div
                key={scheme.id}
                className="p-4 rounded-xl border border-outline-variant/60 bg-surface flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                      {scheme.interest}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {scheme.categoryLabel}
                    </span>
                  </div>
                  <h5 className="font-bold text-primary text-sm mt-1">
                    {scheme.name}
                  </h5>
                  <p className="text-xs text-on-surface-variant">
                    Assistance up to ₹{scheme.maxAmount.toLocaleString('en-IN')} · Moratorium:{' '}
                    {scheme.moratorium} mo.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/schemes/${scheme.id}`}
                    className="px-3 py-1.5 border border-outline-variant text-primary rounded-lg text-xs font-bold hover:bg-surface-container"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/apply?scheme=${scheme.id}`}
                    className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-outline-variant/40 flex justify-between items-center">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1))}
            className="px-5 py-2 border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            type="button"
            disabled={step === 2 && !isStep2Valid}
            onClick={() => setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 4))}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-colors ${
              step === 2 && !isStep2Valid
                ? 'bg-outline-variant/50 text-on-surface-variant/50 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-container cursor-pointer'
            }`}
          >
            Continue
          </button>
        ) : (
          <Link
            href="/schemes"
            className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors"
          >
            Explore All Schemes
          </Link>
        )}
      </div>
    </div>
  );
}
