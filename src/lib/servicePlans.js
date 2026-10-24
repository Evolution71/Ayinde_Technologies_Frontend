// Single source of truth for service prices and package details.
// Prices and feature lists come from the official Ayinde service fliers.
// The backend mirrors these numbers in services/service_pricing.py and
// recalculates every charge there, so the amount shown here is what is charged.

export const PAYMENT_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (5% savings)' },
  { value: 'annual', label: 'Annual (10% savings)' },
  { value: 'halfdown', label: '50% down + 6 months' },
];

export const SERVICE_CATALOG = {
  website: {
    serviceType: 'website',
    title: 'Choose your website plan',
    tiers: {
      starter: {
        name: 'Website Starter',
        basePrice: 297,
        description: 'Perfect for small businesses',
        color: '#3b82f6',
        icon: '🚀',
        features: [
          'Professional website design & development',
          'Up to 5 pages',
          'Mobile responsive design',
          'Basic SEO',
          'Contact form & social links',
          '8 update hours per month',
          'Email support',
          'SSL certificate',
        ],
      },
      professional: {
        name: 'Website Professional',
        basePrice: 497,
        description: 'For growing businesses',
        color: '#8b5cf6',
        icon: '⭐',
        features: [
          'Everything in Starter',
          'Up to 10 pages',
          'Advanced SEO',
          'Google Analytics integration',
          'E-commerce ready (up to 50 products)',
          'Email marketing',
          'Blog setup',
          '16 update hours per month',
          'Performance monitoring',
        ],
      },
      advanced: {
        name: 'Website Advanced',
        basePrice: 697,
        description: 'For established businesses',
        color: '#f59e0b',
        icon: '💎',
        features: [
          'Everything in Professional',
          'Unlimited pages',
          'AI-powered chatbot',
          'Unlimited-product e-commerce',
          'Custom integrations, CRM & API development',
          '24 update hours per month',
          '24/7 priority support',
          'Advanced analytics reporting',
        ],
      },
      premium: {
        name: 'Website Premium',
        basePrice: 897,
        description: 'Enterprise-grade solutions',
        color: '#10b981',
        icon: '👑',
        features: [
          'Everything in Advanced',
          'Dedicated account manager',
          'Custom AI solutions',
          'Enterprise e-commerce',
          'Advanced security',
          'White-label options',
          'Custom development',
          '32 update hours per month',
          '24/7 dedicated support',
          'Quarterly strategy reviews',
          'Priority feature development',
        ],
      },
    },
  },

  application: {
    serviceType: 'applications',
    title: 'Choose your app plan',
    tiers: {
      starter: {
        name: 'App Development Starter',
        basePrice: 897,
        description: 'Launch your first app',
        color: '#3b82f6',
        icon: '🚀',
        features: [
          'Native iOS & Android',
          'Firebase backend setup',
          'Basic push notifications',
          'User authentication',
          'Basic database',
          'App Store submission',
          'Monthly updates (16 hours)',
          'Email support',
          'Performance monitoring',
        ],
      },
      professional: {
        name: 'App Development Professional',
        basePrice: 1097,
        description: 'Grow with real-time data',
        color: '#8b5cf6',
        icon: '⭐',
        features: [
          'Everything in Starter',
          'Advanced database',
          'Real-time data sync',
          'In-app payments',
          'Advanced push notifications',
          'Social integration',
          'Analytics dashboard',
          'Weekly updates (24 hours)',
          '24/7 priority support',
        ],
      },
      advanced: {
        name: 'App Development Advanced',
        basePrice: 1297,
        description: 'Cross-platform and AI-ready',
        color: '#f59e0b',
        icon: '💎',
        features: [
          'Everything in Professional',
          'Cross-platform (iOS & Android)',
          'Advanced security',
          'AI/ML integration',
          'Real-time chat',
          'Video streaming',
          'Bi-weekly updates (32 hours)',
          'Dedicated development team',
          '24/7 dedicated support',
        ],
      },
      premium: {
        name: 'App Development Premium',
        basePrice: 1497,
        description: 'Enterprise-grade app partner',
        color: '#10b981',
        icon: '👑',
        features: [
          'Everything in Advanced',
          'Dedicated account manager',
          'Cloud infrastructure',
          'Advanced AI/ML',
          'Enterprise security',
          'Multi-platform (web + mobile)',
          'Weekly updates (40+ hours)',
          'Custom integrations',
          'Quarterly strategy reviews',
          'White-label options',
          'Priority feature development',
        ],
      },
    },
  },

  premium: {
    serviceType: 'premium',
    title: 'Supreme VIP Platinum',
    tiers: {
      supreme: {
        name: 'Supreme VIP Platinum',
        basePrice: 2394,
        description: 'Ultimate all-in-one enterprise solution',
        color: '#f59e0b',
        icon: '👑',
        features: [
          'Complete solution: website AND application development in one package',
          'Enterprise support: 24/7 dedicated support, rapid bug fixes and priority feature development',
          'Advanced AI: latest AI functions and chatbot capabilities',
          'Dedicated account manager: a single point of contact and quarterly strategy reviews',
          'Monetization: complete deployment and monetization support',
          'Flexible payment: monthly, quarterly, annual or 50% down',
        ],
      },
    },
  },

  consultation: {
    serviceType: 'consultation',
    title: 'Choose your consultation',
    tiers: {
      starter: {
        name: 'Starter Consultation',
        hourlyRate: 50,
        minHours: 1,
        description: 'Initial discovery and quick advice',
        color: '#10b981',
        icon: '🚀',
        features: [
          '1-hour focused consultation',
          'Initial discovery & assessment',
          'Quick expert advice',
          'Basic recommendations',
          'Q&A session',
          'Email follow-up',
        ],
      },
      standard: {
        name: 'Standard Consultation',
        hourlyRate: 100,
        minHours: 3,
        description: 'One-on-one strategy and advice',
        color: '#3b82f6',
        icon: '💡',
        features: [
          'One-on-one consultation',
          'Strategy and advice',
          'Up to 3 hours per session',
          'Email support',
          'Solutions & recommendations',
          'Project roadmap (basic)',
        ],
      },
      enterprise: {
        name: 'Enterprise Consultation',
        hourlyRate: 300,
        minHours: 10,
        description: 'Deep-dive strategy for larger projects',
        color: '#f59e0b',
        icon: '👔',
        features: [
          'Dedicated consultant',
          'Deep-dive strategy sessions',
          'Minimum 10 hours',
          'Priority email & phone support',
          'Detailed recommendations report',
          'Implementation roadmap',
          'Weekly check-ins',
          'Custom solutions design',
        ],
      },
    },
  },
};

