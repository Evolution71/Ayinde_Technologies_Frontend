import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { StatusBadge, formatDate, money, errorText, useDialog } from '../ui';

export default function ConsoleDashboard() {
  const { me } = useConsole();
  const navigate = useNavigate();
  const { alert } = useDialog();
  const [data, setData] = useState(null);

  useEffect(() => {
    consoleApi
      .stats()
      .then(setData)
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = (me.first_name || me.full_name || '').split(' ')[0];

  const cards = [
    { icon: 'fa-solid fa-spinner', tone: 'blue', label: 'Active Projects', value: data?.active_projects ?? '—' },
    { icon: 'fa-solid fa-code-pull-request', tone: 'orange', label: 'Pending Requests', value: data?.pending_requests ?? '—' },
    { icon: 'fa-regular fa-comments', tone: 'navy', label: 'Unread Messages', value: data?.unread_messages ?? '—' },
    { icon: 'fa-solid fa-file-invoice-dollar', tone: 'green', label: 'Pending Payments', value: data ? money(data.pending_payments) : '—' },
  ];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 className="welcome-title">Welcome to the Console, {firstName}! 🚀</h2>
        <p className="welcome-sub">Here is the latest snapshot of client activity and pending operations.</p>
      </div>

      {/* Stats row */}
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="dash-card" key={c.label}>
            <div className="stat-widget">
              <div className={`stat-icon ${c.tone}`}>
                <i className={c.icon} />
              </div>
              <div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="split-grid">
        {/* Recent service requests */}
        <div className="dash-card">
          <div className="card-heading">
            <h3>Recent Service Requests</h3>
            <Link to="/console/service-requests" className="card-link">View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 500 }}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th className="center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_requests?.length ? (
                  data.recent_requests.map((r) => (
                    <tr key={r.id}>
                      <td className="cell-title">{r.client_name}</td>
                      <td className="muted" style={{ textTransform: 'capitalize' }}>{r.service_type}</td>
                      <td>{formatDate(r.created_at)}</td>
                      <td className="center">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="dt-empty">No recent service requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent client messages */}
        <div className="dash-card">
          <div className="card-heading">
            <h3>Recent Messages</h3>
            <Link to="/console/messages" className="card-link">Inbox</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.recent_messages?.length ? (
              data.recent_messages.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className={`recent-item ${m.is_read ? '' : 'unread'}`}
                  onClick={() => navigate('/console/messages')}
                >
                  <span className="avatar-soft">
                    <i className="fa-solid fa-user" />
                  </span>
                  <span style={{ overflow: 'hidden', flexGrow: 1 }}>
                    <div className="subject">{m.subject}</div>
                    <div className="from">From: {m.client_name}</div>
                  </span>
                </button>
              ))
            ) : (
              <div className="dt-empty">No recent messages.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
