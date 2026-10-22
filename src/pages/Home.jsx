import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/site-base.css';
import '../styles/home-page.css';
import { api } from '../api';
import Captcha from '../components/Captcha';
import { SERVICE_PLANS } from '../lib/servicePlans';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
    overlay: null,
    badge: 'badge-orange', dot: 'bg-warning',
    kicker: 'Business Automation • EST 2026',
    title: ['Technology Partner,', 'Not Just a Vendor'],
    desc: 'Ayinde Technologies helps businesses automate operations with a clear plan before code, and support after launch. East + West Coast coverage.',
    cta: 'Book Strategy Call', to: '/contact',
    note: 'With Albert A.D. Cabrera, CEO',
  },
  {
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop',
    overlay: 'linear-gradient(120deg, rgba(10,34,72,0.95) 0%, rgba(14,47,97,0.8) 100%)',
    badge: 'badge-blue', dot: 'bg-info',
    kicker: 'Strategy • Build • Implement',
    title: ['Plan Before', 'You Build'],
    desc: 'We work through a business plan with you before touching a keyboard, from the first working MVP to production-ready AI apps and websites.',
    cta: 'View Services', to: '/our-services',
    note: 'Website • Mobile • Desktop',
  },
  {
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop',
    overlay: 'linear-gradient(45deg, rgba(10,34,72,0.95) 0%, rgba(11,30,61,0.9) 100%)',
    badge: 'badge-orange', dot: 'bg-white',
    kicker: 'Enterprise Ready',
    title: ['Support After', 'Launch'],
    desc: 'All-in-one enterprise solutions with advanced AI integration, a dedicated account manager, and flexible payments. We stay through rollout.',
    cta: 'Explore Premium', to: '/premium-services',
    note: 'Dedicated Support • Flexible Terms',
  },
];

