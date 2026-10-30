import React from 'react';
import '../styles/offerings.css';

// Renders the full service copy from src/data/serviceDocs.js below a service page's hero.
// Prices are not shown here; the plan prices above the form come from the database.
const Paragraphs = ({ items, className }) => (
  items && items.length ? (
    <>
      {items.map((p, i) => <p key={i} className={className || 'mb-3'}>{p}</p>)}
    </>
  ) : null
);

const ServiceDescription = ({ doc, inquiryAnchor = '#projectForm' }) => {
  if (!doc) return null;

  const planCta = (label) => (
    <a className="btn btn-outline-primary btn-sm mt-auto" href={inquiryAnchor}>{label}</a>
  );

  return (
    <div className="ayinde-site service-description container py-5">
      {/* Introduction */}
      <section className="mb-5">
        <span className="badge-custom badge-navy mb-3">{doc.eyebrow}</span>
        <h2 className="display-font h1 mb-3" style={{ color: 'var(--color-navy)', textWrap: 'balance' }}>{doc.headline}</h2>
        <div className="mb-3" style={{ maxWidth: 760 }}>
          <Paragraphs items={doc.intro} />
        </div>
        {doc.tagline && <p className="fw-semibold mb-0" style={{ color: 'var(--color-navy)' }}>{doc.tagline}</p>}
      </section>

      {/* What we build */}
      {doc.whatWeBuild && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-3">{doc.whatWeBuildTitle}</h2>
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
        </section>
      )}

      {/* Approach */}
      {doc.approachSteps && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-3">{doc.approachTitle}</h2>
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
        </section>
      )}

      {/* Plans */}
      {doc.plans && (
        <section className="mb-5" id="plan-details">
          <h2 className="display-font h2 mb-3">{doc.plansTitle}</h2>
          <Paragraphs items={doc.plansIntro} />
          <div className="row g-4 mt-1">
            {doc.plans.map((plan) => (
              <div className="col-md-6 col-xl-4 d-flex" key={plan.id}>
                <article className="offer-tier w-100">
                  <h3 className="offer-tier__name">{plan.name}</h3>
                  <p className="fw-semibold mb-1" style={{ color: 'var(--color-navy)' }}>{plan.label}</p>
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
                </article>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why choose us */}
      {doc.why && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-4">{doc.whyTitle}</h2>
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
        </section>
      )}

      {/* Who it's for (premium) */}
      {doc.who && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-4">{doc.whoTitle}</h2>
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
        </section>
      )}

      {/* Connected strategy and partner sections (premium) */}
      {doc.connectedTitle && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-3">{doc.connectedTitle}</h2>
          <Paragraphs items={doc.connectedText} />
        </section>
      )}
      {doc.partnerTitle && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-3">{doc.partnerTitle}</h2>
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
        </section>
      )}

      {/* Not sure which plan (consulting) */}
      {doc.notSure && (
        <section className="mb-5">
          <h2 className="display-font h2 mb-3">{doc.notSure.title}</h2>
          <Paragraphs items={doc.notSure.text} />
        </section>
      )}

      {/* Closing call to action */}
      {doc.closing && (
        <section className="mb-2">
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
