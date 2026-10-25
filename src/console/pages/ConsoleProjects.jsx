import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { DataTable, Field, Modal, ProgressBar, StatusBadge, errorText, useDialog } from '../ui';

const STATUSES = ['Pending', 'Active', 'Completed', 'Cancelled'];

const EMPTY_FORM = { current_phase: '', progress_percentage: 0, status: 'Pending' };

export default function ConsoleProjects() {
  const { refreshStats } = useConsole();
  const { alert } = useDialog();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // project row being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    consoleApi
      .projects()
      .then((res) => setProjects(res.items))
      .catch((err) => alert({ icon: 'error', title: 'Error', text: errorText(err) }))
      .finally(() => setLoading(false));
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  const openUpdate = (project) => {
    setEditing(project);
    setForm({
      current_phase: project.current_phase || '',
      progress_percentage: project.progress_percentage ?? 0,
      status: project.status,
    });
  };

  const closeUpdate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await consoleApi.updateProject(editing.id, {
        status: form.status,
        current_phase: form.current_phase.trim(),
        progress_percentage: Number(form.progress_percentage),
      });
      setProjects((rows) => rows.map((r) => (r.id === editing.id ? res.item : r)));
      closeUpdate();
      refreshStats();
      alert({ icon: 'success', title: 'Updated!', text: res.message });
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'ref',
        label: 'Ref & Client',
        sortable: true,
        sortValue: (r) => r.tracking_reference,
        render: (r) => (
          <>
            <div className="cell-title">{r.tracking_reference}</div>
            <div className="cell-sub">{r.client_name}</div>
          </>
        ),
      },
      {
        key: 'service',
        label: 'Service Type',
        sortable: true,
        sortValue: (r) => r.service_type,
        render: (r) => r.service_type,
      },
      {
        key: 'phase',
        label: 'Current Phase',
        render: (r) => r.current_phase || 'Not Started',
      },
      {
        key: 'progress',
        label: 'Progress',
        sortable: true,
        sortValue: (r) => r.progress_percentage,
        render: (r) => <ProgressBar value={r.progress_percentage} />,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        sortValue: (r) => r.status,
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: 'actions',
        label: 'Actions',
        center: true,
        render: (r) => (
          <button type="button" className="btn btn-table" onClick={() => openUpdate(r)}>
            <i className="fa-solid fa-pen" /> Update
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
          <h2>Manage Projects</h2>
          <p>Track and update the progress of all active and past client services.</p>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <p className="text-muted">Loading projects...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={projects}
            rowKey={(r) => r.id}
            defaultSortKey="ref"
            searchPlaceholder="Search projects..."
            emptyText="No projects yet."
            searchText={(r) => `${r.tracking_reference} ${r.client_name} ${r.service_type} ${r.status} ${r.current_phase}`}
          />
        )}
      </div>

      <Modal open={!!editing} title="Update Project Tracker" onClose={closeUpdate}>
        <form onSubmit={save}>
          <Field label="Project Phase" required htmlFor="phase">
            <input
              id="phase"
              className="input"
              type="text"
              required
              value={form.current_phase}
              onChange={(e) => setForm({ ...form, current_phase: e.target.value })}
              placeholder="e.g., Discovery, Design, Development, Launch"
            />
          </Field>

          <Field label="Progress Percentage (%)" required htmlFor="progress">
            <input
              id="progress"
              className="input"
              type="number"
              required
              min={0}
              max={100}
              value={form.progress_percentage}
              onChange={(e) => setForm({ ...form, progress_percentage: e.target.value })}
            />
          </Field>

          <Field label="Overall Status" required htmlFor="status">
            <select
              id="status"
              className="input"
              required
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <div className="form-actions" style={{ marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={closeUpdate}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <i className={saving ? 'fa-solid fa-spinner spin' : 'fa-solid fa-floppy-disk'} />
              {saving ? ' Saving...' : ' Save Updates'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
