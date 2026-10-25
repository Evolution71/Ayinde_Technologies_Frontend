/**
 * Shared building blocks for the admin console.
 * They reproduce the PHP dashboard components: modals, DataTables-style tables,
 * status badges, progress bars, form fields, alerts/confirms (SweetAlert style)
 * and a small rich-text editor in place of TinyMCE.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// FORMATTERS
// ════════════════════════════════════════════════════════════════════════════════

const toDate = (value) => (value ? new Date(value) : null);

export const formatDate = (value) => {
  const d = toDate(value);
  if (!d || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const formatDateTime = (value) => {
  const d = toDate(value);
  if (!d || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const initialsOf = (name = '') => {
  const parts = name.trim().split(/\s+/);
  return `${(parts[0] || '').charAt(0)}${(parts[1] || '').charAt(0)}`.toUpperCase() || 'A';
};

export const money = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ════════════════════════════════════════════════════════════════════════════════
// DIALOGS (alert & confirm, SweetAlert style)
// ════════════════════════════════════════════════════════════════════════════════

const DialogContext = createContext(null);

const ICONS = {
  success: { cls: 'fa-solid fa-circle-check', color: '#16a34a' },
  error: { cls: 'fa-solid fa-circle-xmark', color: '#dc2626' },
  warning: { cls: 'fa-solid fa-triangle-exclamation', color: '#f59e0b' },
  info: { cls: 'fa-solid fa-circle-info', color: '#2f9bff' },
};

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const open = useCallback(
    (options) => new Promise((resolve) => setDialog({ ...options, resolve })),
    []
  );

  const alert = useCallback(
    (options) => open({ type: 'alert', icon: 'info', ...options }).then(() => undefined),
    [open]
  );

  const confirm = useCallback(
    (options) => open({ type: 'confirm', icon: 'warning', ...options }),
    [open]
  );

  const close = (result) => {
    if (dialog) dialog.resolve(result);
    setDialog(null);
  };

  const icon = dialog ? ICONS[dialog.icon] || ICONS.info : null;

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      {dialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1100 }}>
          <div className="modal-container" style={{ maxWidth: 420 }}>
            <div className="modal-body" style={{ padding: 32 }}>
              <div className="alert-icon">
                <i className={icon.cls} style={{ color: icon.color }} />
              </div>
              {dialog.title && <div className="alert-title" style={{ textAlign: 'center' }}>{dialog.title}</div>}
              {dialog.text && <div className="alert-text">{dialog.text}</div>}
              <div className="alert-actions">
                {dialog.type === 'confirm' && (
                  <button type="button" className="btn btn-outline" onClick={() => close(false)}>
                    {dialog.cancelText || 'Cancel'}
                  </button>
                )}
                <button
                  type="button"
                  className={`btn ${dialog.danger ? 'btn-danger-solid' : 'btn-primary'}`}
                  onClick={() => close(true)}
                  autoFocus
                >
                  {dialog.confirmText || 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider');
  return ctx;
};

// ════════════════════════════════════════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════════════════════════════════════════

export function Modal({ open, title, onClose, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal-container ${wide ? 'wide' : ''}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// FORM FIELD
// ════════════════════════════════════════════════════════════════════════════════

export function Field({ label, required = false, hint, tight = false, htmlFor, children }) {
  return (
    <div className={`field ${tight ? 'tight' : ''}`}>
      {label && (
        <label htmlFor={htmlFor}>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// BADGES & PROGRESS
// ════════════════════════════════════════════════════════════════════════════════

export function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const cls = ['pending', 'active', 'completed', 'cancelled'].includes(key) ? `status-${key}` : 'status-neutral';
  return <span className={`status-badge ${cls}`}>{status || '—'}</span>;
}

export function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress-cell">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-pct">{pct}%</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DATA TABLE (DataTables look: search, sort, pagination)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * columns: [{ key, label, render(row), sortValue(row) -> string|number, sortable, center }]
 * rows: array; rowKey(row) -> unique key; searchText(row) -> string used by the search box
 */
