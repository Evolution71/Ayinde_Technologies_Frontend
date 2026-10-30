import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/offerings.css';
import {
  SERVICE_CATALOG,
  PAYMENT_OPTIONS,
  priceForTier,
  buildPaymentData,
  startServiceCheckout,
} from '../lib/servicePlans';
import { CATEGORIES } from '../data/offerings';

// Whole dollars when exact, otherwise cents, so the shown price matches the charge
const money = (n) => {
  const cents = Math.round(n * 100);
  return cents % 100 === 0
    ? `$${(cents / 100).toLocaleString('en-US')}`
    : `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// One price line per payment option, using the same rules as the checkout
function optionLines(tier, option) {
  const p = priceForTier(tier, option);
  if (!p) return null;
  if (option === 'monthly') {
    return { main: `${money(tier.basePrice)} / month`, sub: 'Billed monthly. Cancel any time.' };
  }
  if (option === 'quarterly') {
    return {
      main: `${money(p.total)} for 3 months`,
      sub: `${money(p.total / 3)} / month, 5% saving`,
    };
  }
  if (option === 'annual') {
    return {
      main: `${money(p.total)} for 12 months`,
      sub: `${money(p.total / 12)} / month, 10% saving`,
    };
  }
  // 50% down: 3 x monthly now, then the rest over 6 months
  return {
    main: `${money(p.total)} today`,
    sub: `Then ${money(tier.basePrice / 2)} / month for 6 months`,
  };
}

function TierCard({ serviceKey, tierKey, tier, option, hours, onChoose }) {
  if ('hourlyRate' in tier) {
    const billedHours = Math.max(Math.ceil(Number(hours) || tier.minHours), tier.minHours);
    const total = billedHours * tier.hourlyRate;
    return (
      <article className="offer-tier">
        <h4 className="offer-tier__name">{tier.name}</h4>
        <p className="offer-tier__desc">{tier.description}</p>
        <div className="offer-tier__price">
          <strong>{money(tier.hourlyRate)}</strong> / hour
          <div className="offer-tier__sub">Minimum {tier.minHours} hour{tier.minHours > 1 ? 's' : ''}</div>
        </div>
        <ul className="offer-tier__list">
          {tier.features.map((f) => <li key={f}>{f}</li>)}
        </ul>
        <div className="offer-tier__total">Your total for {billedHours} hour{billedHours > 1 ? 's' : ''}: {money(total)}</div>
        <button type="button" className="btn btn-primary offer-tier__btn" onClick={() => onChoose(serviceKey, tierKey, option, hours)}>
          Book this consultation
        </button>
      </article>
    );
  }

  const lines = optionLines(tier, option);
  return (
    <article className="offer-tier">
      <h4 className="offer-tier__name">{tier.name}</h4>
      <p className="offer-tier__desc">{tier.description}</p>
      {lines && (
        <div className="offer-tier__price">
          <strong>{lines.main}</strong>
          <div className="offer-tier__sub">{lines.sub}</div>
        </div>
      )}
      <ul className="offer-tier__list">
        {tier.features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <button type="button" className="btn btn-primary offer-tier__btn" onClick={() => onChoose(serviceKey, tierKey, option)}>
        Choose this plan
      </button>
    </article>
  );
}

function ServiceBlock({ service, catalogKey, onChoose, emphasis }) {
  const catalog = SERVICE_CATALOG[catalogKey];
  const isConsultation = catalogKey === 'consultation';
  const [option, setOption] = useState('monthly');
  const [hours, setHours] = useState(isConsultation ? 1 : undefined);

  return (
    <section className={`offer-service${emphasis ? ' offer-service--featured' : ''}`} id={service.id}>
      <h2 className="offer-service__title display-font">{service.name}</h2>
      <p className="offer-service__summary">{service.summary}</p>
      <p className="offer-service__for"><strong>Who it is for:</strong> {service.whoItsFor}</p>
      <ul className="offer-service__highlights">
        {service.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>

      <div className="offer-controls">
        {isConsultation ? (
          <label className="offer-control">
            <span>Hours</span>
            <input
              type="number"
              min={1}
              max={1000}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
        ) : (
          <label className="offer-control">
            <span>Payment option</span>
            <select value={option} onChange={(e) => setOption(e.target.value)}>
              {PAYMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="offer-tiers">
        {Object.entries(catalog.tiers).map(([tierKey, tier]) => (
          <TierCard
            key={tierKey}
            serviceKey={catalogKey}
            tierKey={tierKey}
            tier={tier}
            option={option}
            hours={hours}
            onChoose={onChoose}
          />
        ))}
      </div>
    </section>
  );
}

function OfferingPage({ categoryKey }) {
  useSiteStyles();
  const navigate = useNavigate();
  const category = CATEGORIES[categoryKey];

  useEffect(() => {
    if (category) document.title = `${category.pageTitle} | Ayinde Technologies`;
  }, [category]);

  if (!category) return null;

  const handleChoose = (serviceKey, tierKey, option, hours) => {
    const paymentData = buildPaymentData(serviceKey, tierKey, option, hours);
    if (!paymentData) return;
    startServiceCheckout(navigate, paymentData);
  };

  return (
    <div className="ayinde-site offering-page">
      <header className="offer-hero">
        <div className="container">
          <span className="badge-custom badge-navy mb-4">{category.eyebrow}</span>
          <h1 className="display-font offer-hero__title">{category.headline}</h1>
          <p className="offer-hero__intro">{category.intro}</p>
          <div className="offer-hero__actions">
            <a className="btn btn-primary" href="#packages">See packages and prices</a>
            <Link className="btn btn-outline-primary" to="/contact">Talk to us</Link>
          </div>
        </div>
      </header>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="offer-card">
              <h2 className="h4 display-font">The problem</h2>
              <p>{category.problem}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="offer-card offer-card--accent">
              <h2 className="h4 display-font">What you get</h2>
              <p>{category.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <h2 className="display-font mb-4">How we work</h2>
        <ol className="offer-steps">
          {category.howWeWork.map((step, i) => (
            <li key={step.title} className="offer-step">
              <span className="offer-step__num">{i + 1}</span>
              <div>
                <h3 className="h5">{step.title}</h3>
                <p className="mb-0">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div id="packages" className="container pb-4">
        {category.services.map((service) => (
          <ServiceBlock key={service.id} service={service} catalogKey={service.catalogKey} onChoose={handleChoose} />
        ))}
        {category.bundle && (
          <ServiceBlock
            service={category.bundle}
            catalogKey={category.bundle.catalogKey}
            onChoose={handleChoose}
            emphasis
          />
        )}
      </div>

      <section className="container pb-5">
        <div className="offer-cta">
          <h2 className="display-font h3">{category.cta.title}</h2>
          <p>{category.cta.text}</p>
          <div className="offer-hero__actions">
            {category.cta.primary.to.startsWith('#') ? (
              <a className="btn btn-primary" href={category.cta.primary.to}>{category.cta.primary.label}</a>
            ) : (
              <Link className="btn btn-primary" to={category.cta.primary.to}>{category.cta.primary.label}</Link>
            )}
            <Link className="btn btn-outline-primary" to={category.cta.secondary.to}>{category.cta.secondary.label}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export const BuildPage = () => <OfferingPage categoryKey="build" />;
export const AutomatePage = () => <OfferingPage categoryKey="automate" />;
export const PlanPage = () => <OfferingPage categoryKey="plan" />;

export default OfferingPage;