const MARQUEE_ITEMS = [
  'AI APPS & WEBSITES', 'TECH CONSULTING', 'ONLINE COURSES', 'ENTERPRISE AUTOMATION', 'STRATEGY • BUILD • IMPLEMENT',
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);

  // Scroll to hash on mount or when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // PHP design fonts, loaded only while the Home page is open
  useEffect(() => {
    const id = 'ayinde-home-fonts';
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap';
      document.head.appendChild(link);
    }
    return () => link.remove();
  }, []);

  // Fetch interspersed team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ NEW: Use interspersed team members (male and female alternating)
        const response = await api.getInterspersedTeamMembers();
        console.log('[Home] Interspersed team response:', response);

        setTeamMembers(response);
        console.log('[Home] Loaded interspersed team members:', response.length);

      } catch (err) {
        console.error('[Home] Error fetching team:', err);
        setError(err.message);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Load NextivaCX widget on demand
  const openChat = () => {
    // Load NextivaCX widget script
    if (!document.getElementById('nextivacx-code-snippet')) {
      const script = document.createElement('script');
      script.id = 'nextivacx-code-snippet';
      script.src = 'https://d3po7etsbw5eiv.cloudfront.net/Simplify360Chat.js?key=NmFjNTAyYTgxODk3OWMxODM2NjllNzY0fDQzNDYyMzg=';
      document.body.appendChild(script);
    }

    // Trigger the chat widget to open
    setTimeout(() => {
      if (window.simplify360Chat) {
        window.simplify360Chat.open();
      }
    }, 500);
  };


  const [category, setCategory] = useState('website');
  const [contactStatus, setContactStatus] = useState('idle'); // idle | sending | sent
  const [contactError, setContactError] = useState('');
  const captchaRef = useRef(null);
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((n) => (n + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const quoteRef = useRef(null);
  const quoteIndex = useRef(0);

  // Quote slider: one slide at a time, auto-advance every 5s
  const quoteSlides = () => (quoteRef.current ? quoteRef.current.querySelectorAll('.custom-quote-slide') : []);
  const showQuote = (i) => {
    quoteSlides().forEach((el, k) => { el.style.display = k === i ? 'block' : 'none'; });
    quoteIndex.current = i;
  };
  const nextQuote = () => { const n = quoteSlides().length || 1; showQuote((quoteIndex.current + 1) % n); };
  const prevQuote = () => { const n = quoteSlides().length || 1; showQuote((quoteIndex.current - 1 + n) % n); };
  useEffect(() => {
    showQuote(0);
    const t = setInterval(nextQuote, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Plan cards use the same prices as the service pages and checkout
  const PLAN_CARDS = {
    website: { to: '/website-development', items: Object.values(SERVICE_PLANS.website.plans) },
    mobile: { to: '/app-development', items: Object.values(SERVICE_PLANS.application.plans) },
  };

  const renderPlans = (cat) => {
    const { to, items } = PLAN_CARDS[cat];
    return items.map((plan, i) => {
      const premium = i === items.length - 1;
      return (
        <div className="col-md-6 col-xl-3" key={plan.name}>
          <div className={premium ? 'plan-card premium-card' : 'plan-card'}>
            <div className={`small fw-bold tracking-widest ${premium ? 'text-white-50' : 'text-secondary'}`}>
              {plan.name.replace(/^(Website|App Development) /, '').toUpperCase()}
            </div>
            <div className="plan-price">${plan.basePrice.toLocaleString()}<span className="fs-6 fw-normal">/month</span></div>
            <button type="button" className={`btn w-100 rounded-pill mt-auto ${premium ? 'btn-light text-dark fw-bold' : 'btn-dark'}`} onClick={() => navigate(to)}>
              Choose plan
            </button>
          </div>
        </div>
      );
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setContactError('');
    setContactStatus('sending');
    try {
      await api.submitContactForm({
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        subject: String(data.get('interest') || 'General inquiry'),
        message: `Phone: ${data.get('phone') || ''}\n\n${data.get('message') || ''}`,
        captcha_token: captchaRef.current ? captchaRef.current.getToken() : null,
        captcha_answer: captchaRef.current ? captchaRef.current.getAnswer() : null,
      });
      setContactStatus('sent');
      form.reset();
      if (captchaRef.current) captchaRef.current.refresh();
    } catch (err) {
      setContactStatus('idle');
      setContactError(err.message || 'Could not send your message. Please try again.');
      if (captchaRef.current) captchaRef.current.refresh();
    }
  };

  return (
    <div className="ayinde-site home-page" style={{ minHeight: '100vh', backgroundColor: '#F8FAFF' }}>
      {/* ========== HERO (PHP design: three-slide carousel) ========== */}
      <section id="home" className="hero-section p-0">
        <div className="carousel slide hero-carousel">
          <div className="carousel-inner">
            {HERO_SLIDES.map((slide, i) => (
              <div key={slide.title} className={`carousel-item${heroSlide === i ? ' active' : ''}`}>
                <div className="hero-bg" style={{ backgroundImage: `url('${slide.image}')` }} />
                <div className="hero-overlay" style={slide.overlay ? { background: slide.overlay } : undefined} />
                <div className="container h-100 position-relative z-3">
                  <div className="row h-100 align-items-center">
                    <div className="col-lg-8 hero-content">
                      <span className={`badge-custom ${slide.badge} text-white bg-white bg-opacity-10 border border-light mb-4`}>
                        <span className={`rounded-circle ${slide.dot} d-inline-block me-2`} style={{ width: 8, height: 8 }} /> {slide.kicker}
                      </span>
                      <h1 className="hero-title display-font">{slide.title.map((line, n) => (<React.Fragment key={n}>{n > 0 && <br />}{line}</React.Fragment>))}</h1>
                      <p className="hero-desc">{slide.desc}</p>
                      <div className="d-flex align-items-center gap-3 flex-wrap mt-4">
                        <Link to={slide.to} className="btn-accent">{slide.cta} ↗</Link>
                        <span className="text-white-50 small">{slide.note}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {HERO_SLIDES.map((slide, i) => (
              <button key={slide.title[0]} type="button" className={heroSlide === i ? 'active' : ''} aria-label={`Slide ${i + 1}`} aria-current={heroSlide === i ? 'true' : undefined} onClick={() => setHeroSlide(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== MARQUEE ========== */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
          {[0, 1].map((k) => (
            <div className="marquee-item" key={k} aria-hidden={k === 1}>
              {MARQUEE_ITEMS.map((t) => (
                <React.Fragment key={t}><span>{t}</span><div className="marquee-dot" /></React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

  <section id="about">
    <div className="container">
      <div className="row g-5 align-items-start">
        <div className="col-lg-7">
          <span className="badge-custom badge-navy mb-4">Our Story</span>
          <h2 className="display-font fs-1 mb-4">A technology partner for businesses that want more than a delivered product.</h2>
          <div className="text-secondary lh-lg mb-5" style={{fontSize: 16}}>
            <p><strong className="text-dark">Built around one idea: technology should follow a plan, not replace one.</strong></p>
            <p>Ayinde Technologies started from a simple observation: most businesses don't fail at technology because the code is bad — they fail because the app, website, or AI feature they paid for was never the right thing to build in the first place.</p>
            <p>So we work in three stages instead of one. We <b>guide</b> sitting down with a business, marketing, or proposal plan before touching a keyboard. We <b>build</b> AI applications and websites, from a first working version through to something production-ready. And we <b>implement</b> — staying involved through rollout, so the team that has to run the thing we built actually can.</p>
            <p>We're also a straightforward consulting practice for teams that need the strategy conversation on its own, without a build attached to it.</p>
          </div>
          <div className="quote-box">
            <p className="fs-4 fst-italic mb-2 position-relative z-3">"We'd rather spend a week on the right plan than a month building the wrong product."</p>
            <div className="small text-white-50 fw-bold letter-spacing-1 position-relative z-3 mt-3">— HOW WE WORK PRINCIPLE #1</div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="row g-4">
            <div className="col-sm-6 col-lg-12">
              <div className="feature-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="feature-number text-primary">01</div>
                  <i className="fa-solid fa-clipboard-list text-primary fs-4 opacity-50" />
                </div>
                <h4 className="h5 fw-bold mb-2">Plan first</h4>
                <p className="text-secondary small mb-0">We'd rather spend a week on the right plan than a month building the wrong product.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-12">
              <div className="feature-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="feature-number text-success">02</div>
                  <i className="fa-solid fa-handshake text-success fs-4 opacity-50" />
                </div>
                <h4 className="h5 fw-bold mb-2">Stay hands-on</h4>
                <p className="text-secondary small mb-0">Delivery isn't the finish line - we stick around through rollout and adoption.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-12">
              <div className="feature-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="feature-number text-warning">03</div>
                  <i className="fa-solid fa-graduation-cap text-warning fs-4 opacity-50" />
                </div>
                <h4 className="h5 fw-bold mb-2">Teach as we go</h4>
                <p className="text-secondary small mb-0">Through our tutoring courses, we help teams build the skills to maintain what we hand off.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-12">
              <div className="feature-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="feature-number text-danger">04</div>
                  <i className="fa-solid fa-comments text-danger fs-4 opacity-50" />
                </div>
                <h4 className="h5 fw-bold mb-2">Be straightforward</h4>
                <p className="text-secondary small mb-0">Clear proposals, clear pricing, clear next steps — no jargon standing in for a plan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Services Section */}
  <section id="services" className="services-section">
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-4">
        <div>
          <span className="badge-custom badge-blue mb-3">SERVICES • AJAX PRICING</span>
          <h2 className="display-font fs-1 mb-0">Website, Mobile, Desktop, and<br />Strategy that ships.</h2>
        </div>
        <div className="service-tabs" id="categoryTabs">
          <button type="button" className={"service-tab-btn" + (category === "website" ? " active" : "")} onClick={() => setCategory("website")}>Website</button>
          <button type="button" className={"service-tab-btn" + (category === "mobile" ? " active" : "")} onClick={() => setCategory("mobile")}>Mobile</button>
        </div>
      </div>
      {/* Dynamic Services Content container */}
      <div id="servicesContent" className="row g-4">{renderPlans(category)}</div>
    </div>
  </section>
  {/* Premium Enterprise Section */}
  <section id="premium" className="enterprise-section">
    <div className="container" style={{maxWidth: 1280}}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <span className="badge-custom badge-orange text-white bg-white bg-opacity-10 border border-light mb-4">
            <span className="rounded-circle bg-warning d-inline-block me-2" style={{width: 8, height: 8}} /> PREMIUM • ENTERPRISE SOLUTION
          </span>
          <h2 className="display-font display-5 fw-bold mb-4">All-in-one enterprise solution with AI built in.</h2>
          <p className="text-white-50 fs-6 mb-5 lh-lg">One contract, one team, one stack — website, app, desktop, and AI that talks to each other. Flexible payments, dedicated manager, and we stay through adoption.</p>
          <ul className="list-unstyled row g-3 mb-5">
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> All-in-one Enterprise Suite</li>
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> Advanced AI Integration</li>
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> Enterprise Support 24/7</li>
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> Dedicated Account Manager</li>
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> Flexible Payment Options</li>
            <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1" /> White-label &amp; On-Prem</li>
          </ul>
          <div className="d-flex flex-wrap gap-3">
            <a href="/services/premium" className="btn btn-light rounded-pill px-4 py-3 fw-bold">Request Enterprise Demo →</a>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="glass-panel">
            <div className="d-flex justify-content-between mb-4 border-bottom border-secondary pb-3">
              <span className="text-white-50 small fw-bold tracking-widest">PLAN COMPARISON</span>
              <span className="badge bg-warning text-dark">Billed Flexibly</span>
            </div>
            <table className="table table-borderless text-white mb-0">
              <thead>
                <tr className="text-white-50 small">
                  <th>FEATURE</th>
                  <th>STANDARD</th>
                  <th className="text-warning">PREMIUM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-bottom border-secondary border-opacity-25">
                  <td className="py-3 text-primary-50">AI Integration</td>
                  <td className="py-3">Basic</td>
                  <td className="py-3 fw-bold">Advanced + Eval</td>
                </tr>
                <tr className="border-bottom border-secondary border-opacity-25">
                  <td className="py-3 text-primary-50">Support</td>
                  <td className="py-3">Email</td>
                  <td className="py-3 fw-bold">Dedicated + 24/7</td>
                </tr>
                <tr className="border-bottom border-secondary border-opacity-25">
                  <td className="py-3 text-primary-50">Revisions</td>
                  <td className="py-3">3 rounds</td>
                  <td className="py-3 fw-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 text-primary-50">Ownership</td>
                  <td className="py-3">License</td>
                  <td className="py-3 fw-bold">Full IP + On-prem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Products Section */}
  <section id="products">
    <div className="container" style={{maxWidth: 1280}}>
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-4">
        <div>
          <span className="badge-custom badge-navy mb-3">PRODUCTS • SAAS</span>
          <h2 className="display-font fs-1 mb-0">Built for teams that run<br />the business after launch.</h2>
        </div>
        <p className="text-secondary max-w-[400px] mb-0" style={{maxWidth: 400}}>Request access or visit product pages to register. Each product works standalone or as the all-in-one suite.</p>
      </div>
      <div className="row g-4">
        {/* Product 1: HR-Wise */}
        <div className="col-md-6 col-xl-3">
          <div className="product-card">
            <div className="product-icon"><i className="fa-solid fa-users-gear text-info" /></div>
            <div className="text-primary small fw-bold tracking-widest mb-2">HR MANAGEMENT</div>
            <h4 className="h5 fw-bold mb-3">HR-Wise</h4>
            <p className="text-secondary small mb-4 flex-grow-1">Streamline applicant tracking, automated onboarding, compliance, and employee performance seamlessly.</p>
            <div className="d-flex gap-2 mt-auto">
              <a href="#products" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</a>
            </div>
          </div>
        </div>
        {/* Product 2: Verus-POS */}
        <div className="col-md-6 col-xl-3">
          <div className="product-card">
            <div className="product-icon"><i className="fa-solid fa-cash-register text-blue" /></div>
            <div className="text-primary small fw-bold tracking-widest mb-2">POINT OF SALE</div>
            <h4 className="h5 fw-bold mb-3">Verus-POS</h4>
            <p className="text-secondary small mb-4 flex-grow-1">Blazing-fast POS software. Sync inventory across locations, process payments securely, and view live sales analytics.</p>
            <div className="d-flex gap-2 mt-auto">
              <a href="#products" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</a>
            </div>
          </div>
        </div>
        {/* Product 3: Exactus */}
        <div className="col-md-6 col-xl-3">
          <div className="product-card">
            <div className="product-icon"><i className="fa-solid fa-file-invoice-dollar text-orange" /></div>
            <div className="text-primary small fw-bold tracking-widest mb-2">PAYROLL &amp; ACCOUNTING</div>
            <h4 className="h5 fw-bold mb-3">Exactus</h4>
            <p className="text-secondary small mb-4 flex-grow-1">IRS-compliant payroll. Automate tax calculations, manage direct deposits, and track overtime flawlessly.</p>
            <div className="d-flex gap-2 mt-auto">
              <a href="#products" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</a>
            </div>
          </div>
        </div>
        {/* Product 4: Inventro */}
        <div className="col-md-6 col-xl-3">
          <div className="product-card">
            <div className="product-icon"><i className="fa-solid fa-boxes-stacked text-blue" /></div>
            <div className="text-primary small fw-bold tracking-widest mb-2">INVENTORY MANAGEMENT</div>
            <h4 className="h5 fw-bold mb-3">Inventro</h4>
            <p className="text-secondary small mb-4 flex-grow-1">Master your supply chain. Track stock in real-time, automate low-stock alerts, and forecast demand.</p>
            <div className="d-flex gap-2 mt-auto">
              <a href="#products" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Courses Section (Fixed: Static HTML implementation for guaranteed rendering) */}
  <section id="courses" className="courses-section">
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-4">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle" style={{width: 40, height: 40}}>
            <i className="fa-solid fa-play" />
          </div>
          <h2 className="display-font fs-2 mb-0">Free courses — YouTube tutorials</h2>
        </div>
        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">6 lessons • Free forever</span>
      </div>
      <div className="row g-4">
        {/* Course 1 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">BEGINNER • 42 MIN</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Intro to AI Apps</h5>
              <p className="text-secondary small mb-4">How we scope an AI feature that actually gets used. Prompts, evals, and rollout checklist.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
        {/* Course 2 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">BEGINNER • 1H 18M</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Website Dev Fundamentals</h5>
              <p className="text-secondary small mb-4">From Figma to production Next.js. Performance, SEO, and CMS patterns we use at Ayinde.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
        {/* Course 3 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">INTERMEDIATE • 58 MIN</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Business Automation</h5>
              <p className="text-secondary small mb-4">Automate proposals, invoicing, and client onboarding without writing a full backend.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
        {/* Course 4 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">INTERMEDIATE • 2H 04M</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Mobile App with Flutter</h5>
              <p className="text-secondary small mb-4">Build iOS + Android from one codebase, ship to stores, and monitor crashes.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
        {/* Course 5 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">ADVANCED • 1H 32M</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Desktop Apps with Electron</h5>
              <p className="text-secondary small mb-4">Packaging, auto-updates, code-signing, and handling offline data for enterprise.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
        {/* Course 6 */}
        <div className="col-md-6 col-lg-4">
          <div className="course-card">
            <div className="course-thumbnail">
              <div className="course-badge">ALL LEVELS • 37 MIN</div>
              <div className="play-btn"><i className="fa-solid fa-play ms-1" /></div>
            </div>
            <div className="p-4">
              <h5 className="fw-bold mb-2">Tech Consulting Framework</h5>
              <p className="text-secondary small mb-4">Our Strategy • Build • Implement framework. How to write proposals clients actually sign.</p>
              <button type="button" onClick={() => navigate('/our-courses')} className="btn btn-dark btn-sm rounded-pill px-4">Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* === Custom Quotes Section (No Bootstrap Carousel) === */}
  <section className="bg-light text-center border-top border-bottom py-5">
    <div className="container" style={{maxWidth: 1000}}>
      <span className="badge-custom badge-navy mb-5">QUOTES</span>
      <div id="customQuoteSlider" ref={quoteRef} style={{position: 'relative', minHeight: 250}}>
        {/* Slide 1 */}
        <div className="custom-quote-slide" style={{display: 'block'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/emad-mostaque.webp" alt="Emad Mustad" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"In a few years, everyone will have their own personal AI — just like we all have smartphones today."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Emad Mustad</div>
              <div className="text-secondary small">Stability AI Founder</div>
            </div>
          </div>
        </div>
        {/* Slide 2 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/google-ceo.webp" alt="Sundar Pichai" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"Artificial intelligence will have a more profound impact on humanity than fire, electricity and the internet."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Sundar Pichai</div>
              <div className="text-secondary small">CEO, Google</div>
            </div>
          </div>
        </div>
        {/* Slide 3 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/john-chambers.webp" alt="John Chambers" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"If you don't innovate fast, disrupt your industry, disrupt yourself, you'll be left behind."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>John Chambers</div>
              <div className="text-secondary small">Chairman Emeritus of Cisco &amp; CEO of JC2 Ventures</div>
            </div>
          </div>
        </div>
        {/* Slide 4 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/jensen-huang.webp" alt="Jensen Huang" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"You're not going to lose your job to an AI, but you're going to lose your job to someone who uses AI."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Jensen Huang</div>
              <div className="text-secondary small">CEO, NVIDIA</div>
            </div>
          </div>
        </div>
        {/* Slide 5 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/bill-gates.jpg" alt="Bill Gates" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"If Your Business Is Not On The Internet Then Your Business Will Be Out Of Business."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Bill Gates</div>
              <div className="text-secondary small">Co-founder, Microsoft</div>
            </div>
          </div>
        </div>
        {/* Slide 6 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/jeff-bezos.jpg" alt="Jeff Bezos" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"If you don't understand the details of your business, you are going to fail."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Jeff Bezos</div>
              <div className="text-secondary small">Founder, Amazon</div>
            </div>
          </div>
        </div>
        {/* Slide 7 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/elon-musk.webp" alt="Elon Musk" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"When something is important enough, you do it even if the odds are not in your favor."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Elon Musk</div>
              <div className="text-secondary small">CEO, Tesla &amp; SpaceX</div>
            </div>
          </div>
        </div>
        {/* Slide 8 */}
        <div className="custom-quote-slide" style={{display: 'none'}}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
            <img src="/img/tori-burch.webp" alt="Tori Burch" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', flexShrink: 0}} />
            <div className="text-center text-md-start">
              <h3 className="display-font fs-3 mb-3" style={{color: 'var(--color-navy)'}}>"If it doesn't scare you, you're probably not dreaming big enough."</h3>
              <div className="fw-bold" style={{color: 'var(--color-navy)'}}>Tori Burch</div>
              <div className="text-secondary small">Fashion Entrepreneur and Founder</div>
            </div>
          </div>
        </div>
        {/* Buttons MUST be at the end, right before the closing div */}
        <button className="quote-control prev-quote" onClick={prevQuote} aria-label="Previous Quote"><i className="fa-solid fa-chevron-left" /></button>
        <button className="quote-control next-quote" onClick={nextQuote} aria-label="Next Quote"><i className="fa-solid fa-chevron-right" /></button>
      </div>
    </div>
  </section>
  <br /><br />
  {/* Contact Section */}
  <section id="contact" className="contact-section">
    <div className="container" style={{maxWidth: 1280}}>
      <button type="button" onClick={openChat} className="btn btn-outline-light rounded-pill px-4 mb-4"><i className="fa-solid fa-comments me-2" />Chat with us</button>
      <div className="row g-5 align-items-start">
        <div className="col-lg-7">
          <span className="badge-custom text-white-50 border border-secondary mb-4">CONTACT • EAST &amp; WEST COAST</span>
          <h2 className="display-font display-5 fw-bold mb-5">Let's map the right plan before we build.</h2>
          <form className="contact-form" id="contactForm" onSubmit={handleContactSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input type="text" className="form-control" name="name" placeholder="Your name" required />
              </div>
              <div className="col-md-6">
                <input type="email" className="form-control" name="email" placeholder="Email" required />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <select name="interest" className="form-select" defaultValue="">
                  <option value disabled>What are you looking for?</option>
                  <option>Website Development</option>
                  <option>Mobile App</option>
                  <option>Desktop App</option>
                  <option>Tech Consultation</option>
                  <option>Premium Enterprise</option>
                </select>
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" name="phone" placeholder="Phone number" required />
              </div>
            </div>
            <div className="mb-4">
              <textarea className="form-control" name="message" placeholder="Tell us about your business goal, not just the feature..." required defaultValue={""} />
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16, color: '#0A2248', margin: '8px 0' }}><Captcha ref={captchaRef} /></div>
            <button type="submit" className="btn btn-light rounded-pill px-4 py-3 fw-bold w-100" id="submitBtn" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? 'Message Sent — We\'ll reply in 24h' : 'Send Message →'}</button>
                {contactError && <p className="text-danger small mt-2 mb-0">{contactError}</p>}
            <p className="text-white-50 small mt-3 text-center mb-0">CEO Albert A.D. Cabrera • info@ayindetechnologies.com • 949-662-7869</p>
          </form>
        </div>
        <div className="col-lg-5">
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-lg-12">
              <div className="contact-card">
                <div className="text-secondary small fw-bold tracking-widest mb-2">EAST COAST HQ</div>
                <h5 className="fw-bold">Newark, DE</h5>
                <p className="small text-secondary mb-0">254 Chapman Rd, Ste. 208<br />Newark, DE 19702, USA</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-12">
              <div className="contact-card-dark">
                <div className="text-white-50 small fw-bold tracking-widest mb-2">WEST COAST LAB</div>
                <h5 className="fw-bold">Inglewood, CA</h5>
                <p className="small text-white-50 mb-0">12 S Market St, Ste. 1008<br />Inglewood, CA 90301, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
      {!loading && teamMembers.length > 0 && (
      <div id="team" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Team
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
          {!loading && teamMembers.length > 0 ? (
            teamMembers.map((member, i) => (
              <div key={i}
                style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(10,34,72,0.08)'
                }}
              >
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>{member.image || '👤'}</div>
                <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>
                  {member.name}
                </h3>
                <p style={{ color: '#0A2248', marginBottom: '10px', fontWeight: '500' }}>
                  {member.title}
                </p>
                {member.quote && (
                  <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
                    "{member.quote}"
                  </p>
                )}
              </div>
            ))
          ) : loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999' }}>Loading team members...</p>
            </div>
          ) : error ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#d32f2f' }}>Error loading team: {error}</p>
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999' }}>Team members will appear here once added to the backend.</p>
            </div>
          )}
        </div>
      </div>

      )}
    </div>
  );
};

export default Home;
