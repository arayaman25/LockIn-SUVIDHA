export interface MockRecommendedScheme {
  id: string;
  name: string;
  summary: string;
  simpleExplanation: string;
  detailHref: string;
  partnerSchemeCode: string;
}

// Temporary presentation data. Replace this source with the backend response later.
export const MOCK_RECOMMENDED_SCHEMES: readonly MockRecommendedScheme[] = [
  {
    id: 'pmsvanidhi',
    name: 'PM SVANidhi (Street Vendor Loan)',
    summary: 'Collateral-free working capital support for eligible urban micro-enterprises and street vendors.',
    simpleExplanation: 'Think of this as a small government-supported business loan that can help eligible vendors keep their work running and growing.',
    detailHref: '/schemes/pmsvanidhi',
    partnerSchemeCode: 'MCF',
  },
  {
    id: 'standup',
    name: 'Stand-Up India Scheme',
    summary: 'Financial assistance for eligible entrepreneurs starting a new greenfield enterprise.',
    simpleExplanation: 'This scheme can help eligible entrepreneurs access formal funding to start a new business.',
    detailHref: '/schemes/standup',
    partnerSchemeCode: 'TL',
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    summary: 'Credit and support for traditional artisans and craftspeople building sustainable livelihoods.',
    simpleExplanation: 'This is support for skilled craftspeople who want tools, training, or finance to strengthen their work.',
    detailHref: '/schemes/pm-vishwakarma',
    partnerSchemeCode: 'MCF',
  },
];
