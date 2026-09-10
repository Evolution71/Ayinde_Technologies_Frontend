import React from 'react';

export default function Privacy() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="page-eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="page-header-sub">What we collect on this site, and how it's used.</p>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="prose">
            <p className="updated">Last updated: September 2026</p>

            <p>
              Ayinde Technologies ("Ayinde," "we," "us") operates this website and the account
              system, course platform, and contact tools on it. This policy covers what we collect
              through the site itself — it doesn't cover data handled inside a separate application
              we've built for a client.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li><strong>Account information:</strong> your name, email address, and password when you register. Passwords are hashed before storage — we never store or can see your actual password.</li>
              <li><strong>Contact form submissions:</strong> the name, email, phone, company, subject, and message you enter.</li>
              <li><strong>Course &amp; enrollment data:</strong> which courses you enroll in, your free trial period, and whether a course subscription is active.</li>
              <li><strong>Payment records:</strong> if you pay to continue a course after your free trial, payments are processed by Flutterwave. We store a transaction reference, amount, currency, and status — we never see or store your card details; those stay with Flutterwave.</li>
              <li><strong>Login sessions:</strong> after logging in, a session token is stored in your browser's local storage so you stay logged in. It expires automatically after a set period.</li>
              <li><strong>Basic technical data:</strong> standard web server logs (such as IP address) generated automatically by our hosting infrastructure.</li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>To create and secure your account, and keep you logged in between visits.</li>
              <li>To respond to enquiries submitted through the contact form.</li>
              <li>To track course access — your free trial period and whether you've paid to continue.</li>
              <li>To confirm and record payments made through Flutterwave.</li>
              <li>To improve this website and the services described on it.</li>
            </ul>

            <h2>What we don't do</h2>
            <ul>
              <li>We don't sell your information to third parties.</li>
              <li>We don't use your contact form or account details for advertising.</li>
              <li>We don't run advertising trackers or third-party analytics cookies on this site.</li>
            </ul>

            <h2>The captcha on this site</h2>
            <p>
              Our sign-up, sign-in, and contact forms use a captcha we generate ourselves — a
              distorted image of letters and numbers. It doesn't use any third-party service like
              Google reCAPTCHA, and it doesn't collect any personal information; it's purely a
              server-generated image and a short-lived code.
            </p>

            <h2>Data retention</h2>
            <p>
              Account, enrollment, and contact form data is kept for as long as your account is
              active or as needed to provide the service, unless you ask us to delete it.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us to access, correct, or delete your account and any information you've
              submitted through this site by emailing{' '}
              <a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a>.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can go to{' '}
              <a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a>{' '}
              or +1 949-662-7869.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
