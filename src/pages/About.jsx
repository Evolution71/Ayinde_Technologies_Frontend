import React from 'react';
import { Link } from 'react-router-dom';
import aboutIllustration from '../assets/about-illustration.svg';

export default function About() {
  return (
    <>
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
              <h3>Plan first</h3>
              <p>We'd rather spend a week on the right plan than a month building the wrong product.</p>
            </div>
            <div className="value-card">
              <h3>Stay hands-on</h3>
              <p>Delivery isn't the finish line - we stick around through rollout and adoption.</p>
            </div>
            <div className="value-card">
              <h3>Teach as we go</h3>
              <p>Through our tutoring courses, we help teams build the skills to maintain what we hand off.</p>
            </div>
            <div className="value-card">
              <h3>Be straightforward</h3>
              <p>Clear proposals, clear pricing, clear next steps — no jargon standing in for a plan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-location">
        <div className="container about-location-grid">
          <div>
            <p className="section-eyebrow">Where we are</p>
            <h2>Based in Inglewood, California.</h2>
            <p>
              We're a US-based team working with clients locally and internationally, with hours
              that overlap US Eastern and Pacific time zones.
            </p>
            <address>
              112 S Market St, Suite 1008<br />
              Inglewood, CA 90301<br />
              United States
            </address>
            <p><a href="tel:+19496627869">+1 949-662-7869</a></p>
            <p><a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a></p>
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