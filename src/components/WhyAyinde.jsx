import React from 'react';
import { Link } from 'react-router-dom';

const POINTS = [
  {
    title: 'Built on a strong foundation',
    text: 'We design the structure first: your data, users, security and business rules. Every feature is then built on that base, so you never receive an empty sandbox.',
  },
  {
    title: 'Built step by step, with you',
    text: 'Your software grows in stages. You review and approve each stage before the next one starts, so nothing is guessed.',
  },
  {
    title: 'Shaped around your business',
    text: 'Payments, bookings, dashboards and admin tools are designed around how your team actually works, not forced into a template.',
  },
  {
    title: 'Engineers who stay after launch',
    text: 'The team that builds your software keeps supporting it, with updates, monitoring and fixes.',
  },
];

const WhyAyinde = () => (
  <section className="ayn-why" aria-labelledby="ayn-why-title">
    <div className="ayn-why__inner">
      <p className="ayn-why__eyebrow">Why Ayinde Technologies Corporation</p>
      <h2 id="ayn-why-title" className="ayn-why__title">
        AI can generate a page. It cannot read your mind.
      </h2>
      <p className="ayn-why__lead">
        AI tools can produce a quick draft, but they cannot understand your customers, your processes or the
        problem behind your idea. Our experts do. We turn your goals into software that is structured, secure and
        ready to grow.
      </p>

      <div className="ayn-why__grid">
        {POINTS.map((p, i) => (
          <article className="ayn-why__card" key={p.title}>
            <span className="ayn-why__num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>

      <div className="ayn-why__actions">
        <Link to="/start-project" className="ayn-why__btn ayn-why__btn--primary">Start your project</Link>
        <Link to="/contact" className="ayn-why__btn">Book a strategy call</Link>
      </div>
    </div>

    <style>{`
      .ayn-why {
        background: #0A2248;
        color: rgba(255, 255, 255, 0.85);
        padding: 64px 16px;
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
      }
      .ayn-why__inner { max-width: 1120px; margin: 0 auto; }
      .ayn-why__eyebrow {
        margin: 0 0 12px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #FF7A1A;
      }
      .ayn-why__title {
        margin: 0 0 18px;
        font-size: clamp(26px, 4vw, 38px);
        font-weight: 800;
        line-height: 1.15;
        color: #ffffff;
        text-wrap: balance;
      }
      .ayn-why__lead {
        margin: 0 0 40px;
        max-width: 720px;
        font-size: 17px;
        line-height: 1.65;
      }
      .ayn-why__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
      }
      .ayn-why__card {
        min-width: 0;
        padding: 26px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.04);
      }
      .ayn-why__num {
        display: inline-block;
        margin-bottom: 14px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2F9BFF;
      }
      .ayn-why__card h3 {
        margin: 0 0 10px;
        font-size: 19px;
        font-weight: 700;
        color: #ffffff;
      }
      .ayn-why__card p { margin: 0; font-size: 15px; line-height: 1.6; }
      .ayn-why__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 36px;
      }
      .ayn-why__btn {
        display: inline-flex;
        align-items: center;
        min-height: 46px;
        padding: 0 22px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #ffffff;
        font-weight: 700;
        text-decoration: none;
      }
      .ayn-why__btn:hover { color: #ffffff; border-color: #ffffff; }
      .ayn-why__btn--primary { background: #FF7A1A; border-color: #FF7A1A; }
      .ayn-why__btn--primary:hover { background: #e96a0e; border-color: #e96a0e; }
      .ayn-why__btn:focus-visible { outline: 3px solid #2F9BFF; outline-offset: 3px; }

      @media (max-width: 720px) {
        .ayn-why { padding: 48px 16px; }
        .ayn-why__grid { grid-template-columns: minmax(0, 1fr); }
        .ayn-why__card { padding: 22px; }
      }
    `}</style>
  </section>
);

export default WhyAyinde;
