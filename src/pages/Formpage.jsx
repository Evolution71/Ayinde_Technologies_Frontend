import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import Captcha from '../components/Captcha';
import './crm.css';

export default function FormPage() {
  const { slug } = useParams();
  const captchaRef = useRef(null);
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getPublicForm(slug)
      .then((data) => { if (!cancelled) setForm(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const setValue = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.submitPublicForm(slug, {
        values,
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

  if (loading) return <section className="crm-page crm-narrow"><p className="crm-muted">Loading…</p></section>;
  if (error && !form) return <section className="crm-page crm-narrow"><h1>Form not available</h1><p>{error}</p></section>;

  if (done) {
    return (
      <section className="crm-page crm-narrow">
        <h1>Thank you</h1>
        <p>{done.message}</p>
      </section>
    );
  }

  const renderField = (field) => {
    const id = `field-${field.key}`;
    const common = { id, required: field.required, value: values[field.key] ?? '', onChange: (e) => setValue(field.key, e.target.value) };
    switch (field.type) {
      case 'textarea':
        return <textarea rows={4} maxLength={2000} {...common} />;
      case 'select':
        return (
          <select {...common}>
            <option value="">Choose one</option>
            {(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
      case 'checkbox':
        return (
          <input
            id={id}
            type="checkbox"
            checked={!!values[field.key]}
            onChange={(e) => setValue(field.key, e.target.checked)}
          />
        );
      case 'email':
        return <input type="email" {...common} />;
      case 'phone':
        return <input type="tel" maxLength={50} {...common} />;
      default:
        return <input type="text" maxLength={200} {...common} />;
    }
  };

  return (
    <section className="crm-page crm-narrow">
      <h1>{form.title}</h1>
      {form.description && <p className="crm-muted">{form.description}</p>}

      <form onSubmit={handleSubmit} className="crm-form">
        {form.fields.map((field) => (
          <label key={field.key} className={field.type === 'checkbox' ? 'crm-checkbox' : ''}>
            {field.type === 'checkbox' ? (
              <>{renderField(field)} <span>{field.label}{field.required ? ' *' : ''}</span></>
            ) : (
              <>{field.label}{field.required ? ' *' : ''}{renderField(field)}</>
            )}
          </label>
        ))}

        <Captcha ref={captchaRef} />

        {error && <p className="crm-error" role="alert">{error}</p>}

        <button type="submit" className="crm-btn crm-btn-primary" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </section>
  );
}