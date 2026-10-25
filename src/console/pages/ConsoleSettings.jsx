import React, { useEffect, useState } from 'react';
import { consoleApi } from '../consoleApi';
import { useConsole } from '../ConsoleLayout';
import { Field, errorText, useDialog } from '../ui';

const EMPTY_PASSWORDS = { current_password: '', new_password: '', confirm_password: '' };

export default function ConsoleSettings() {
  const { me } = useConsole();
  const { alert } = useDialog();
  const [fullName, setFullName] = useState(me.full_name || '');
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(me.full_name || '');
  }, [me.full_name]);

  const save = async (e) => {
    e.preventDefault();
    const wantsPassword = Object.values(passwords).some(Boolean);
    setSaving(true);
    try {
      const res = await consoleApi.updateMe({
        full_name: fullName.trim(),
        ...(wantsPassword ? passwords : {}),
      });
      setPasswords(EMPTY_PASSWORDS);
      await alert({ icon: 'success', title: 'Updated!', text: res.message });
      // Reload so the topbar name and avatar reflect the change (same as the PHP page)
      window.location.reload();
    } catch (err) {
      alert({ icon: 'error', title: 'Error', text: errorText(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h2>Account Settings</h2>
          <p>Manage your administrative profile and security credentials.</p>
        </div>
      </div>

      <div className="dash-card" style={{ maxWidth: 820 }}>
        <form onSubmit={save}>
          <div className="section-title">Personal Details</div>

          <Field label="Full Name" required htmlFor="set-name">
            <input
              id="set-name"
              className="input"
              type="text"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field>

          <Field
            label="Username & Email"
            hint="Username and email address cannot be changed for security reasons."
          >
            <input className="input" type="text" disabled value={me.email} />
          </Field>

          <div className="divider" />

          <div className="section-title">Change Password</div>
          <p className="section-note">Leave these fields blank if you do not wish to change your password.</p>

          <Field label="Current Password" htmlFor="set-current">
            <input
              id="set-current"
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            />
          </Field>

          <div className="two-col">
            <Field label="New Password" htmlFor="set-new">
              <input
                id="set-new"
                className="input"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              />
            </Field>
            <Field label="Confirm New Password" htmlFor="set-confirm">
              <input
                id="set-confirm"
                className="input"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
              />
            </Field>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <i className={saving ? 'fa-solid fa-spinner spin' : 'fa-solid fa-floppy-disk'} />
              {saving ? ' Saving...' : ' Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
