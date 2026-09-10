import React from 'react';

export default function Terms() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="page-eyebrow">Legal</p>
          <h1>Terms of Service</h1>
          <p className="page-header-sub">The basics of using this site, your account, and our courses.</p>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: September 2026</p>

            <p>
              These terms cover your use of this website, your account, and our course platform.
              A separate build, consulting, or tutoring engagement is governed by its own signed
              agreement, not by this page.
            </p>

            <h2>Accounts</h2>
            <ul>
              <li>You're responsible for keeping your login credentials secure and for activity under your account.</li>
              <li>You must provide accurate information when registering.</li>
              <li>We may suspend an account used to abuse the site — including attempting to bypass the captcha or spam the contact form.</li>
            </ul>

            <h2>Course access &amp; payment</h2>
            <ul>
              <li>New course enrollments include a 30-day free trial.</li>
              <li>After the trial, continued access requires payment at the price shown for that course at the time you subscribe.</li>
              <li>Payments are processed by Flutterwave; their terms apply to the payment transaction itself.</li>
              <li>Course access reflects your subscription status at the time of use — we may update course pricing going forward, which won't change what you've already paid for.</li>
            </ul>

            <h2>Projects &amp; case studies</h2>
            <p>
              Access to project case studies requires a logged-in account. Case study content is
              for your reference and isn't licensed for redistribution.
            </p>

            <h2>No guarantee of availability</h2>
            <p>
              We aim to keep this site and its services available and accurate, but we don't
              guarantee uninterrupted access, and we may update or remove content at any time.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The Ayinde Technologies name, logo, and the design of this site belong to Ayinde
              Technologies. Content you submit (contact messages, account details) remains yours;
              you give us permission to use it to provide the service and respond to you.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              This website and its services are provided "as is." To the extent permitted by law,
              Ayinde Technologies isn't liable for indirect or consequential loss arising from your
              use of the site. This doesn't limit liability that can't be excluded by law.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of California, United States,
              without regard to its conflict of law provisions.
            </p>

            <h2>Changes to these terms</h2>
            <p>We may update these terms from time to time. Continued use of the site after a change means you accept the update.</p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can go to{' '}
              <a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a>{' '}
              or +1 949-520-8178.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
