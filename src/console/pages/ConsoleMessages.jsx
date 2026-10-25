import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, Field, Modal, errorText, formatDateTime, useDialog } from '../ui';

export default function ConsoleMessages() {
  const { refreshStats } = useConsole();
  const { alert, confirm } = useDialog();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState(null); // message open in the View & Reply modal
  const [reply, setReply] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcast, setBroadcast] = useState({ subject: '', message: '' });
  const [broadcasting, setBroadcasting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    consoleApi
      .messages()
      .then((res) => setMessages(res.items))
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  const openThread = async (msg) => {
    setThread(msg);
    const cleanSubject = msg.subject || '';
    setReply({ subject: cleanSubject.startsWith('Re:') ? cleanSubject : `Re: ${cleanSubject}`, message: '' });

    // Mark incoming unread messages as read (same as the PHP view)
    if (msg.sender === 'client' && !msg.is_read) {
      try {
        await consoleApi.markMessageRead(msg.id);
        setMessages((rows) => rows.map((r) => (r.id === msg.id ? { ...r, is_read: true } : r)));
        setThread((t) => (t && t.id === msg.id ? { ...t, is_read: true } : t));
        refreshStats();
      } catch {
        /* non-blocking */
      }
    }
  };

  const closeThread = () => {
    setThread(null);
    setReply({ subject: '', message: '' });
  };

  const sendReply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await consoleApi.sendMessage({
        client_id: thread.client_id,
        subject: reply.subject.trim(),
        message: reply.message.trim(),
      });
      closeThread();
      await alert({ icon: 'success', title: 'Sent!', text: res.message });
      load();
      refreshStats();
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setSending(false);
    }
  };

  const sendBroadcast = async (e) => {
    e.preventDefault();
    const ok = await confirm({
      title: 'Send to all clients?',
      text: 'This message will appear in the dashboard of every registered client.',
      confirmText: 'Yes, send it',
    });
    if (!ok) return;
    setBroadcasting(true);
    try {
      const res = await consoleApi.broadcastMessage({
        subject: broadcast.subject.trim(),
        message: broadcast.message.trim(),
      });
      setBroadcastOpen(false);
      setBroadcast({ subject: '', message: '' });
      await alert({ icon: 'success', title: 'Broadcast Sent!', text: res.message });
      load();
      refreshStats();
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setBroadcasting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'direction',
        label: 'Direction',
        render: (m) =>
          m.sender === 'client' ? (
            <span className="muted">
              <i className="fa-solid fa-arrow-down" style={{ marginRight: 6 }} />
              Incoming
            </span>
          ) : (
            <span className="muted">
              <i className="fa-solid fa-arrow-up" style={{ marginRight: 6 }} />
              Outgoing
            </span>
          ),
      },
      {
        key: 'client',
        label: 'Client',
        sortable: true,
        sortValue: (m) => m.client_name,
        render: (m) => m.client_name,
      },
      {
        key: 'subject',
        label: 'Subject',
        sortable: true,
        sortValue: (m) => m.subject,
        render: (m) => {
          const unread = m.sender === 'client' && !m.is_read;
          return (
            <span className={unread ? 'strong' : ''} style={{ fontWeight: unread ? 800 : 500 }}>
              {m.subject}
              {unread && <span className="new-badge">NEW</span>}
            </span>
          );
        },
      },
      {
        key: 'date',
        label: 'Date',
        sortable: true,
        sortValue: (m) => m.created_at || '',
        render: (m) => formatDateTime(m.created_at),
      },
      {
        key: 'action',
        label: 'Action',
        center: true,
        render: (m) => (
          <button type="button" className="btn btn-table" onClick={() => openThread(m)}>
            View
          </button>
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
          <h2>Message Center</h2>
          <p>Communicate with individual clients or send network-wide broadcasts.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setBroadcastOpen(true)}>
            <i className="fa-solid fa-bullhorn" /> Send Broadcast
          </button>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading messages...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={messages}
            rowKey={(m) => m.id}
            defaultSortKey="date"
            searchPlaceholder="Search messages..."
            emptyText="No messages yet."
            rowClassName={(m) => (m.sender === 'client' && !m.is_read ? 'is-unread' : '')}
            searchText={(m) => `${m.client_name} ${m.subject} ${m.sender}`}
          />
        )}
      </div>

      {/* View & Reply */}
      <Modal open={!!thread} title="Message Thread" onClose={closeThread}>
        {thread && (
          <>
            <div className="thread-meta">
              <div>
                <div className="thread-kicker">{thread.sender === 'client' ? 'Message From:' : 'Message To:'}</div>
                <div className="thread-name">{thread.client_name}</div>
              </div>
              <div className="thread-date">{formatDateTime(thread.created_at)}</div>
            </div>
            <div className="thread-subject">{thread.subject}</div>
            <div className="thread-body">{thread.message}</div>

            <div className="reply-title">Send Reply</div>
            <form onSubmit={sendReply}>
              <Field label="Subject" required htmlFor="reply-subject">
                <input
                  id="reply-subject"
                  className="input"
                  type="text"
                  required
                  value={reply.subject}
                  onChange={(e) => setReply({ ...reply, subject: e.target.value })}
                />
              </Field>
              <Field label="Message" required htmlFor="reply-message">
                <textarea
                  id="reply-message"
                  className="input"
                  required
                  rows={4}
                  value={reply.message}
                  onChange={(e) => setReply({ ...reply, message: e.target.value })}
                />
              </Field>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  <i className={sending ? 'fa-solid fa-spinner spin' : 'fa-solid fa-paper-plane'} />
                  {sending ? ' Sending...' : ' Send Reply'}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      {/* Broadcast */}
      <Modal open={broadcastOpen} title="Send Broadcast Message" onClose={() => setBroadcastOpen(false)}>
        <div className="notice">
          <i className="fa-solid fa-triangle-exclamation" />
          <span>This message will be delivered to the internal dashboards of ALL registered clients.</span>
        </div>
        <form onSubmit={sendBroadcast}>
          <Field label="Subject" required htmlFor="bc-subject">
            <input
              id="bc-subject"
              className="input"
              type="text"
              required
              placeholder="e.g., Important Platform Update"
              value={broadcast.subject}
              onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
            />
          </Field>
          <Field label="Message" required htmlFor="bc-message">
            <textarea
              id="bc-message"
              className="input"
              required
              rows={6}
              placeholder="Type your announcement here..."
              value={broadcast.message}
              onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
            />
          </Field>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setBroadcastOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={broadcasting}>
              <i className={broadcasting ? 'fa-solid fa-spinner spin' : 'fa-solid fa-bullhorn'} />
              {broadcasting ? ' Broadcasting...' : ' Send Broadcast'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
