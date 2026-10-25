import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import Captcha from '../components/Captcha';
import './crm.css';

const SERVICE_OPTIONS = [
  'Website development',
  'Web application',
  'Data science & ML',
  'Consultation',
  'Other',
];

const todayIso = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function BookPage() {
  const captchaRef = useRef(null);
  const [day, setDay] = useState(todayIso());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service_interest: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setSelectedSlot(null);
    setSlotsLoading(true);
    setError('');
    api.getAvailability(day)
      .then((res) => { if (!cancelled) setSlots(res.slots || []); })
      .catch((err) => { if (!cancelled) { setSlots([]); setError(err.message); } })
      .finally(() => { if (!cancelled) setSlotsLoading(false); });
    return () => { cancelled = true; };
  }, [day]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedSlot) return setError('Please choose a time slot.');

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        ...form,
        preferred_start: selectedSlot.start,
        captcha_token: captchaRef.current?.getToken() ?? '',
        captcha_answer: captchaRef.current?.getAnswer() ?? '',
      });
      setDone(res);
    } catch (err) {
      setError(err.message);
      captchaRef.current?.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="crm-page crm-narrow">
        <h1>Booking request received</h1>
        <p>{done.message}</p>
        <p>We'll confirm by email shortly.</p>
      </section>
    );
  }

  return (
    <section className="crm-page crm-narrow">
      <h1>Book a call</h1>
      <p className="crm-muted">Pick a day and time. We'll confirm your booking by email.</p>

      <form onSubmit={handleSubmit} className="crm-form">
        <label>
          Day
          <input type="date" value={day} min={todayIso()} onChange={(e) => setDay(e.target.value)} required />
        </label>

        <fieldset className="crm-slots">
          <legend>Available times</legend>
          {slotsLoading && <p className="crm-muted">Loading times…</p>}
          {!slotsLoading && slots.length === 0 && <p className="crm-muted">No times left on this day. Try another date.</p>}
          <div className="crm-slot-grid">
            {slots.map((s) => (
              <button
                type="button"
                key={s.start}
                className={`crm-slot ${selectedSlot?.start === s.start ? 'is-selected' : ''}`}
                onClick={() => setSelectedSlot(s)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label>Full name *<input value={form.name} onChange={update('name')} required maxLength={100} /></label>
        <label>Email *<input type="email" value={form.email} onChange={update('email')} required /></label>
        <label>Phone<input type="tel" value={form.phone} onChange={update('phone')} maxLength={50} /></label>
        <label>Company<input value={form.company} onChange={update('company')} maxLength={150} /></label>
        <label>
          What do you need help with?
          <select value={form.service_interest} onChange={update('service_interest')}>
            <option value="">Choose one</option>
            {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label>Notes<textarea rows={3} value={form.notes} onChange={update('notes')} maxLength={2000} /></label>

        <Captcha ref={captchaRef} />

        {error && <p className="crm-error" role="alert">{error}</p>}

        <button type="submit" className="crm-btn crm-btn-primary" disabled={submitting || !selectedSlot}>
          {submitting ? 'Booking…' : selectedSlot ? `Request ${selectedSlot.label}` : 'Choose a time'}
        </button>
      </form>
    </section>
  );
}
