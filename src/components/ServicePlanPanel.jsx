import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_PLANS, PAYMENT_OPTIONS, getPriceSummary, buildPaymentData, startServiceCheckout, priceForTier } from '../lib/servicePlans';
import useServiceTiers from '../lib/useServiceTiers';

// Website and app packages are sold as subscriptions: visitors choose Monthly or Annual.
// The backend (service_pricing.py) uses the same two options for these services.
const SUBSCRIPTION_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
];
const SUBSCRIPTION_SERVICES = ['website', 'application'];

// Whole dollars show without cents; anything with cents shows two decimals.
const money = (n) => {
  const value = Number(n);
  const cents = Math.abs(value % 1) > 0.001;
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

// Plan picker shown above the inquiry form on the design service pages.
// The inquiry form stays as it is; this panel adds a direct "pay now" path
// into the existing checkout.
const ServicePlanPanel = ({ serviceKey }) => {
  const navigate = useNavigate();
  const service = SERVICE_PLANS[serviceKey] || SERVICE_PLANS.website;
  const isConsultation = serviceKey === 'consultation';
  const isSubscription = SUBSCRIPTION_SERVICES.includes(serviceKey);
  // Billing options: Monthly/Annual for website and app packages, the full list otherwise
  const options = isSubscription ? SUBSCRIPTION_OPTIONS : service.options || PAYMENT_OPTIONS;
  // Prices come from the database (service_tiers) through this hook
  const { tiers } = useServiceTiers(serviceKey);
  const planKeys = Object.keys(tiers);

  const [planKey, setPlanKey] = useState(planKeys[0]);
  const [option, setOption] = useState(options[0].value);
  const [hours, setHours] = useState(3);
  const [error, setError] = useState(null);

  const summary = getPriceSummary(serviceKey, planKey, option, hours, tiers);

  // Price shown on each plan button for the billing option currently selected
  const planPrice = (tier) => {
    if (!tier) return '';
    if (isConsultation) return `${money(tier.hourlyRate)}/hour`;
    if (option === 'annual') return `${money(priceForTier(tier, 'annual').total)}/year`;
    return `${money(tier.basePrice)}/month`;
  };

  const handleCheckout = () => {
    setError(null);
    const paymentData = buildPaymentData(serviceKey, planKey, option, hours, tiers);
    if (!paymentData) {
      setError('Please choose a plan first.');
      return;
    }
    startServiceCheckout(navigate, paymentData);
  };

  const box = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    background: '#fff',
  };
  const planBtn = (active) => ({
    flex: '1 1 140px',
    minWidth: 0,
    padding: '10px 12px',
    borderRadius: 8,
    border: active ? '2px solid var(--color-blue)' : '1px solid #d1d5db',
    background: active ? 'var(--color-light)' : '#fff',
    color: 'var(--color-navy)',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'left',
  });
  const toggleBtn = (active) => ({
    flex: '1 1 0',
    padding: '8px 12px',
    border: 'none',
    borderRadius: 6,
    background: active ? 'var(--color-navy)' : 'transparent',
    color: active ? '#fff' : 'var(--color-navy)',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  });

  return (
    <div style={box}>
      <h4 className="display-font mb-3" style={{ color: 'var(--color-navy)', fontSize: 18 }}>
        {service.title}
      </h4>

      {isSubscription && (
        <div className="mb-3">
          <span className="form-label small fw-bold d-block mb-1" id={`${serviceKey}-billing-label`}>Billing</span>
          <div
            role="radiogroup"
            aria-labelledby={`${serviceKey}-billing-label`}
            className="d-flex p-1 gap-1"
            style={{ background: '#eef2f7', borderRadius: 8 }}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={option === o.value}
                style={toggleBtn(option === o.value)}
                onClick={() => setOption(o.value)}
              >
                {o.label}
                {o.value === 'annual' && <span style={{ fontWeight: 400, fontSize: 12 }}> (save 10%)</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        {planKeys.map((key) => (
          <button key={key} type="button" style={planBtn(planKey === key)} onClick={() => setPlanKey(key)}>
            <span style={{ display: 'block' }}>{tiers[key].name}</span>
            {isSubscription && (
              <span style={{ display: 'block', fontWeight: 400, fontSize: 13, color: 'var(--color-orange)' }}>
                {planPrice(tiers[key])}
              </span>
            )}
          </button>
        ))}
      </div>

      {isConsultation ? (
        <div className="mb-3">
          <label className="form-label small fw-bold" htmlFor="consult-hours">Hours needed</label>
          <input
            id="consult-hours"
            type="number"
            min="1"
            className="form-control"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
      ) : (
        !isSubscription && (
          <div className="mb-3">
            <label className="form-label small fw-bold" htmlFor={`${serviceKey}-option`}>Billing</label>
            <select
              id={`${serviceKey}-option`}
              className="form-select"
              value={option}
              onChange={(e) => setOption(e.target.value)}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )
      )}

      {summary && (
        <p className="mb-3 small text-muted">
          Total: <strong style={{ color: 'var(--color-navy)' }}>{money(summary.total)}</strong>
          {' '}({summary.period})
          {isSubscription && option === 'annual' && (
            <> &middot; about {money(summary.total / 12)} per month</>
          )}
        </p>
      )}

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <button type="button" className="btn-accent w-100" onClick={handleCheckout}>
        <i className="fa-solid fa-credit-card me-2" />
        {isConsultation ? 'Book and pay' : 'Subscribe and pay'}
      </button>
    </div>
  );
};

export default ServicePlanPanel;