// Kept for components that import the older name.
export const SERVICE_PLANS = Object.fromEntries(
  Object.entries(SERVICE_CATALOG).map(([key, svc]) => [
    key,
    { serviceType: svc.serviceType, title: svc.title, plans: svc.tiers },
  ])
);

export function getTier(serviceKey, tierKey) {
  return SERVICE_CATALOG[serviceKey]?.tiers?.[tierKey] || null;
}

// Dollar amounts. Same formulas the backend uses in service_pricing.py.
export function priceFor(serviceKey, tierKey, option = 'monthly', hours) {
  const tier = getTier(serviceKey, tierKey);
  if (!tier) return null;

  if (serviceKey === 'consultation') {
    const h = Math.max(Number(hours) || tier.minHours, tier.minHours);
    return { basePrice: h * tier.hourlyRate, total: h * tier.hourlyRate, period: `${h} hour${h > 1 ? 's' : ''}`, hours: h };
  }

  const base = tier.basePrice;
  let total = base;
  let period = 'monthly';
  if (option === 'quarterly') {
    total = base * 3 * 0.95;
    period = 'quarterly';
  } else if (option === 'annual') {
    total = base * 12 * 0.9;
    period = 'annual';
  } else if (option === 'halfdown') {
    total = (base * 6) / 2;
    period = '50% down + 6 months';
  }
  return { basePrice: base, total, period };
}

export function optionLabel(serviceKey, tierKey, option) {
  const p = priceFor(serviceKey, tierKey, option);
  const base = getTier(serviceKey, tierKey)?.basePrice;
  if (!p || !base) return '';
  const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
  if (option === 'monthly') return `Monthly - ${money(base)}/month`;
  if (option === 'quarterly') return `Quarterly - ${money(p.total)} (5% savings)`;
  if (option === 'annual') return `Annual - ${money(p.total)} (10% savings)`;
  return `50% down - ${money(p.total)} now, then ${money(base / 2)}/month for 6 months`;
}

// Builds the paymentData object that /services/checkout reads.
export function buildPaymentData(serviceKey, tierKey, option = 'monthly', hours) {
  const tier = getTier(serviceKey, tierKey);
  const p = priceFor(serviceKey, tierKey, option, hours);
  if (!tier || !p) return null;
  const cents = Math.round(p.total * 100);

  if (serviceKey === 'consultation') {
    return {
      serviceType: 'consultation',
      tier: tierKey,
      tierName: tier.name,
      hours: p.hours,
      originalPrice: cents,
      finalPrice: cents,
      discountAmount: 0,
      discountPercent: 0,
      currency: 'USD',
      period: p.period,
      paymentOption: 'one-time',
      features: tier.features,
    };
  }

  return {
    serviceType: SERVICE_CATALOG[serviceKey].serviceType,
    service: SERVICE_CATALOG[serviceKey].serviceType,
    tier: tierKey,
    tierName: tier.name,
    amount: cents,
    currency: 'USD',
    paymentOption: option,
    discountPercent: 0,
    discountAmount: 0,
    originalPrice: cents,
    finalPrice: cents,
    period: p.period,
    features: tier.features,
  };
}

export function startServiceCheckout(navigate, paymentData) {
  try {
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
  } catch {
    // Storage can be blocked; checkout still gets the data via router state
  }
  navigate('/services/checkout', { state: { paymentData } });
}

// Kept for ServicePlanPanel.
export function getPriceSummary(serviceKey, tierKey, option, hours) {
  const p = priceFor(serviceKey, tierKey, option, hours);
  return p ? { total: p.total, period: p.period, hours: p.hours } : null;
}
