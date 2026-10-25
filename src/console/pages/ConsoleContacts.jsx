import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, Modal, errorText, formatDateTime, useDialog } from '../ui';

export default function ConsoleContacts() {
  const { refreshStats } = useConsole();
  const { alert, confirm } = useDialog();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    consoleApi
      .contacts()
      .then((res) => setContacts(res.items))
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  const view = async (contact) => {
    setActive(contact);
    if (!contact.is_read) {
      try {
        await consoleApi.markContactRead(contact.id);
        setContacts((rows) => rows.map((r) => (r.id === contact.id ? { ...r, is_read: true } : r)));
        refreshStats();
      } catch {
        /* non-blocking */
      }
    }
  };

  const remove = async (contact) => {
    const ok = await confirm({
      title: 'Delete this message?',
      text: 'This action cannot be undone.',
      confirmText: 'Yes, delete it!',
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await consoleApi.deleteContact(contact.id);
      setContacts((rows) => rows.filter((r) => r.id !== contact.id));
      refreshStats();
      alert({ icon: 'success', title: 'Deleted!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'visitor',
        label: 'Visitor Details',
        sortable: true,
        sortValue: (c) => c.name,
        render: (c) => (
          <>
            <div className="cell-title">{c.name}</div>
            <div className="cell-sub">{c.email}</div>
          </>
        ),
      },
      {
        key: 'subject',
        label: 'Subject',
        sortable: true,
        sortValue: (c) => c.subject,
        render: (c) => (
          <span style={{ fontWeight: c.is_read ? 500 : 800 }}>
            {c.subject}
            {!c.is_read && <span className="new-badge">NEW</span>}
          </span>
        ),
      },
      {
        key: 'date',
        label: 'Date Received',
        sortable: true,
        sortValue: (c) => c.created_at || '',
        render: (c) => formatDateTime(c.created_at),
      },
      {
        key: 'actions',
        label: 'Actions',
        center: true,
        render: (c) => (
          <div className="actions actions-end">
            <button type="button" className="btn btn-table" onClick={() => view(c)}>
              <i className="fa-solid fa-eye" /> View
            </button>
            <button type="button" className="icon-btn danger" title="Delete" onClick={() => remove(c)}>
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h2>Contact Submissions</h2>
          <p>Review and manage inquiries submitted from the public website.</p>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading submissions...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={contacts}
            rowKey={(c) => c.id}
            defaultSortKey="date"
            searchPlaceholder="Search submissions..."
            emptyText="No submissions yet."
            rowClassName={(c) => (c.is_read ? '' : 'is-unread')}
            searchText={(c) => `${c.name} ${c.email} ${c.subject} ${c.company || ''}`}
          />
        )}
      </div>

      <Modal open={!!active} title="Contact Message" onClose={() => setActive(null)}>
        {active && (
          <>
            <div className="thread-meta">
              <div>
                <div className="thread-kicker">From:</div>
                <div className="thread-name">{active.name}</div>
                <div className="cell-sub">{active.email}</div>
              </div>
              <div className="thread-date">{formatDateTime(active.created_at)}</div>
            </div>

            {(active.phone || active.company) && (
              <div className="detail-grid">
                {active.phone && (
                  <div>
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{active.phone}</div>
                  </div>
                )}
                {active.company && (
                  <div>
                    <div className="detail-label">Company</div>
                    <div className="detail-value">{active.company}</div>
                  </div>
                )}
              </div>
            )}

            <div className="thread-subject">{active.subject}</div>
            <div className="thread-body">{active.message}</div>

            <div className="form-actions split" style={{ marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setActive(null)}>
                Close
              </button>
              <a
                className="btn btn-primary"
                href={`mailto:${active.email}?subject=${encodeURIComponent(`Re: ${active.subject}`)}`}
              >
                <i className="fa-solid fa-reply" /> Reply via Email
              </a>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

