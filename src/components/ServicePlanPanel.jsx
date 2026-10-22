import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_PLANS, getPriceSummary, buildPaymentData, startServiceCheckout } from '../lib/servicePlans';

// Plan picker shown above the inquiry form on the design service pages.
// The inquiry form stays as it is; this panel adds a direct "pay now" path
// into the existing checkout.
const ServicePlanPanel = ({ serviceKey }) => {
  const navigate = useNavigate();
  const service = SERVICE_PLANS[serviceKey];
  const planKeys = Object.keys(service.plans);
  const isConsultation = serviceKey === 'consultation';

  const [planKey, setPlanKey] = useState(planKeys[0]);
  const [option, setOption] = useState(service.options ? service.options[0].value : 'one-time');
  const [hours, setHours] = useState(3);
  const [error, setError] = useState(null);

  const summary = getPriceSummary(serviceKey, planKey, option, hours);

  const handleCheckout = () => {
    setError(null);
    const paymentData = buildPaymentData(serviceKey, planKey, option, hours);
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

  return (
    <div style={box}>
      <h4 className="display-font mb-3" style={{ color: 'var(--color-navy)', fontSize: 18 }}>
        {service.title}
      </h4>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {planKeys.map((key) => (
          <button key={key} type="button" style={planBtn(planKey === key)} onClick={() => setPlanKey(key)}>
            {service.plans[key].name}
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
        <div className="mb-3">
          <label className="form-label small fw-bold" htmlFor={`${serviceKey}-option`}>Billing</label>
          <select
            id={`${serviceKey}-option`}
            className="form-select"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            {service.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {summary && (
        <p className="mb-3 small text-muted">
          Total: <strong style={{ color: 'var(--color-navy)' }}>${summary.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
          {' '}({summary.period})
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
