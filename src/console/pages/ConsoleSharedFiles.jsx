import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, Field, Modal, errorText, formatBytes, formatDate, useDialog } from '../ui';

const MAX_BYTES = 20 * 1024 * 1024;

export default function ConsoleSharedFiles() {
  const { refreshStats } = useConsole();
  const { alert, confirm } = useDialog();
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ client_id: '', service_id: '', file: null });
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([consoleApi.files(), consoleApi.clients(), consoleApi.projects()])
      .then(([f, c, p]) => {
        setFiles(f.items);
        setClients(c.items);
        setProjects(p.items);
      })
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  // Only open projects for the chosen client can be linked to a file
  const clientProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          String(p.client_id) === String(uploadForm.client_id) &&
          !['Completed', 'Cancelled'].includes(p.status)
      ),
    [projects, uploadForm.client_id]
  );

  const closeUpload = () => {
    setUploadOpen(false);
    setUploadForm({ client_id: '', service_id: '', file: null });
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert({ icon: 'error', title: 'Error', text: 'Choose a file to upload.' });
      return;
    }
    if (uploadForm.file.size > MAX_BYTES) {
      alert({ icon: 'error', title: 'Error', text: 'File is larger than 20MB.' });
      return;
    }
    const data = new FormData();
    data.append('client_id', uploadForm.client_id);
    if (uploadForm.service_id) data.append('service_id', uploadForm.service_id);
    data.append('file', uploadForm.file);

    setUploading(true);
    try {
      const res = await consoleApi.uploadFile(data);
      closeUpload();
      await alert({ icon: 'success', title: 'Uploaded!', text: res.message });
      load();
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setUploading(false);
    }
  };

  const download = async (file) => {
    try {
      await consoleApi.downloadFile(file.id, file.original_name);
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    }
  };

  const remove = async (file) => {
    const ok = await confirm({
      title: 'Delete this file?',
      text: 'This action cannot be undone. The client will no longer have access to it.',
      confirmText: 'Yes, delete it!',
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await consoleApi.deleteFile(file.id);
      setFiles((rows) => rows.filter((r) => r.id !== file.id));
      refreshStats();
      alert({ icon: 'success', title: 'Deleted!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'file',
        label: 'File Details',
        sortable: true,
        sortValue: (f) => f.original_name,
        render: (f) => (
          <div className="row-flex">
            <div className="file-icon">
              <i className="fa-solid fa-file" />
            </div>
            <div>
              <div className="cell-title">{f.original_name}</div>
              <div className="cell-sub">
                {formatBytes(f.file_size)} • {(f.file_type || '').toUpperCase()}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'client',
        label: 'Client & Project',
        sortable: true,
        sortValue: (f) => f.client_name,
        render: (f) => (
          <>
            <div className="cell-title">{f.client_name}</div>
            <div className="cell-sub">{f.tracking_reference || 'General Asset'}</div>
          </>
        ),
      },
      {
        key: 'uploader',
        label: 'Uploader',
        render: (f) => (f.uploaded_by === 'admin' ? <span className="muted">You</span> : <span className="muted">Client</span>),
      },
      {
        key: 'date',
        label: 'Date',
        sortable: true,
        sortValue: (f) => f.created_at || '',
        render: (f) => formatDate(f.created_at),
      },
      {
        key: 'actions',
        label: 'Actions',
        center: true,
        render: (f) => (
          <div className="actions actions-end">
            <button type="button" className="icon-btn" title="Download" onClick={() => download(f)}>
              <i className="fa-solid fa-download" />
            </button>
            <button type="button" className="icon-btn danger" title="Delete" onClick={() => remove(f)}>
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
          <h2>Shared Files</h2>
          <p>Manage project assets and deliver final files securely to clients.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setUploadOpen(true)}>
            <i className="fa-solid fa-cloud-arrow-up" /> Upload Deliverable
          </button>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading files...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={files}
            rowKey={(f) => f.id}
            defaultSortKey="date"
            searchPlaceholder="Search files..."
            emptyText="No files shared yet."
            searchText={(f) => `${f.original_name} ${f.client_name} ${f.tracking_reference || ''}`}
          />
        )}
      </div>

      <Modal open={uploadOpen} title="Upload Deliverable" onClose={closeUpload}>
        <form onSubmit={upload}>
          <Field label="Select Client" required htmlFor="up-client">
            <select
              id="up-client"
              className="input"
              required
              value={uploadForm.client_id}
              onChange={(e) => setUploadForm({ ...uploadForm, client_id: e.target.value, service_id: '' })}
            >
              <option value="">-- Choose Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.client_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Link to Project (Optional)" htmlFor="up-project">
            <select
              id="up-project"
              className="input"
              value={uploadForm.service_id}
              disabled={!uploadForm.client_id}
              onChange={(e) => setUploadForm({ ...uploadForm, service_id: e.target.value })}
            >
              <option value="">General Asset (No Project)</option>
              {clientProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.client_name} - {p.tracking_reference}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Select File" required>
            <div className="dropzone">
              <i className="fa-solid fa-cloud-arrow-up" />
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.zip"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
              />
              <p className="hint">Max Size: 20MB. Formats: PDF, DOC, PPT, IMG, ZIP</p>
            </div>
          </Field>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={closeUpload}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              <i className={uploading ? 'fa-solid fa-spinner spin' : 'fa-solid fa-upload'} />
              {uploading ? ' Uploading...' : ' Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
