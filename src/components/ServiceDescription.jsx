import React from 'react';
import '../styles/offerings.css';

// Renders the full service copy from src/data/serviceDocs.js below a service page's hero.
// Each major block is a native <details> dropdown (works without JavaScript, keyboard and screen-reader friendly).
// The introduction and the closing call to action stay visible.
// Prices are not shown here; the plan prices above the form come from the database.

const Paragraphs = ({ items, className }) => (
  items && items.length ? (
    <>
      {items.map((p, i) => <p key={i} className={className || 'mb-3'}>{p}</p>)}
    </>
  ) : null
);

// A dropdown block. `defaultOpen` lets a page open one section by default.
const Dropdown = ({ title, children, defaultOpen = false, id, className = '' }) => (
  <details className={`svc-dropdown ${className}`.trim()} id={id} open={defaultOpen || undefined}>
    <summary className="svc-dropdown__summary">
      <span className="svc-dropdown__title display-font">{title}</span>
      <span className="svc-dropdown__icon" aria-hidden="true">+</span>
    </summary>
    <div className="svc-dropdown__body">{children}</div>
  </details>
);

const ServiceDescription = ({ doc, inquiryAnchor = '#projectForm' }) => {
  if (!doc) return null;

  const planCta = (label) => (
    <a className="btn btn-outline-primary btn-sm mt-auto" href={inquiryAnchor}>{label}</a>
  );

  return (
    <div className="ayinde-site service-description container py-5">
      {/* Introduction (always visible) */}
      <section className="mb-4">
        <span className="badge-custom badge-navy mb-3">{doc.eyebrow}</span>
        <h2 className="display-font h1 mb-3" style={{ color: 'var(--color-navy)', textWrap: 'balance' }}>{doc.headline}</h2>
        <div className="mb-3" style={{ maxWidth: 760 }}>
          <Paragraphs items={doc.intro} />
        </div>
        {doc.tagline && <p className="fw-semibold mb-0" style={{ color: 'var(--color-navy)' }}>{doc.tagline}</p>}
      </section>

      {/* What we build */}
      {doc.whatWeBuild && (
        <Dropdown title={doc.whatWeBuildTitle} id="what-we-build">
          <Paragraphs items={doc.whatWeBuildIntro} />
          <div className="row g-4 mt-1">
            {doc.whatWeBuild.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.title}>
                <div className="offer-card h-100">
                  <h3 className="h5 display-font">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Approach */}
      {doc.approachSteps && (
        <Dropdown title={doc.approachTitle} id="our-approach">
          <Paragraphs items={doc.approachIntro} />
          <div className="row g-4 mt-1">
            {doc.approachSteps.map((step) => (
              <div className="col-md-6 col-lg-3" key={step.title}>
                <div className="offer-card h-100">
                  <h3 className="h5 display-font">{step.title}</h3>
                  {step.text.map((t, i) => <p key={i} className="mb-2">{t}</p>)}
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Plans: the section and each plan are dropdowns */}
      {doc.plans && (
        <Dropdown title={doc.plansTitle} id="plan-details">
          <Paragraphs items={doc.plansIntro} />
          <div className="row g-4 mt-1">
            {doc.plans.map((plan) => (
              <div className="col-md-6 col-xl-4 d-flex" key={plan.id}>
                <details className="svc-dropdown svc-dropdown--plan w-100 d-flex flex-column">
                  <summary className="svc-dropdown__summary svc-dropdown__summary--plan">
                    <span>
                      <span className="svc-dropdown__title display-font d-block">{plan.name}</span>
                      <span className="svc-dropdown__label d-block">{plan.label}</span>
                    </span>
                    <span className="svc-dropdown__icon" aria-hidden="true">+</span>
                  </summary>
                  <div className="svc-dropdown__body">
                    <p className="offer-tier__desc">{plan.tagline}</p>
                    <Paragraphs items={plan.intro} className="small mb-2" />
                    <ul className="offer-tier__list">
                      {plan.included.map((item) => (
                        <li key={typeof item === 'string' ? item : item.title}>
                          {typeof item === 'string' ? item : <><strong>{item.title}:</strong> {item.text}</>}
                        </li>
                      ))}
                    </ul>
                    {plan.delivery && <p className="small fw-semibold mb-2">{plan.delivery}</p>}
                    {plan.bookingNote && <p className="small fw-semibold mb-2">{plan.bookingNote}</p>}
                    <p className="small text-secondary mb-3">{plan.bestFor}</p>
                    {planCta(plan.cta)}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Why choose us */}
      {doc.why && (
        <Dropdown title={doc.whyTitle} id="why-us">
          <div className="row g-4">
            {doc.why.map((item) => (
              <div className="col-md-6" key={item.title}>
                <div className="offer-card h-100">
                  <h3 className="h5 display-font">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Who it's for (premium) */}
      {doc.who && (
        <Dropdown title={doc.whoTitle} id="who-its-for">
          <div className="row g-4">
            {doc.who.map((item) => (
              <div className="col-md-6 col-xl-4" key={item.title}>
                <div className="offer-card h-100">
                  <h3 className="h5 display-font">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Connected strategy (premium) */}
      {doc.connectedTitle && (
        <Dropdown title={doc.connectedTitle} id="connected-strategy">
          <Paragraphs items={doc.connectedText} />
        </Dropdown>
      )}

      {/* Partner section (premium) */}
      {doc.partnerTitle && (
        <Dropdown title={doc.partnerTitle} id="partnership">
          <Paragraphs items={doc.partnerText} />
          <div className="row g-4 mt-1">
            {doc.partnerPoints.map((item) => (
              <div className="col-md-6" key={item.title}>
                <div className="offer-card h-100">
                  <h3 className="h5 display-font">{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      )}

      {/* Not sure which plan (consulting) */}
      {doc.notSure && (
        <Dropdown title={doc.notSure.title} id="not-sure">
          <Paragraphs items={doc.notSure.text} />
        </Dropdown>
      )}

      {/* Closing call to action (always visible) */}
      {doc.closing && (
        <section className="mt-4 mb-2">
          <div className="offer-cta">
            <h2 className="display-font h3">{doc.closing.title}</h2>
            <Paragraphs items={doc.closing.text} className="mb-3" />
            <div className="offer-hero__actions">
              <a className="btn btn-primary" href={inquiryAnchor}>{doc.closing.ctaPrimary}</a>
              {doc.closing.ctaSecondary && (
                <a className="btn btn-outline-light" href="/contact">{doc.closing.ctaSecondary}</a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDescription;