export function DataTable({
  columns,
  rows,
  rowKey,
  rowClassName,
  searchPlaceholder = 'Search...',
  emptyText = 'No records found.',
  pageSize = 10,
  defaultSortKey,
  defaultSortDir = 'desc',
  searchText,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: defaultSortKey, dir: defaultSortDir });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const text = searchText ? searchText(row) : columns.map((c) => (c.sortValue ? c.sortValue(row) : '')).join(' ');
      return String(text).toLowerCase().includes(q);
    });
  }, [rows, query, columns, searchText]);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortValue) return filtered;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.sortValue(a);
      const bv = col.sortValue(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, columns, sort]);

  useEffect(() => setPage(1), [query, rows.length]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const toggleSort = (col) => {
    if (!col.sortable || !col.sortValue) return;
    setSort((prev) =>
      prev.key === col.key
        ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' }
    );
  };

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1).slice(
    Math.max(0, safePage - 3),
    Math.max(0, safePage - 3) + 5
  );

  return (
    <div>
      <div className="dt-toolbar">
        <div />
        <input
          type="search"
          className="dt-search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={col.center ? 'center' : ''}
                    onClick={() => toggleSort(col)}
                    style={col.sortable ? { cursor: 'pointer' } : undefined}
                  >
                    {col.label}
                    {col.sortable && (
                      <i
                        className={`fa-solid ${active ? (sort.dir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}
                        style={{ marginLeft: 6, opacity: active ? 1 : 0.35 }}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="dt-empty">
                  {query ? 'No matching records.' : emptyText}
                </td>
              </tr>
            )}
            {pageRows.map((row) => (
              <tr key={rowKey(row)} className={rowClassName ? rowClassName(row) : ''}>
                {columns.map((col) => (
                  <td key={col.key} className={col.center ? 'center' : ''}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dt-footer">
        <span>
          {sorted.length === 0
            ? 'Showing 0 entries'
            : `Showing ${start + 1} to ${Math.min(start + pageSize, sorted.length)} of ${sorted.length} entries`}
        </span>
        <div className="dt-pager">
          <button type="button" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            Previous
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              className={n === safePage ? 'is-current' : ''}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button type="button" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// RICH TEXT EDITOR (in place of TinyMCE)
// ════════════════════════════════════════════════════════════════════════════════

const RTE_BUTTONS = [
  { cmd: 'undo', icon: 'fa-solid fa-rotate-left', title: 'Undo' },
  { cmd: 'redo', icon: 'fa-solid fa-rotate-right', title: 'Redo' },
  { sep: true },
  { cmd: 'bold', icon: 'fa-solid fa-bold', title: 'Bold' },
  { cmd: 'italic', icon: 'fa-solid fa-italic', title: 'Italic' },
  { cmd: 'underline', icon: 'fa-solid fa-underline', title: 'Underline' },
  { sep: true },
  { cmd: 'justifyLeft', icon: 'fa-solid fa-align-left', title: 'Align left' },
  { cmd: 'justifyCenter', icon: 'fa-solid fa-align-center', title: 'Align center' },
  { cmd: 'justifyRight', icon: 'fa-solid fa-align-right', title: 'Align right' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: 'fa-solid fa-list-ul', title: 'Bullet list' },
  { cmd: 'insertOrderedList', icon: 'fa-solid fa-list-ol', title: 'Numbered list' },
  { sep: true },
  { cmd: 'createLink', icon: 'fa-solid fa-link', title: 'Insert link', prompt: true },
  { cmd: 'image', icon: 'fa-regular fa-image', title: 'Insert image' },
  { cmd: 'removeFormat', icon: 'fa-solid fa-text-slash', title: 'Clear formatting' },
];

export function RichTextEditor({ value, onChange, placeholder = 'Write your message here...' }) {
  const ref = useRef(null);
  const fileRef = useRef(null);

  // Keep the editor in sync when the parent sets or resets the value (e.g. '' after sending)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const emit = () => onChange?.(ref.current ? ref.current.innerHTML : '');

  const exec = (btn) => {
    ref.current?.focus();
    if (btn.cmd === 'createLink') {
      const url = window.prompt('Link address (https://...)');
      if (url) document.execCommand('createLink', false, url);
    } else if (btn.cmd === 'image') {
      fileRef.current?.click();
      return;
    } else {
      document.execCommand(btn.cmd, false, null);
    }
    emit();
  };

  const onImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      ref.current?.focus();
      document.execCommand('insertImage', false, reader.result);
      emit();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        {RTE_BUTTONS.map((btn, i) =>
          btn.sep ? (
            <span key={`sep-${i}`} style={{ width: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 2px' }} />
          ) : (
            <button key={btn.cmd} type="button" title={btn.title} aria-label={btn.title} onMouseDown={(e) => e.preventDefault()} onClick={() => exec(btn)}>
              <i className={btn.icon} />
            </button>
          )
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onImage} style={{ display: 'none' }} />
      </div>
      <div
        ref={ref}
        className="rte-area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        aria-label="Message body"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ERRORS
// ════════════════════════════════════════════════════════════════════════════════

export const errorText = (err) => (err && err.message) || 'Server connection failed.';
