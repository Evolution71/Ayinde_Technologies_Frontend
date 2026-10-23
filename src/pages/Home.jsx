import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/site-base.css';
import '../styles/home-page.css';
import { api } from '../api';
import Captcha from '../components/Captcha';
import NewsletterSection from '../components/NewsletterSection';
import useSiteStyles from '../hooks/useSiteStyles';

const MAX_HERO_SLIDES = 3;

// Pull the 11-character video id out of a YouTube watch, youtu.be, shorts or embed link.
const youtubeVideoId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

// Exact course price in the course's own currency, as stored in the database.
const formatCoursePrice = (price, currency = 'USD') => {
  const n = Number(price);
  if (!Number.isFinite(n)) return '';
  if (n === 0) return 'Free';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
};

const Home = () => {
  useSiteStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [ytCourses, setYtCourses] = useState([]);
  // YouTube lessons linked to paid courses. If the request fails the section is hidden, never faked.
  useEffect(() => {
    let alive = true;
    api
      .getYoutubeCourses()
      .then((data) => {
        if (alive) setYtCourses(Array.isArray(data?.courses) ? data.courses : []);
      })
      .catch(() => {
        if (alive) setYtCourses([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const [error, setError] = useState(null);

  // Hero carousel: advances every 5 seconds, like the PHP design
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((n) => (n + 1) % MAX_HERO_SLIDES), 5000);
    return () => clearInterval(t);
  }, []);

  // Service plans: loaded from the backend (GET /api/services/tiers/{type})
  const [serviceType, setServiceType] = useState('website');
  const [tiers, setTiers] = useState([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setTiersLoading(true);
    api.getServiceTiers(serviceType)
      .then((res) => { if (!cancelled) setTiers(Array.isArray(res?.tiers) ? res.tiers : []); })
      .catch((err) => { console.error('[Home] Could not load plans:', err); if (!cancelled) setTiers([]); })
      .finally(() => { if (!cancelled) setTiersLoading(false); });
    return () => { cancelled = true; };
  }, [serviceType]);

  const planRoute = serviceType === 'website' ? '/website-development' : '/app-development';
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return 'Custom';
    return `${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/month`;
  };

  // Contact form (sent to the backend with the captcha)
  const [contactStatus, setContactStatus] = useState('idle'); // idle | sending | sent
  const [contactError, setContactError] = useState('');
  const captchaRef = useRef(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setContactError('');
    setContactStatus('sending');
    try {
      await api.submitContactForm({
        name: String(data.get('full_name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        subject: String(data.get('department') || 'General inquiry'),
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

  // Quote slider: one slide at a time, auto-advance every 5 seconds
  const quoteRef = useRef(null);
  const quoteIndex = useRef(0);
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

  // Scroll to hash on mount or when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Fetch interspersed team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ NEW: Use interspersed team members (male and female alternating)
        const response = await api.getInterspersedTeamMembers();

        setTeamMembers(response);

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


  return (
    <div className="ayinde-site home-page" style={{ minHeight: '100vh', backgroundColor: '#F8FAFF' }}>
          <section id="home" className="hero-section p-0">
              <div id="heroCarousel" className="carousel slide hero-carousel">
                  <div className="carousel-inner">
                      {/* Slide 1 */}
                      <div className={`carousel-item${heroSlide === 0 ? ' active' : ''}`}>
                          <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')" }}></div>
                          <div className="hero-overlay"></div>
                          <div className="container h-100 position-relative z-3">
                              <div className="row h-100 align-items-center">
                                  <div className="col-lg-8 hero-content">
                                      <span className="badge-custom badge-orange text-white bg-white bg-opacity-10 border border-light mb-4">
                                          <span className="rounded-circle bg-warning d-inline-block me-2" style={{ width: "8px", height: "8px" }}></span> Business Automation • EST 2026
                                      </span>
                                      <h1 className="hero-title display-font">Technology Partner,<br />Not Just a Vendor</h1>
                                      <p className="hero-desc">Ayinde Technologies helps businesses automate operations with a clear plan before code, and support after launch. East + West Coast coverage.</p>
                                      <div className="d-flex align-items-center gap-3 flex-wrap mt-4">
                                          <Link to="/contact" className="btn-accent">Book Strategy Call ↗</Link>
                                          <span className="text-white-50 small">With Albert A.D. Cabrera, CEO</span>
                                      </div>

                                      {/* NEW PLACEMENT: Carousel Indicators (Dots) directly below the buttons */}
                                      <div className="carousel-indicators">
                                          <button type="button" className={heroSlide === 0 ? 'active' : undefined} onClick={() => setHeroSlide(0)} aria-label="Slide 1"></button>
                                          <button type="button" className={heroSlide === 1 ? 'active' : undefined} onClick={() => setHeroSlide(1)} aria-label="Slide 2"></button>
                                          <button type="button" className={heroSlide === 2 ? 'active' : undefined} onClick={() => setHeroSlide(2)} aria-label="Slide 3"></button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      {/* Slide 2 */}
                      <div className={`carousel-item${heroSlide === 1 ? ' active' : ''}`}>
                          <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop')" }}></div>
                          <div className="hero-overlay" style={{ background: "linear-gradient(120deg, rgba(10,34,72,0.95) 0%, rgba(14,47,97,0.8) 100%)" }}></div>
                          <div className="container h-100 position-relative z-3">
                              <div className="row h-100 align-items-center">
                                  <div className="col-lg-8 hero-content">
                                      <span className="badge-custom badge-blue text-white bg-white bg-opacity-10 border border-light mb-4">
                                          <span className="rounded-circle bg-info d-inline-block me-2" style={{ width: "8px", height: "8px" }}></span> Strategy • Build • Implement
                                      </span>
                                      <h1 className="hero-title display-font">Plan Before<br />You Build</h1>
                                      <p className="hero-desc">We guide sitting down with a business plan before touching a keyboard. From first working MVP to production-ready AI apps & websites.</p>
                                      <div className="d-flex align-items-center gap-3 flex-wrap mt-4">
                                          <Link to="/our-services" className="btn-accent">View Services ↗</Link>
                                          <span className="text-white-50 small">Website • Mobile • Desktop</span>
                                      </div>

                                      {/* NEW PLACEMENT: Carousel Indicators (Dots) directly below the buttons */}
                                      <div className="carousel-indicators">
                                          <button type="button" className={heroSlide === 0 ? 'active' : undefined} onClick={() => setHeroSlide(0)} aria-label="Slide 1"></button>
                                          <button type="button" className={heroSlide === 1 ? 'active' : undefined} onClick={() => setHeroSlide(1)} aria-label="Slide 2"></button>
                                          <button type="button" className={heroSlide === 2 ? 'active' : undefined} onClick={() => setHeroSlide(2)} aria-label="Slide 3"></button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      {/* Slide 3 */}
                      <div className={`carousel-item${heroSlide === 2 ? ' active' : ''}`}>
                          <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')" }}></div>
                          <div className="hero-overlay" style={{ background: "linear-gradient(45deg, rgba(10,34,72,0.95) 0%, rgba(11,30,61,0.9) 100%)" }}></div>
                          <div className="container h-100 position-relative z-3">
                              <div className="row h-100 align-items-center">
                                  <div className="col-lg-8 hero-content">
                                      <span className="badge-custom badge-orange text-white bg-white bg-opacity-10 border border-light mb-4">
                                          <span className="rounded-circle bg-white d-inline-block me-2" style={{ width: "8px", height: "8px" }}></span> Enterprise Ready
                                      </span>
                                      <h1 className="hero-title display-font">Support After<br />Launch</h1>
                                      <p className="hero-desc">All-in-one enterprise solutions with advanced AI integration, dedicated account manager, and flexible payments. We stay through rollout.</p>
                                      <div className="d-flex align-items-center gap-3 flex-wrap mt-4">
                                          <Link to="/premium-services" className="btn-accent">Explore Premium ↗</Link>
                                          <span className="text-white-50 small">Dedicated Support • Flexible Terms</span>
                                      </div>

                                      {/* NEW PLACEMENT: Carousel Indicators (Dots) directly below the buttons */}
                                      <div className="carousel-indicators">
                                          <button type="button" className={heroSlide === 0 ? 'active' : undefined} onClick={() => setHeroSlide(0)} aria-label="Slide 1"></button>
                                          <button type="button" className={heroSlide === 1 ? 'active' : undefined} onClick={() => setHeroSlide(1)} aria-label="Slide 2"></button>
                                          <button type="button" className={heroSlide === 2 ? 'active' : undefined} onClick={() => setHeroSlide(2)} aria-label="Slide 3"></button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          {/* Marquee */}
          <div className="marquee-wrapper">
              <div className="marquee-content">
                  {/* Repeated blocks for infinite scroll */}
                  <div className="marquee-item">
                      <span>AI APPS & WEBSITES</span><div className="marquee-dot"></div>
                      <span>TECH CONSULTING</span><div className="marquee-dot"></div>
                      <span>ONLINE COURSES</span><div className="marquee-dot"></div>
                      <span>ENTERPRISE AUTOMATION</span><div className="marquee-dot"></div>
                      <span>STRATEGY • BUILD • IMPLEMENT</span><div className="marquee-dot"></div>
                  </div>
                  <div className="marquee-item">
                      <span>AI APPS & WEBSITES</span><div className="marquee-dot"></div>
                      <span>TECH CONSULTING</span><div className="marquee-dot"></div>
                      <span>ONLINE COURSES</span><div className="marquee-dot"></div>
                      <span>ENTERPRISE AUTOMATION</span><div className="marquee-dot"></div>
                      <span>STRATEGY • BUILD • IMPLEMENT</span><div className="marquee-dot"></div>
                  </div>
              </div>
          </div>

          {/* About Section */}
          <section id="about">
              <div className="container">
                  <div className="row g-5 align-items-start">
                      <div className="col-lg-7">
                          <span className="badge-custom badge-navy mb-4">Our Story</span>
                          <h2 className="display-font fs-1 mb-4">A technology partner for businesses that want more than a delivered product.</h2>
                          <div className="text-secondary lh-lg mb-5" style={{ fontSize: "16px" }}>
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
                                          <i className="fa-solid fa-clipboard-list text-primary fs-4 opacity-50"></i>
                                      </div>
                                      <h4 className="h5 fw-bold mb-2">Plan first</h4>
                                      <p className="text-secondary small mb-0">We'd rather spend a week on the right plan than a month building the wrong product.</p>
                                  </div>
                              </div>
                              <div className="col-sm-6 col-lg-12">
                                  <div className="feature-card">
                                      <div className="d-flex justify-content-between align-items-start">
                                          <div className="feature-number text-success">02</div>
                                          <i className="fa-solid fa-handshake text-success fs-4 opacity-50"></i>
                                      </div>
                                      <h4 className="h5 fw-bold mb-2">Stay hands-on</h4>
                                      <p className="text-secondary small mb-0">Delivery isn't the finish line - we stick around through rollout and adoption.</p>
                                  </div>
                              </div>
                              <div className="col-sm-6 col-lg-12">
                                  <div className="feature-card">
                                      <div className="d-flex justify-content-between align-items-start">
                                          <div className="feature-number text-warning">03</div>
                                          <i className="fa-solid fa-graduation-cap text-warning fs-4 opacity-50"></i>
                                      </div>
                                      <h4 className="h5 fw-bold mb-2">Teach as we go</h4>
                                      <p className="text-secondary small mb-0">Through our tutoring courses, we help teams build the skills to maintain what we hand off.</p>
                                  </div>
                              </div>
                              <div className="col-sm-6 col-lg-12">
                                  <div className="feature-card">
                                      <div className="d-flex justify-content-between align-items-start">
                                          <div className="feature-number text-danger">04</div>
                                          <i className="fa-solid fa-comments text-danger fs-4 opacity-50"></i>
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
      {/* ========== SERVICES (plans from the API) ========== */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-4">
            <div>
              <span className="badge-custom badge-blue mb-3">SERVICES • AJAX PRICING</span>
              <h2 className="display-font fs-1 mb-0">Website, Mobile, Desktop, and<br />Strategy that ships.</h2>
            </div>
            <div className="service-tabs" id="categoryTabs">
              <button type="button" className={`service-tab-btn${serviceType === 'website' ? ' active' : ''}`} onClick={() => setServiceType('website')}>Website</button>
              <button type="button" className={`service-tab-btn${serviceType === 'applications' ? ' active' : ''}`} onClick={() => setServiceType('applications')}>Mobile</button>
            </div>
          </div>

          <div id="servicesContent" className="row g-4">
            {tiersLoading && (
              <div className="col-12 text-center text-secondary py-5">Loading plans…</div>
            )}
            {!tiersLoading && tiers.length === 0 && (
              <div className="col-12 text-center text-secondary py-5">Plans will appear here once they are published.</div>
            )}
            {!tiersLoading && tiers.map((tier, i) => {
              const premium = /premium/i.test(tier.tier || '');
              const features = Array.isArray(tier.features) ? tier.features : [];
              return (
                <div className="col-md-6 col-xl-3" key={tier.id ?? i}>
                  <div className={premium ? 'plan-card premium-card' : 'plan-card'}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className={`small fw-bold tracking-widest ${premium ? 'text-white-50' : 'text-secondary'}`}>{String(tier.tier || '').toUpperCase()}</div>
                      {premium && <span className="badge bg-warning text-dark px-3 py-1 rounded-pill ms-2">POPULAR</span>}
                    </div>
                    <div className="plan-price">{formatPrice(tier.monthly_price)}</div>
                    <div className={`small ${premium ? 'text-white-50' : 'text-secondary'} mb-4`}>{tier.description || ''}</div>
                    <ul className="list-unstyled plan-features mb-5">
                      {features.map((feature, k) => (
                        <li key={k}><i className="fa-solid fa-check-circle" /> {feature}</li>
                      ))}
                    </ul>
                    <button type="button" className={`btn w-100 rounded-pill ${premium ? 'btn-light text-dark fw-bold' : 'btn-dark'} mt-auto`} onClick={() => navigate(planRoute)}>Choose {tier.tier}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

          {/* Premium Enterprise Section */}
          <section id="premium" className="enterprise-section">
              <div className="container" style={{ maxWidth: "1280px" }}>
                  <div className="row align-items-center g-5">
                      <div className="col-lg-6">
                          <span className="badge-custom badge-orange text-white bg-white bg-opacity-10 border border-light mb-4">
                              <span className="rounded-circle bg-warning d-inline-block me-2" style={{ width: "8px", height: "8px" }}></span> PREMIUM • ENTERPRISE SOLUTION
                          </span>
                          <h2 className="display-font display-5 fw-bold mb-4">All-in-one enterprise solution with AI built in.</h2>
                          <p className="text-white-50 fs-6 mb-5 lh-lg">One contract, one team, one stack — website, app, desktop, and AI that talks to each other. Flexible payments, dedicated manager, and we stay through adoption.</p>
                    
                          <ul className="list-unstyled row g-3 mb-5">
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> All-in-one Enterprise Suite</li>
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> Advanced AI Integration</li>
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> Enterprise Support 24/7</li>
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> Dedicated Account Manager</li>
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> Flexible Payment Options</li>
                              <li className="col-sm-6 d-flex align-items-start gap-2 text-white-50"><i className="fa-solid fa-check-circle text-orange mt-1"></i> White-label & On-Prem</li>
                          </ul>

                          <div className="d-flex flex-wrap gap-3">
                              <Link to="/premium-services" className="btn btn-light rounded-pill px-4 py-3 fw-bold">Request Enterprise Demo →</Link>
                          </div>
                      </div>
                
                      <div className="col-lg-6">
                          <div className="glass-panel">
                              <div className="d-flex justify-content-between mb-4 border-bottom border-secondary pb-3">
                                  <span className="text-white-50 small fw-bold tracking-widest">PLAN COMPARISON</span>
                                  <span className="badge bg-warning text-dark">Billed Flexibly</span>
                              </div>
                              <div className="table-responsive"><table className="table table-borderless text-white mb-0">
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
                              </table></div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* Products Section */}
          <section id="products">
              <div className="container" style={{ maxWidth: "1280px" }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-4">
                      <div>
                          <span className="badge-custom badge-navy mb-3">PRODUCTS • SAAS</span>
                          <h2 className="display-font fs-1 mb-0">Built for teams that run<br />the business after launch.</h2>
                      </div>
                      <p className="text-secondary max-w-[400px] mb-0" style={{ maxWidth: "400px" }}>Request access or visit product pages to register. Each product works standalone or as the all-in-one suite.</p>
                  </div>

                  <div className="row g-4">
                      {/* Product 1: HR-Wise */}
                      <div className="col-md-6 col-xl-3">
                          <div className="product-card">
                              <div className="product-icon"><i className="fa-solid fa-users-gear text-info"></i></div>
                              <div className="text-primary small fw-bold tracking-widest mb-2">HR MANAGEMENT</div>
                              <h4 className="h5 fw-bold mb-3">HR-Wise</h4>
                              <p className="text-secondary small mb-4 flex-grow-1">Streamline applicant tracking, automated onboarding, compliance, and employee performance seamlessly.</p>
                              <div className="d-flex gap-2 mt-auto">
                                  <Link to="/hr-wise" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</Link>
                              </div>
                          </div>
                      </div>
                
                      {/* Product 2: Verus-POS */}
                      <div className="col-md-6 col-xl-3">
                          <div className="product-card">
                              <div className="product-icon"><i className="fa-solid fa-cash-register text-blue"></i></div>
                              <div className="text-primary small fw-bold tracking-widest mb-2">POINT OF SALE</div>
                              <h4 className="h5 fw-bold mb-3">Verus-POS</h4>
                              <p className="text-secondary small mb-4 flex-grow-1">Blazing-fast POS software. Sync inventory across locations, process payments securely, and view live sales analytics.</p>
                              <div className="d-flex gap-2 mt-auto">
                                  <Link to="/verus-pos" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</Link>
                              </div>
                          </div>
                      </div>
                
                      {/* Product 3: Exactus */}
                      <div className="col-md-6 col-xl-3">
                          <div className="product-card">
                              <div className="product-icon"><i className="fa-solid fa-file-invoice-dollar text-orange"></i></div>
                              <div className="text-primary small fw-bold tracking-widest mb-2">PAYROLL & ACCOUNTING</div>
                              <h4 className="h5 fw-bold mb-3">Exactus</h4>
                              <p className="text-secondary small mb-4 flex-grow-1">IRS-compliant payroll. Automate tax calculations, manage direct deposits, and track overtime flawlessly.</p>
                              <div className="d-flex gap-2 mt-auto">
                                  <Link to="/exactus" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</Link>
                              </div>
                          </div>
                      </div>
                
                      {/* Product 4: Inventro */}
                      <div className="col-md-6 col-xl-3">
                          <div className="product-card">
                              <div className="product-icon"><i className="fa-solid fa-boxes-stacked text-blue"></i></div>
                              <div className="text-primary small fw-bold tracking-widest mb-2">INVENTORY MANAGEMENT</div>
                              <h4 className="h5 fw-bold mb-3">Inventro</h4>
                              <p className="text-secondary small mb-4 flex-grow-1">Master your supply chain. Track stock in real-time, automate low-stock alerts, and forecast demand.</p>
                              <div className="d-flex gap-2 mt-auto">
                                  <Link to="/inventro" className="btn btn-dark btn-sm rounded-pill flex-grow-1">Request ↗</Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

                    {/* Courses Section: YouTube lessons linked to paid courses. Data comes from the API. */}
          {ytCourses.length > 0 && (
          <section id="courses" className="courses-section">
              <div className="container">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-4">
                      <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle" style={{ width: "40px", height: "40px" }}>
                              <i className="fa-solid fa-play"></i>
                          </div>
                          <h2 className="display-font fs-2 mb-0">Free courses — YouTube tutorials</h2>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">{ytCourses.length} lessons • Free forever</span>
                  </div>

                  <div className="row g-4">
                      {ytCourses.map((c) => {
                          const videoId = youtubeVideoId(c.youtube_url);
                          const thumbStyle = videoId
                              ? { backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg), linear-gradient(135deg, #0A2248, #2F9BFF)` }
                              : undefined;
                          const badge = [c.level, c.duration].filter(Boolean).join(' • ').toUpperCase();
                          return (
                              <div className="col-md-6 col-lg-4" key={c.id}>
                                  <article className="course-card h-100 d-flex flex-column">
                                      <div className="course-thumbnail" style={thumbStyle}>
                                          {badge && <div className="course-badge">{badge}</div>}
                                          {c.youtube_url && (
                                              <a href={c.youtube_url} target="_blank" rel="noopener noreferrer"
                                                 className="play-btn" aria-label={`Watch ${c.title} on YouTube`}>
                                                  <i className="fa-solid fa-play ms-1"></i>
                                              </a>
                                          )}
                                      </div>
                                      <div className="p-4 d-flex flex-column flex-grow-1">
                                          <h5 className="fw-bold mb-2">{c.title}</h5>
                                          {c.instructor && <p className="text-muted small mb-2">with {c.instructor}</p>}
                                          {c.description && <p className="text-secondary small mb-3">{c.description}</p>}
                                          {c.notes.length > 0 && (
                                              <ul className="yt-notes">
                                                  {c.notes.slice(0, 4).map((note) => <li key={note}>{note}</li>)}
                                              </ul>
                                          )}
                                          <div className="d-flex flex-wrap gap-2 mt-auto pt-3">
                                              {c.youtube_url && (
                                                  <a href={c.youtube_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm rounded-pill px-4">
                                                      Watch on YouTube <i className="fa-solid fa-arrow-up-right-from-square ms-1 small"></i>
                                                  </a>
                                              )}
                                              {c.youtube_live_url && (
                                                  <a href={c.youtube_live_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm rounded-pill px-3">
                                                      Join live <i className="fa-solid fa-arrow-up-right-from-square ms-1 small"></i>
                                                  </a>
                                              )}
                                              {c.practical_code_url && (
                                                  <a href={c.practical_code_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm rounded-pill px-3">
                                                      Practical code <i className="fa-solid fa-arrow-up-right-from-square ms-1 small"></i>
                                                  </a>
                                              )}
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
                                              <span className="yt-price">{formatCoursePrice(c.price, c.currency)}</span>
                                              <Link to={c.checkout_url || `/checkout/${c.id}`} className="btn-accent">Enrol now →</Link>
                                          </div>
                                      </div>
                                  </article>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </section>
          )}

          {/* === Custom Quotes Section (No Bootstrap Carousel) === */}
          <section className="bg-light text-center border-top border-bottom py-5">
              <div className="container" style={{ maxWidth: "1000px" }}>
                  <span className="badge-custom badge-navy mb-5">QUOTES</span>
            
                  <div id="customQuoteSlider" ref={quoteRef} style={{ position: "relative", minHeight: "250px" }}>
                
                      {/* Slide 1 */}
                      <div className="custom-quote-slide" style={{ display: "block" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/emad-mostaque.webp" alt="Emad Mustad" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"In a few years, everyone will have their own personal AI — just like we all have smartphones today."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Emad Mustad</div>
                                  <div className="text-secondary small">Stability AI Founder</div>
                              </div>
                          </div>
                      </div>
                
                      {/* Slide 2 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/google-ceo.webp" alt="Sundar Pichai" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"Artificial intelligence will have a more profound impact on humanity than fire, electricity and the internet."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Sundar Pichai</div>
                                  <div className="text-secondary small">CEO, Google</div>
                              </div>
                          </div>
                      </div>
                
                      {/* Slide 3 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/john-chambers.webp" alt="John Chambers" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"If you don't innovate fast, disrupt your industry, disrupt yourself, you'll be left behind."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>John Chambers</div>
                                  <div className="text-secondary small">Chairman Emeritus of Cisco & CEO of JC2 Ventures</div>
                              </div>
                          </div>
                      </div>
                
                      {/* Slide 4 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/jensen-huang.webp" alt="Jensen Huang" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"You're not going to lose your job to an AI, but you're going to lose your job to someone who uses AI."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Jensen Huang</div>
                                  <div className="text-secondary small">CEO, NVIDIA</div>
                              </div>
                          </div>
                      </div>

                      {/* Slide 5 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/bill-gates.jpg" alt="Bill Gates" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"If Your Business Is Not On The Internet Then Your Business Will Be Out Of Business."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Bill Gates</div>
                                  <div className="text-secondary small">Co-founder, Microsoft</div>
                              </div>
                          </div>
                      </div>

                      {/* Slide 6 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/jeff-bezos.jpg" alt="Jeff Bezos" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"If you don't understand the details of your business, you are going to fail."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Jeff Bezos</div>
                                  <div className="text-secondary small">Founder, Amazon</div>
                              </div>
                          </div>
                      </div>

                      {/* Slide 7 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/elon-musk.webp" alt="Elon Musk" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"When something is important enough, you do it even if the odds are not in your favor."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Elon Musk</div>
                                  <div className="text-secondary small">CEO, Tesla & SpaceX</div>
                              </div>
                          </div>
                      </div>
                
                      {/* Slide 8 */}
                      <div className="custom-quote-slide" style={{ display: "none" }}>
                          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 px-4">
                              <img src="img/tori-burch.webp" alt="Tori Burch" className="rounded-circle shadow" style={{ width: "120px", height: "120px", objectFit: "cover", flexShrink: "0" }} />
                              <div className="text-center text-md-start">
                                  <h3 className="display-font fs-3 mb-3" style={{ color: "var(--color-navy)" }}>"If it doesn't scare you, you're probably not dreaming big enough."</h3>
                                  <div className="fw-bold" style={{ color: "var(--color-navy)" }}>Tori Burch</div>
                                  <div className="text-secondary small">Fashion Entrepreneur and Founder</div>
                              </div>
                          </div>
                      </div>


                      {/* Buttons MUST be at the end, right before the closing div */}
                      <button className="quote-control prev-quote" onClick={prevQuote} aria-label="Previous Quote"><i className="fa-solid fa-chevron-left"></i></button>
                      <button className="quote-control next-quote" onClick={nextQuote} aria-label="Next Quote"><i className="fa-solid fa-chevron-right"></i></button>
                
                  </div>
              </div>
          </section>

      {/* ========== CONTACT (PHP design) ========== */}
      <section id="how-we-help" className="help-section">
        <div className="container">
          <div className="help-head">
            <span className="help-eyebrow">How we work with you</span>
            <h2 className="help-title">We build the site you need, then solve the problem behind it</h2>
            <p className="help-lead">
              A website only earns its place when it moves your business. Before we write a line of code we learn
              your customers, your goals and the problem to solve. We build it properly, launch it, and stay with you
              after launch.
            </p>
          </div>

          <div className="help-grid">
            <article className="help-card">
              <span className="help-num">01</span>
              <h3>Plan before code</h3>
              <p>We map your users, goals and processes into a written scope and a fixed price, so you know exactly what you are getting.</p>
            </article>
            <article className="help-card">
              <span className="help-num">02</span>
              <h3>Built around your business</h3>
              <p>Payments, bookings, dashboards, CRM and admin tools are designed around how you work, not forced into a template.</p>
            </article>
            <article className="help-card">
              <span className="help-num">03</span>
              <h3>Engineers who stay</h3>
              <p>Your product is built by our engineers and supported after launch, with 24/7 support, updates and monitoring.</p>
            </article>
            <article className="help-card">
              <span className="help-num">04</span>
              <h3>Solve the real problem</h3>
              <p>We track results such as leads, sales and hours saved, and keep improving until the product works for your customers.</p>
            </article>
          </div>

          <div className="help-compare">
            <h3 className="help-compare__title">Engineer-built or a basic AI-made site?</h3>
            <div className="table-responsive">
              <table className="table help-table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">What matters</th>
                    <th scope="col">Ayinde engineering team</th>
                    <th scope="col">Basic AI-generated site</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Planned around your business</th>
                    <td>Yes, scoped before the build</td>
                    <td>Generic layout and copy</td>
                  </tr>
                  <tr>
                    <th scope="row">Custom features and integrations</th>
                    <td>Yes, including payments and CRM</td>
                    <td>Limited to what the tool offers</td>
                  </tr>
                  <tr>
                    <th scope="row">Security and data handling</th>
                    <td>Designed in and reviewed by an engineer</td>
                    <td>Usually not reviewed by anyone</td>
                  </tr>
                  <tr>
                    <th scope="row">Support after launch</th>
                    <td>24/7 support and updates</td>
                    <td>Self-service only</td>
                  </tr>
                  <tr>
                    <th scope="row">Ownership of the code</th>
                    <td>Handed over to you</td>
                    <td>Depends on the platform</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="help-actions">
              <Link to="/start-project" className="btn-accent">Start your project ↗</Link>
              <Link to="/contact" className="help-link">Book a strategy call →</Link>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="contact-section">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-5 align-items-start">
            <div className="col-lg-7">
              <button type="button" onClick={openChat} className="btn btn-outline-light rounded-pill px-4 mb-4"><i className="fa-solid fa-comments me-2" />Chat with us</button>
              <span className="badge-custom text-white-50 border border-secondary mb-4">CONTACT • EAST & WEST COAST</span>
              <h2 className="display-font display-5 fw-bold mb-5">Let's map the right plan before we build.</h2>

              <form className="contact-form contactform" id="contactForm" onSubmit={handleContactSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <input type="text" name="full_name" className="form-control" placeholder="Your name" required />
                  </div>
                  <div className="col-md-6">
                    <input type="email" name="email" className="form-control" placeholder="Email" required />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <select className="form-select" name="department" defaultValue="" required>
                      <option value="" disabled>What are you looking for?</option>
                      <option>Website Development</option>
                      <option>Mobile App</option>
                      <option>Desktop App</option>
                      <option>Tech Consultation</option>
                      <option>Premium Enterprise</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="tel" name="phone" className="form-control" placeholder="Phone number" required />
                  </div>
                </div>
                <div className="mb-4">
                  <textarea className="form-control" name="message" placeholder="Tell us about your business goal, not just the feature..." required />
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, color: '#0A2248', margin: '8px 0' }}>
                  <Captcha ref={captchaRef} />
                </div>
                {contactError && <div className="alert alert-danger py-2 small">{contactError}</div>}
                {contactStatus === 'sent' && <div className="alert alert-success py-2 small">Thank you. We will reply within 24 hours.</div>}
                <button type="submit" className="btn btn-light rounded-pill px-4 py-3 fw-bold w-100" id="submitBtn" disabled={contactStatus === 'sending'}>
                  {contactStatus === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
                <p className="text-white-50 small mt-3 text-center mb-0">Sales +1-302-515-0227 • Support +1-201-534-2657 • info@ayindetechnologies.com</p>
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

      <NewsletterSection />

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