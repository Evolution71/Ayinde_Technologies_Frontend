import React, { useEffect, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { Field, RichTextEditor, errorText, useDialog } from '../ui';

const htmlToText = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || '').trim();
};

export default function ConsoleBroadcasts() {
  const { refreshStats } = useConsole();
  const { alert } = useDialog();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [recipients, setRecipients] = useState(null);

  useEffect(() => {
    consoleApi
      .subscribers()
      .then((res) => setRecipients(res.total))
      .catch(() => setRecipients(0));
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!htmlToText(body) && !body.includes('<img')) {
      alert({ icon: 'error', title: 'Error', text: 'The email body cannot be empty.' });
      return;
    }
    setSending(true);
    try {
      const res = await consoleApi.sendBroadcast({ subject: subject.trim(), message: body });
      setSubject('');
      setBody('');
      setRecipients(res.recipients ?? recipients);
      refreshStats();
      await alert({ icon: 'success', title: 'Broadcast Sent!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-title">
          <h2>Newsletter Broadcasts</h2>
          <p>Compose and send rich-text announcements and files to your public mailing list.</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="info-box">
          <div>
            <strong style={{ color: 'var(--color-navy)' }}>Target Audience: Newsletter Subscribers</strong>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>
              This will send a single email to everyone on the mailing list.
            </p>
          </div>
          <div className="counter-pill">
            {recipients === null ? '…' : recipients.toLocaleString('en-US')} Recipients
          </div>
        </div>

        <form onSubmit={send}>
          <Field label="Email Subject" required htmlFor="nl-subject">
            <input
              id="nl-subject"
              className="input"
              type="text"
              required
              placeholder="e.g., Exciting Updates from AyindeTech!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Field>

          <Field label="Email Body" required>
            <p className="hint" style={{ marginTop: 0, marginBottom: 10 }}>
              Use the editor below to format text, embed inline images (flyers), and add links.
            </p>
            <RichTextEditor value={body} onChange={setBody} />
          </Field>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <i className={sending ? 'fa-solid fa-spinner spin' : 'fa-solid fa-paper-plane'} />
              {sending ? ' Sending securely...' : ' Send Newsletter'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
