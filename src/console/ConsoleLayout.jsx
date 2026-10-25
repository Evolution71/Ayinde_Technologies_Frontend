/**
 * Admin console shell: login guard, sidebar, topbar and the page outlet.
 * Markup and class names follow the PHP admin dashboard (sidebar.php, topbar.php).
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { consoleApi, ConsoleApiError } from './consoleApi';
import { DialogProvider, initialsOf } from './ui';
import './console.css';

const FONT_AWESOME = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

const ConsoleContext = createContext(null);

export const useConsole = () => {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error('useConsole must be used inside ConsoleLayout');
  return ctx;
};

const NAV = [
  {
    label: 'Overview',
    items: [{ to: '/console', end: true, icon: 'fa-solid fa-border-all', text: 'Dashboard' }],
  },
  {
    label: 'Client Services',
    items: [
      { to: '/console/projects', icon: 'fa-solid fa-bars-progress', text: 'Manage Projects' },
      { to: '/console/service-requests', icon: 'fa-solid fa-code-pull-request', text: 'Service Requests' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { to: '/console/messages', icon: 'fa-regular fa-comments', text: 'Client Messages', badge: 'messages' },
      { to: '/console/shared-files', icon: 'fa-solid fa-folder-open', text: 'Shared Files' },
    ],
  },
  {
    label: 'Website & Marketing',
    items: [
      { to: '/console/contacts', icon: 'fa-solid fa-address-book', text: 'Contact Submissions' },
      { to: '/console/newsletters', icon: 'fa-solid fa-users', text: 'Newsletter Subscribers' },
      { to: '/console/broadcasts', icon: 'fa-solid fa-bullhorn', text: 'Broadcast Emails' },
    ],
  },
];

const getToken = () => {
  try {
    return localStorage.getItem('ayinde_token');
  } catch {
    return null;
  }
};

export default function ConsoleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [gate, setGate] = useState({ status: 'loading', me: null, message: '' });
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Font Awesome is used by every console page (same CDN build as the PHP app)
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_AWESOME}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_AWESOME;
      document.head.appendChild(link);
    }
  }, []);

  // Login guard: must be signed in AND be an admin (ADMIN_EMAILS on the server)
  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return undefined;
    }
    let cancelled = false;
    consoleApi
      .me()
      .then((me) => !cancelled && setGate({ status: 'ok', me, message: '' }))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ConsoleApiError && err.status === 401) {
          navigate('/login', { replace: true, state: { from: location.pathname } });
        } else if (err instanceof ConsoleApiError && err.status === 403) {
          setGate({ status: 'forbidden', me: null, message: 'This area is for administrators only.' });
        } else {
          setGate({ status: 'error', me: null, message: err.message || 'Could not reach the server.' });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshStats = useCallback(() => {
    consoleApi.stats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (gate.status === 'ok') refreshStats();
  }, [gate.status, refreshStats, location.pathname]);

  // Close the mobile sidebar and the profile menu when the page changes
  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Click outside the profile dropdown closes it (same as the PHP dropdown)
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem('ayinde_token');
    } catch {
      /* ignore */
    }
    navigate('/login', { replace: true });
  };

  const contextValue = useMemo(
    () => ({ me: gate.me, stats, refreshStats }),
    [gate.me, stats, refreshStats]
  );

  if (gate.status === 'loading') {
    return (
      <div className="console-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-muted">Loading console...</p>
      </div>
    );
  }

  if (gate.status !== 'ok') {
    return (
      <div className="console-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="dash-card" style={{ maxWidth: 480, textAlign: 'center' }}>
          <div className="alert-icon">
            <i className="fa-solid fa-user-lock" style={{ color: '#ff7a1a' }} />
          </div>
          <div className="alert-title">Admin Console</div>
          <p className="alert-text">{gate.message}</p>
          <div className="alert-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
              Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const me = gate.me;
  const unread = stats?.unread_messages || 0;
  const fullName = me.full_name || me.email;

  return (
    <ConsoleContext.Provider value={contextValue}>
      <DialogProvider>
        <div className="console-app">
          <div className="dashboard-wrapper">
            <div
              className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* ── Sidebar (sidebar.php) ── */}
            <nav className={`sidebar ${sidebarOpen ? 'show' : ''}`} id="sidebar" aria-label="Admin navigation">
              <div className="sidebar-header">
                <NavLink to="/console" className="sidebar-brand" style={{ textDecoration: 'none' }}>
                  <img src="/logo-mark.svg" alt="AyindeTech Icon" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
                  Admin Panel
                </NavLink>
                <button type="button" className="close-sidebar-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="sidebar-nav">
                {NAV.map((group) => (
                  <React.Fragment key={group.label}>
                    <div className="nav-label">{group.label}</div>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                      >
                        <i className={item.icon} /> {item.text}
                        {item.badge === 'messages' && (
                          <span className="nav-badge" style={{ display: unread > 0 ? undefined : 'none' }}>
                            {unread}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="sidebar-footer">
                <NavLink to="/console/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <i className="fa-solid fa-user-shield" /> Admin Settings
                </NavLink>
                <button type="button" className="nav-item text-danger" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket" /> Sign Out
                </button>
              </div>
            </nav>

            {/* ── Main column ── */}
            <main className="main-content">
              {/* ── Topbar (topbar.php) ── */}
              <header className="topbar">
                <div className="topbar-left">
                  <button type="button" className="hamburger-btn" onClick={() => setSidebarOpen((v) => !v)} aria-label="Open menu">
                    <i className="fa-solid fa-bars-staggered" />
                  </button>
                  <h1 className="topbar-title">Admin Console</h1>
                </div>

                <div className="topbar-right">
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => navigate('/console/messages')}
                    aria-label={`Client messages${unread ? `, ${unread} unread` : ''}`}
                  >
                    <i className="fa-regular fa-bell" />
                    {unread > 0 && <span className="action-badge">{unread}</span>}
                  </button>

                  <div className="profile-dropdown-wrapper" ref={profileRef}>
                    <div
                      className="user-profile"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileOpen((v) => !v);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && setProfileOpen((v) => !v)}
                    >
                      <div className="avatar">{initialsOf(fullName)}</div>
                      <div className="user-info">
                        <span className="user-name">
                          {fullName} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem', marginLeft: 4, color: 'var(--color-text-muted)' }} />
                        </span>
                        <span className="user-role">{me.email}</span>
                      </div>
                    </div>

                    <div className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                      <NavLink to="/console/settings" className="profile-menu-item">
                        <i className="fa-solid fa-user-shield" /> Admin Settings
                      </NavLink>
                      <div className="profile-dropdown-divider" />
                      <button type="button" className="profile-menu-item text-danger" onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <div className="content-area">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </DialogProvider>
    </ConsoleContext.Provider>
  );
}