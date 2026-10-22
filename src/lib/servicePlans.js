// Pricing and checkout data for the design service pages.
// Prices and billing formulas are copied from the existing service pages
// (WebsiteServicesPage, ApplicationServicesPage, PremiumServicesPage,
// ConsultationServicesPage) so both routes charge the same amounts.
// Checkout itself is unchanged: paymentData goes to /services/checkout.

export const SERVICE_PLANS = {
  website: {
    serviceType: 'website',
    title: 'Choose your website plan',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly (5% savings)' },
      { value: 'annual', label: 'Annual (10% savings)' },
      { value: 'halfdown', label: '50% down + 6 months' },
    ],
    plans: {
      starter: { name: 'Website Starter', basePrice: 297 },
      professional: { name: 'Website Professional', basePrice: 497 },
      advanced: { name: 'Website Advanced', basePrice: 697 },
      premium: { name: 'Website Premium', basePrice: 897 },
    },
  },
  application: {
    serviceType: 'application',
    title: 'Choose your app plan',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly (5% savings)' },
      { value: 'annual', label: 'Annual (10% savings)' },
      { value: 'halfdown', label: '50% down + 6 months' },
    ],
    plans: {
      starter: { name: 'App Development Starter', basePrice: 897 },
      professional: { name: 'App Development Professional', basePrice: 1097 },
      advanced: { name: 'App Development Advanced', basePrice: 1297 },
      premium: { name: 'App Development Premium', basePrice: 1497 },
    },
  },
  premium: {
    serviceType: 'premium',
    title: 'Premium plan',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'annual', label: '2 years' },
      { value: 'threeyear', label: '3 years (one-time)' },
      { value: 'halfdown', label: '50% down + 6 months' },
    ],
    plans: {
      supreme: { name: 'Supreme VIP Platinum', basePrice: 2394, annualPrice: 50000, threeyearPrice: 50000 },
    },
  },
  consultation: {
    serviceType: 'consultation',
    title: 'Choose your consultation',
    plans: {
      starter: { name: 'Starter Consultation', hourlyRate: 50, minHours: 1 },
      standard: { name: 'Standard Consultation', hourlyRate: 100, minHours: 3 },
      enterprise: { name: 'Enterprise Consultation', hourlyRate: 300, minHours: 10 },
    },
  },
};

// Same formulas as the existing pages. Amounts are in dollars here.
function priceSubscription(service, plan, option) {
  const base = plan.basePrice;
  if (service === 'premium') {
    if (option === 'annual' && plan.annualPrice) return { basePrice: plan.annualPrice, period: '2 years' };
    if (option === 'threeyear' && plan.threeyearPrice) return { basePrice: plan.threeyearPrice, period: '3 years' };
    if (option === 'halfdown') return { basePrice: (base * 6) / 2, period: '50% down + 6 months' };
    return { basePrice: base, period: 'monthly' };
  }
  if (option === 'quarterly') return { basePrice: base * 3 * 0.95, period: 'quarterly' };
  if (option === 'annual') return { basePrice: base * 12 * 0.9, period: 'annual' };
  if (option === 'halfdown') return { basePrice: (base * 6) / 2, period: '50% down + 6 months' };
  return { basePrice: base, period: 'monthly' };
}

export function getPriceSummary(serviceKey, planKey, option, hours) {
  const service = SERVICE_PLANS[serviceKey];
  const plan = service?.plans[planKey];
  if (!plan) return null;

  if (serviceKey === 'consultation') {
    const h = Math.max(Number(hours) || 1, plan.minHours);
    const total = h * plan.hourlyRate;
    return { total, hours: h, period: `${h} hour${h > 1 ? 's' : ''}` };
  }

  const { basePrice, period } = priceSubscription(serviceKey, plan, option);
  return { total: basePrice, period };
}

// Builds the same paymentData shape the existing pages save, then opens checkout.
export function buildPaymentData(serviceKey, planKey, option, hours) {
  const service = SERVICE_PLANS[serviceKey];
  const plan = service?.plans[planKey];
  const summary = getPriceSummary(serviceKey, planKey, option, hours);
  if (!plan || !summary) return null;

  const cents = Math.round(summary.total * 100);

  if (serviceKey === 'consultation') {
    return {
      serviceType: 'consultation',
      tier: planKey,
      tierName: plan.name,
      originalPrice: cents,
      finalPrice: cents,
      discountAmount: 0,
      discountPercent: 0,
      currency: 'USD',
      period: summary.period,
      paymentOption: 'one-time',
      features: [],
    };
  }

  return {
    serviceType: service.serviceType,
    service: service.serviceType,
    tier: planKey,
    tierName: plan.name,
    amount: cents,
    currency: 'USD',
    paymentOption: option,
    discountPercent: 0,
    discountAmount: 0,
    originalPrice: cents,
    finalPrice: cents,
    period: summary.period,
    features: [],
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