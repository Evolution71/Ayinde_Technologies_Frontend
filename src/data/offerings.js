// Copy for the three offering pages: Build, Automate and Plan.
//
// Prices, tier names and feature lists are NOT written here. They come from
// src/lib/servicePlans.js (SERVICE_CATALOG), which mirrors the server's price
// table in service_pricing.py. Change a price there, not here.
//
// Each category lists the catalog services it sells under `catalogKeys`.

export const CATEGORY_ORDER = ['build', 'automate', 'plan'];

export const CATEGORIES = {
  build: {
    key: 'build',
    path: '/build',
    navLabel: 'Build: Digital Products',
    eyebrow: 'BUILD',
    pageTitle: 'Build: Websites and Digital Products',
    headline: 'Build a website that turns visitors into customers',
    intro:
      'Websites built to a written scope, launched on a clear plan, and supported after go-live. You know the price and what it includes before we start.',
    problem:
      'Most businesses either pay for a template that does not fit how they sell, or hire a team that disappears once the site is live. Updates then wait weeks, and the site slowly goes out of date.',
    outcome:
      'A site that explains what you do in the first few seconds, works well on phones, can be updated each month without a developer, and has one team to call when something needs changing.',
    howWeWork: [
      {
        title: 'Scope',
        text: 'We write down the pages, features, content you will supply and what success looks like. You sign off on this before design starts.',
      },
      {
        title: 'Design',
        text: 'You review the layout on desktop and phone before any development. Changes at this stage cost nothing extra.',
      },
      {
        title: 'Build and test',
        text: 'We build the site, then check every page on phones and desktops, every form submission and the SSL certificate.',
      },
      {
        title: 'Launch and support',
        text: 'We go live, then use your monthly update hours on the priorities you choose: new pages, offers, images or integrations.',
      },
    ],
    services: [
      {
        catalogKey: 'website',
        id: 'websites',
        name: 'Business websites',
        summary:
          'A business website with the pages you need to win enquiries: what you offer, who you help, proof of your work and a clear way to get in touch. Every package includes design, development, mobile testing and the monthly update hours shown on each plan.',
        whoItsFor:
          'Service businesses, consultants, shops that want to sell online, and any business that needs a credible online presence that the team can keep up to date.',
        highlights: [
          'Designed mobile-first and tested on phones and tablets',
          'Pages written around your enquiries, not generic filler',
          'Monthly update hours so content stays current',
          'SSL certificate included in every plan',
          'Higher plans add e-commerce, blogs, analytics and AI chat',
        ],
      },
    ],
    bundle: {
      catalogKey: 'premium',
      id: 'complete-solution',
      name: 'Complete solution: website and app together',
      summary:
        'For businesses that want one partner for both the public website and the customer app. Supreme VIP Platinum covers website and application development in one package, with enterprise support and a dedicated account manager.',
      whoItsFor:
        'Growing companies that need a website and a mobile app working together, and want one team accountable for both.',
      highlights: [
        'Website and application development in one package',
        'Enterprise support with rapid bug fixes and priority features',
        'Latest AI functions and chatbot capabilities',
        'Dedicated account manager and quarterly strategy reviews',
        'Monetisation support: deployment through to first revenue',
        'Pay monthly, quarterly, annually or 50% down',
      ],
    },
    cta: {
      title: 'Not sure which website fits your business?',
      text: 'Tell us what you sell and who buys it. We will recommend a package and tell you what it will not include.',
      primary: { label: 'Start your project', to: '/start-project' },
      secondary: { label: 'Talk to us', to: '/contact' },
    },
  },

  automate: {
    key: 'automate',
    path: '/automate',
    navLabel: 'Automate: Business Tools',
    eyebrow: 'AUTOMATE',
    pageTitle: 'Automate: Business Apps and Tools',
    headline: 'Automate the work your team repeats every day',
    intro:
      'Mobile and web apps that handle bookings, payments, customer data and internal approvals, so your team spends its time on work that needs judgement.',
    problem:
      'Spreadsheets, manual follow-ups and tools that do not talk to each other slow every process down. Each new customer adds more manual work, and mistakes creep in when the same data is typed twice.',
    outcome:
      'One connected system with live data, automatic notifications and a dashboard that shows what is happening without a status meeting.',
    howWeWork: [
      {
        title: 'Map the process',
        text: 'We follow one process from start to finish: who does each step, what data is needed, and where mistakes happen today.',
      },
      {
        title: 'Prototype the core flow',
        text: 'We build the main screens first, so your team can test the real workflow before the full build.',
      },
      {
        title: 'Build and connect',
        text: 'We set up the backend, database, user sign-in, notifications and payments, and connect them to the tools you already use.',
      },
      {
        title: 'Measure and improve',
        text: 'Your monthly or weekly update hours go to the next most valuable change, guided by the dashboard data.',
      },
    ],
    services: [
      {
        catalogKey: 'application',
        id: 'apps',
        name: 'Apps and business tools',
        summary:
          'Native iOS and Android apps, with a backend that stores your data, signs users in, sends notifications and takes payments. Higher plans add real-time data sync, analytics dashboards, social integration and cross-platform builds.',
        whoItsFor:
          'Businesses that want customers or staff to use an app, and teams that need internal tools to replace spreadsheets and manual approvals.',
        highlights: [
          'Native iOS and Android apps, cross-platform on higher plans',
          'Secure user sign-in and a managed database',
          'Push notifications for customers or staff',
          'App Store submission included',
          'In-app payments and real-time data sync on the Professional plan and above',
          'Analytics dashboards to see what is happening without manual reports',
        ],
      },
    ],
    cta: {
      title: 'Know which process to automate first?',
      text: 'Book a consultation and we will map the process, estimate the time it saves and tell you what to build first.',
      primary: { label: 'Book a consultation', to: '/plan' },
      secondary: { label: 'Talk to us', to: '/contact' },
    },
  },

  plan: {
    key: 'plan',
    path: '/plan',
    navLabel: 'Plan: Consulting',
    eyebrow: 'PLAN',
    pageTitle: 'Plan: Technology Consulting',
    headline: 'Get a clear plan before you spend on code',
    intro:
      'Expert consulting by the hour, ending in a written recommendation you can use with any developer, including us.',
    problem:
      'Many technology projects fail before the first line of code, because the scope was never agreed. Teams build the wrong feature first, or buy a tool the business does not need.',
    outcome:
      'A decision you can act on: what to build, in what order, what it should cost, and what to leave out for now.',
    howWeWork: [
      {
        title: 'Discovery call',
        text: 'We learn your goals, the tools you use today, your team and your budget.',
      },
      {
        title: 'Assessment',
        text: 'We review your current systems and processes, and list the options with their trade-offs.',
      },
      {
        title: 'Written recommendation',
        text: 'You receive a report with the options, our recommendation, the rough cost and the order to do things in.',
      },
      {
        title: 'Follow-up',
        text: 'We answer questions after the report and check the roadmap as your plans change.',
      },
    ],
    services: [
      {
        catalogKey: 'consultation',
        id: 'consulting',
        name: 'Technology consulting',
        summary:
          'One-on-one sessions with an expert, billed by the hour. Each package has a minimum number of hours. You pay for the hours you book, rounded up to the next full hour.',
        whoItsFor:
          'Business owners and managers who need an independent view before they hire a developer, buy software or commit budget to a project.',
        highlights: [
          'Discovery and assessment of your current systems',
          'Written recommendations with options and trade-offs',
          'Basic project roadmap, or an implementation roadmap on Enterprise',
          'Follow-up questions answered by email',
          'Weekly check-ins and a dedicated consultant on Enterprise',
        ],
      },
    ],
    cta: {
      title: 'Ready to plan your next project?',
      text: 'Choose a consultation package and pick the hours. If you are unsure how many you need, start with the Starter package.',
      primary: { label: 'See consultation packages', to: '#packages' },
      secondary: { label: 'Talk to us', to: '/contact' },
    },
  },
};
