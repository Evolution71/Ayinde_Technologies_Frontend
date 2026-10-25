import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, Field, Modal, errorText, formatDate, money, useDialog } from '../ui';

export default function ConsoleServiceRequests() {
  const { refreshStats } = useConsole();
  const { alert, confirm } = useDialog();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    consoleApi
      .serviceRequests()
      .then((res) => setRequests(res.items))
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  const open = (req) => {
    setActive(req);
    setAmount('');
  };

  const close = () => {
    setActive(null);
    setAmount('');
  };

  const removeRow = (id) => setRequests((rows) => rows.filter((r) => r.id !== id));

  const approve = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) {
      alert({ icon: 'error', title: 'Error', text: 'Enter an amount greater than 0.' });
      return;
    }
    setBusy(true);
    try {
      const res = await consoleApi.approveRequest(active.id, value);
      const id = active.id;
      close();
      removeRow(id);
      refreshStats();
      alert({ icon: 'success', title: 'Approved!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    const ok = await confirm({
      title: 'Are you sure?',
      text: 'This will permanently cancel the service request.',
      confirmText: 'Yes, reject it!',
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await consoleApi.rejectRequest(active.id);
      const id = active.id;
      close();
      removeRow(id);
      refreshStats();
      alert({ icon: 'success', title: 'Rejected', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'client',
        label: 'Client',
        sortable: true,
        sortValue: (r) => r.client_name,
        render: (r) => (
          <>
            <div className="cell-title">{r.client_name}</div>
            <div className="cell-sub">{r.client_email}</div>
          </>
        ),
      },
      {
        key: 'service',
        label: 'Service Details',
        render: (r) => (
          <>
            <div style={{ textTransform: 'capitalize' }}>{r.service_type}</div>
            <div className="cell-sub">Ref: {r.tracking_reference}</div>
          </>
        ),
      },
      {
        key: 'date',
        label: 'Date Submitted',
        sortable: true,
        sortValue: (r) => r.created_at || '',
        render: (r) => formatDate(r.created_at),
      },
      {
        key: 'actions',
        label: 'Actions',
        center: true,
        render: (r) => (
          <button type="button" className="btn btn-table" onClick={() => open(r)}>
            <i className="fa-solid fa-check" /> Process
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h2>Service Requests</h2>
          <p>Review new project requests, assign pricing, and generate invoices.</p>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading requests...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={requests}
            rowKey={(r) => r.id}
            defaultSortKey="date"
            searchPlaceholder="Search requests..."
            emptyText="No pending service requests."
            searchText={(r) => `${r.client_name} ${r.client_email} ${r.service_type} ${r.tracking_reference}`}
          />
        )}
      </div>

      <Modal open={!!active} title="Process Service Request" onClose={close}>
        {active && (
          <>
            <div className="detail-grid">
              <div>
                <div className="detail-label">Client</div>
                <div className="detail-value">{active.client_name}</div>
              </div>
              <div>
                <div className="detail-label">Service Requested</div>
                <div className="detail-value" style={{ textTransform: 'capitalize' }}>{active.service_type}</div>
              </div>
            </div>

            {active.details && (
              <div className="thread-body" style={{ marginBottom: 24 }}>
                {active.details}
              </div>
            )}

            <form onSubmit={approve}>
              <Field
                label="Assign Price / Generate Invoice ($)"
                required
                htmlFor="amount"
                hint={`Approving this will shift the project to "Active" and generate a pending invoice for the client.${
                  amount ? ` Invoice: ${money(amount)}` : ''
                }`}
              >
                <div className="input-icon">
                  <i className="fa-solid fa-dollar-sign" />
                  <input
                    id="amount"
                    className="input"
                    type="number"
                    required
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </Field>

              <div className="form-actions split" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-danger-outline" onClick={reject} disabled={busy}>
                  Reject
                </button>
                <div className="spread">
                  <button type="button" className="btn btn-outline" onClick={close} disabled={busy}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    <i className={busy ? 'fa-solid fa-spinner spin' : 'fa-solid fa-check'} />
                    {busy ? ' Processing...' : ' Approve & Invoice'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}
