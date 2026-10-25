import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, errorText, formatDate, useDialog } from '../ui';

export default function ConsoleNewsletters() {
  const { refreshStats } = useConsole();
  const { alert, confirm } = useDialog();
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    consoleApi
      .subscribers()
      .then((res) => {
        setSubscribers(res.items);
        setTotal(res.total);
      })
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (sub) => {
    const ok = await confirm({
      title: 'Remove this subscriber?',
      text: 'They will no longer receive broadcast emails.',
      confirmText: 'Yes, remove them!',
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await consoleApi.deleteSubscriber(sub.id);
      setSubscribers((rows) => rows.filter((r) => r.id !== sub.id));
      setTotal((t) => Math.max(0, t - 1));
      refreshStats();
      alert({ icon: 'success', title: 'Removed!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'email',
        label: 'Email Address',
        sortable: true,
        sortValue: (s) => s.email,
        render: (s) => (
          <div className="row-flex">
            <div className="avatar-soft">
              <i className="fa-solid fa-envelope" />
            </div>
            <div>{s.email}</div>
          </div>
        ),
      },
      {
        key: 'date',
        label: 'Date Subscribed',
        sortable: true,
        sortValue: (s) => s.created_at || '',
        render: (s) => formatDate(s.created_at),
      },
      {
        key: 'actions',
        label: 'Actions',
        center: true,
        render: (s) => (
          <div className="actions actions-end">
            <a className="icon-btn" href={`mailto:${s.email}`} title="Email directly">
              <i className="fa-solid fa-paper-plane" />
            </a>
            <button type="button" className="icon-btn danger" title="Remove from list" onClick={() => remove(s)}>
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
          <h2>Newsletter Subscribers</h2>
          <p>Manage your mailing list collected from the public website.</p>
        </div>
        <div className="header-actions">
          <div className="counter-pill">
            <i className="fa-solid fa-users" style={{ marginRight: 8 }} />
            Total: {total}
          </div>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading subscribers...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={subscribers}
            rowKey={(s) => s.id}
            defaultSortKey="date"
            searchPlaceholder="Search emails..."
            emptyText="No subscribers found."
            searchText={(s) => s.email}
          />
        )}
      </div>
    </>
  );
}
