import React from 'react';
import { Link } from 'react-router-dom';
import aboutIllustration from '../assets/about-illustration.svg';

export default function About() {
  return (
    <>
      <style>{`
        .page-header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #182d52 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          animation: fadeInDown 0.8s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(191, 144, 0, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .page-header h1 {
          position: relative;
          z-index: 1;
          font-size: 2.5rem;
          line-height: 1.2;
          margin: 20px 0;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .page-eyebrow {
          color: #fbbf24;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .page-header-sub {
          position: relative;
          z-index: 1;
          font-size: 18px;
          opacity: 1;
          max-width: 600px;
          margin: 20px auto;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-story {
          padding: 80px 20px;
          background: #f9fafb;
        }

        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .about-story > div > div > div {
          animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .about-illustration {
          animation: slideInRight 0.8s ease-out;
          transition: transform 0.3s ease;
        }

        .about-illustration:hover {
          transform: scale(1.02);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .section-eyebrow {
          color: #1e40af;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .about-story h2 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 20px;
          line-height: 1.3;
        }

        .about-story p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .about-mission {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mission-eyebrow {
          color: #fbbf24;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .mission-statement {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
          animation: zoomIn 0.8s ease-out;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .about-values {
          padding: 80px 20px;
          background: white;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .value-card {
          background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
          padding: 40px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: slideUp 0.6s ease-out both;
          position: relative;
          overflow: hidden;
        }

        .value-card:nth-child(1) { animation-delay: 0.1s; }
        .value-card:nth-child(2) { animation-delay: 0.2s; }
        .value-card:nth-child(3) { animation-delay: 0.3s; }
        .value-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #fbbf24, #ff6b35);
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: left;
        }

        .value-card:hover::before {
          transform: scaleX(1);
        }

        .value-card:hover {
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.15);
          border-color: #fbbf24;
          transform: translateY(-8px);
        }

        .value-card h3 {
          color: #1e40af;
          font-size: 20px;
          margin-bottom: 15px;
          transition: color 0.3s ease;
        }

        .value-card:hover h3 {
          color: #ff6b35;
        }

        .value-card p {
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .about-location {
          padding: 80px 20px;
          background: #f9fafb;
        }

        .about-location-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .about-location address {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #1e40af;
          margin: 20px 0;
          font-style: normal;
          line-height: 1.8;
          color: #1f2937;
          font-weight: 500;
        }

        .about-location a {
          color: #1e40af;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .about-location a:hover {
          color: #ff6b35;
          transform: translateX(5px);
        }

        .about-cta-card {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 50px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.2);
          animation: slideInRight 0.8s ease-out;
        }

        .about-cta-card h3 {
          font-size: 24px;
          margin-bottom: 15px;
        }

        .about-cta-card p {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .btn {
          display: inline-block;
          padding: 14px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-size: 16px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #fbbf24, #ff6b35);
          color: white;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 107, 53, 0.5);
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 1.8rem;
          }

          .about-story-grid,
          .about-location-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .mission-statement {
            font-size: 2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .about-cta-card {
            padding: 30px;
          }
        }
      `}</style>

      <section className="page-header">
        <div className="container">
          <p className="page-eyebrow">About Ayinde Technologies</p>
          <h1>We guide, build, and stay hands-on until it's actually running.</h1>
          <p className="page-header-sub">
            A technology partner for businesses that want more than a delivered product —
            a plan that made sense before anything was built, and support after launch.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-grid">
          <div>
            <p className="section-eyebrow">Our story</p>
            <h2>Built around one idea: technology should follow a plan, not replace one.</h2>
            <p>
              Ayinde Technologies started from a simple observation: most businesses don't fail
              at technology because the code is bad they fail because the app, website, or AI
              feature they paid for was never the right thing to build in the first place.
            </p>
            <p>
              So we work in three stages instead of one. We guide sitting down with a business,
              marketing, or proposal plan before touching a keyboard. We build AI applications
              and websites, from a first working version through to something production-ready.
              And we implement — staying involved through rollout, so the team that has to run
              the thing we built actually can.
            </p>
            <p>
              We're also a straightforward consulting practice for teams that need the strategy
              conversation on its own, without a build attached to it.
            </p>
          </div>
          <img src={aboutIllustration} alt="" className="about-illustration" />
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <p className="mission-eyebrow">Our mission</p>
          <p className="mission-statement">"To provide businesses all their technology needs."</p>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2 className="section-title">How we work</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>📋 Plan first</h3>
              <p>We'd rather spend a week on the right plan than a month building the wrong product.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Stay hands-on</h3>
              <p>Delivery isn't the finish line - we stick around through rollout and adoption.</p>
            </div>
            <div className="value-card">
              <h3>📚 Teach as we go</h3>
              <p>Through our tutoring courses, we help teams build the skills to maintain what we hand off.</p>
            </div>
            <div className="value-card">
              <h3>💬 Be straightforward</h3>
              <p>Clear proposals, clear pricing, clear next steps — no jargon standing in for a plan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-location">
        <div className="container about-location-grid">
          <div>
            <p className="section-eyebrow">Where we are</p>
            <h2>Based in Delaware, USA.</h2>
            <p>
              We're a US-based team working with clients locally and internationally, with hours
              that overlap US Eastern and Pacific time zones.
            </p>
            <address>
              📍 Delaware, USA
            </address>
            <p><a href="tel:+13022084855">📞 1-302-208-4855</a></p>
            <p><a href="mailto:support@ayindetechnologies.com">📧 support@ayindetechnologies.com</a></p>
          </div>
          <div className="about-cta-card">
            <h3>Have a project in mind?</h3>
            <p>Tell us what you're building — we'll tell you honestly whether it's ready to build yet.</p>
            <Link to="/#contact" className="btn btn-primary">Start a conversation</Link>
          </div>
        </div>
      </section>
    </>
  );
}