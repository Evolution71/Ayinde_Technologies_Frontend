import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import '../crm.css';

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const FIELD_TYPES = ['text', 'email', 'phone', 'textarea', 'select', 'checkbox'];
const TABS = ['Pipeline', 'Contacts', 'Bookings', 'Forms'];

export default function CRMPage() {
  const [tab, setTab] = useState('Pipeline');
  const [error, setError] = useState('');

  return (
    <section className="crm-page">
      <h1>CRM</h1>
      <nav className="crm-tabs" aria-label="CRM sections">
        {TABS.map((t) => (
          <button key={t} className={`crm-tab ${tab === t ? 'is-active' : ''}`} onClick={() => { setTab(t); setError(''); }}>
            {t}
          </button>
        ))}
      </nav>
      {error && <p className="crm-error" role="alert">{error}</p>}
      {tab === 'Pipeline' && <PipelineTab onError={setError} />}
      {tab === 'Contacts' && <ContactsTab onError={setError} />}
      {tab === 'Bookings' && <BookingsTab onError={setError} />}
      {tab === 'Forms' && <FormsTab onError={setError} />}
    </section>
  );
}

// ========== PIPELINE ==========

function PipelineTab({ onError }) {
  const [contacts, setContacts] = useState([]);

  const load = useCallback(() => {
    api.listContacts({ limit: 200 })
      .then((res) => setContacts(res.items))
      .catch((err) => onError(err.message));
  }, [onError]);

  useEffect(() => { load(); }, [load]);

  const byStage = useMemo(() => {
    const groups = Object.fromEntries(STAGES.map((s) => [s, []]));
    contacts.forEach((c) => (groups[c.pipeline_stage] || groups.new).push(c));
    return groups;
  }, [contacts]);

  const move = async (contactId, stage) => {
    try {
      await api.moveContactStage(contactId, stage);
      load();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="crm-board">
      {STAGES.map((stage) => (
        <div key={stage} className="crm-column">
          <h2>{stage} <span className="crm-count">{byStage[stage].length}</span></h2>
          {byStage[stage].map((c) => (
            <div key={c.id} className="crm-card">
              <strong>{c.name}</strong>
              <span className="crm-muted">{c.email}</span>
              {c.company && <span className="crm-muted">{c.company}</span>}
              <select value={c.pipeline_stage} onChange={(e) => move(c.id, e.target.value)} aria-label={`Stage for ${c.name}`}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ========== CONTACTS ==========

function ContactsTab({ onError }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    api.listContacts({ q: query, limit: 100 })
      .then((res) => { setItems(res.items); setTotal(res.total); })
      .catch((err) => onError(err.message));
  }, [query, onError]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this contact? This cannot be undone.')) return;
    try {
      await api.deleteContact(id);
      setSelected(null);
      load();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="crm-split">
      <div>
        <div className="crm-toolbar">
          <input type="search" placeholder="Search name, email or company" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="crm-btn" onClick={() => { setAdding(true); setSelected(null); }}>Add contact</button>
        </div>
        <p className="crm-muted">{total} contact{total === 1 ? '' : 's'}</p>
        <ul className="crm-list">
          {items.map((c) => (
            <li key={c.id}>
              <button className={`crm-list-item ${selected?.id === c.id ? 'is-selected' : ''}`} onClick={() => { setSelected(c); setAdding(false); }}>
                <strong>{c.name}</strong>
                <span className="crm-muted">{c.email} · {c.pipeline_stage}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {adding && <ContactCreateForm onSaved={() => { setAdding(false); load(); }} onError={onError} />}
        {!adding && selected && (
          <ContactEditForm
            key={selected.id}
            contact={selected}
            onSaved={(updated) => { setSelected(updated); load(); }}
            onDelete={() => remove(selected.id)}
            onError={onError}
          />
        )}
        {!adding && !selected && <p className="crm-muted">Select a contact to view or edit it.</p>}
      </div>
    </div>
  );
}

function ContactCreateForm({ onSaved, onError }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', tags: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createContact({ ...form, source: 'manual' });
      onSaved();
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="crm-form" onSubmit={submit}>
      <h2>New contact</h2>
      <label>Name *<input required value={form.name} onChange={update('name')} /></label>
      <label>Email *<input type="email" required value={form.email} onChange={update('email')} /></label>
      <label>Phone<input value={form.phone} onChange={update('phone')} /></label>
      <label>Company<input value={form.company} onChange={update('company')} /></label>
      <label>Tags (comma-separated)<input value={form.tags} onChange={update('tags')} /></label>
      <label>Notes<textarea rows={3} value={form.notes} onChange={update('notes')} /></label>
      <button className="crm-btn crm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create contact'}</button>
    </form>
  );
}

function ContactEditForm({ contact, onSaved, onDelete, onError }) {
  const [form, setForm] = useState({
    name: contact.name,
    phone: contact.phone || '',
    company: contact.company || '',
    tags: contact.tags.join(','),
    notes: contact.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateContact(contact.id, {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean).join(','),
      });
      onSaved(updated);
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="crm-form" onSubmit={submit}>
      <h2>{contact.email}</h2>
      <p className="crm-muted">Source: {contact.source} · Added {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}</p>
      <label>Name<input value={form.name} onChange={update('name')} required /></label>
      <label>Phone<input value={form.phone} onChange={update('phone')} /></label>
      <label>Company<input value={form.company} onChange={update('company')} /></label>
      <label>Tags (comma-separated)<input value={form.tags} onChange={update('tags')} /></label>
      <label>Notes<textarea rows={5} value={form.notes} onChange={update('notes')} /></label>
      <div className="crm-row">
        <button className="crm-btn crm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="crm-btn crm-btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </form>
  );
}

// ========== BOOKINGS ==========

function BookingsTab({ onError }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  const load = useCallback(() => {
    api.listBookings(filter || undefined)
      .then(setItems)
      .catch((err) => onError(err.message));
  }, [filter, onError]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      load();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div>
      <div className="crm-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter bookings">
          <option value="">All statuses</option>
          <option value="requested">Requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {items.length === 0 && <p className="crm-muted">No bookings yet.</p>}
      <ul className="crm-list">
        {items.map((b) => (
          <li key={b.id} className="crm-card">
            <strong>{b.name}</strong> <span className="crm-muted">{b.email}</span>
            <span>{new Date(b.preferred_start).toLocaleString()}</span>
            <span className="crm-muted">{b.service_interest || 'No service selected'} · {b.status}</span>
            {b.notes && <p className="crm-muted">{b.notes}</p>}
            <div className="crm-row">
              {b.status === 'requested' && <button className="crm-btn" onClick={() => setStatus(b.id, 'confirmed')}>Confirm</button>}
              {b.status === 'confirmed' && <button className="crm-btn" onClick={() => setStatus(b.id, 'completed')}>Mark completed</button>}
              {b.status !== 'cancelled' && b.status !== 'completed' && (
                <button className="crm-btn crm-btn-danger" onClick={() => setStatus(b.id, 'cancelled')}>Cancel</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========== FORMS ==========

function FormsTab({ onError }) {
  const [forms, setForms] = useState([]);
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(() => {
    api.listForms().then(setForms).catch((err) => onError(err.message));
  }, [onError]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (f) => {
    try { await api.updateForm(f.id, { is_active: !f.is_active }); load(); } catch (err) { onError(err.message); }
  };

  const remove = async (f) => {
    if (!window.confirm(`Delete the form "${f.title}" and all its submissions?`)) return;
    try { await api.deleteForm(f.id); load(); } catch (err) { onError(err.message); }
  };

  return (
    <div>
      <div className="crm-toolbar">
        <button className="crm-btn crm-btn-primary" onClick={() => setEditing(true)}>New form</button>
      </div>

      {editing && <FormBuilder onSaved={() => { setEditing(false); load(); }} onCancel={() => setEditing(false)} onError={onError} />}

      <ul className="crm-list">
        {forms.map((f) => (
          <li key={f.id} className="crm-card">
            <strong>{f.title}</strong>
            <span className="crm-muted">/forms/{f.slug} · {f.is_active ? 'Active' : 'Paused'} · {f.fields.length} fields</span>
            <div className="crm-row">
              <a className="crm-btn" href={`/forms/${f.slug}`} target="_blank" rel="noreferrer">Open</a>
              <button className="crm-btn" onClick={() => setViewing(viewing?.id === f.id ? null : f)}>Submissions</button>
              <button className="crm-btn" onClick={() => toggle(f)}>{f.is_active ? 'Pause' : 'Activate'}</button>
              <button className="crm-btn crm-btn-danger" onClick={() => remove(f)}>Delete</button>
            </div>
            {viewing?.id === f.id && <FormSubmissions formId={f.id} onError={onError} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormSubmissions({ formId, onError }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    api.getFormSubmissions(formId).then(setRows).catch((err) => onError(err.message));
  }, [formId, onError]);

  if (!rows) return <p className="crm-muted">Loading…</p>;
  if (rows.length === 0) return <p className="crm-muted">No submissions yet.</p>;
  return (
    <ul className="crm-submissions">
      {rows.map((r) => (
        <li key={r.id}>
          <span className="crm-muted">{new Date(r.created_at).toLocaleString()}</span>
          <pre>{JSON.stringify(r.data, null, 2)}</pre>
        </li>
      ))}
    </ul>
  );
}

function FormBuilder({ onSaved, onCancel, onError }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([
    { key: 'name', label: 'Full name', type: 'text', required: true, options: '' },
    { key: 'email', label: 'Email', type: 'email', required: true, options: '' },
  ]);
  const [saving, setSaving] = useState(false);

  const updateField = (i, patch) => setFields(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const addField = () => setFields([...fields, { key: `field${fields.length + 1}`, label: 'New field', type: 'text', required: false, options: '' }]);
  const removeField = (i) => setFields(fields.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createForm({
        title,
        slug,
        description: description || null,
        fields: fields.map((f) => ({
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required,
          ...(f.type === 'select' ? { options: f.options.split(',').map((o) => o.trim()).filter(Boolean) } : {}),
        })),
        is_active: true,
      });
      onSaved();
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="crm-form crm-builder" onSubmit={submit}>
      <h2>New form</h2>
      <label>Title *<input required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>URL slug * <span className="crm-muted">(lowercase, hyphens, e.g. free-consultation)</span>
        <input required value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
      </label>
      <label>Description<textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></label>

      <h3>Fields</h3>
      <p className="crm-muted">Include an <code>email</code> field. A <code>name</code> and <code>phone</code> or <code>company</code> field are saved to the contact.</p>
      {fields.map((f, i) => (
        <div key={i} className="crm-field-row">
          <input aria-label="Field key" placeholder="key" value={f.key} onChange={(e) => updateField(i, { key: e.target.value })} />
          <input aria-label="Field label" placeholder="label" value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} />
          <select aria-label="Field type" value={f.type} onChange={(e) => updateField(i, { type: e.target.value })}>
            {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {f.type === 'select' && (
            <input aria-label="Options" placeholder="option 1, option 2" value={f.options} onChange={(e) => updateField(i, { options: e.target.value })} />
          )}
          <label className="crm-checkbox"><input type="checkbox" checked={f.required} onChange={(e) => updateField(i, { required: e.target.checked })} /> Required</label>
          <button type="button" className="crm-btn crm-btn-danger" onClick={() => removeField(i)}>Remove</button>
        </div>
      ))}
      <button type="button" className="crm-btn" onClick={addField}>Add field</button>

      <div className="crm-row">
        <button className="crm-btn crm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create form'}</button>
        <button type="button" className="crm-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}