// Calls to the inquiry and newsletter endpoints ported from the PHP site.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function errorText(data, status) {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail)) return data.detail.map((d) => d.msg).join(', ');
  return `Request failed (${status}). Please try again.`;
}

async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(errorText(data, res.status));
  return data;
}

export const submitInquiry = (kind, body) => postJson(`/api/inquiries/${kind}/`, body);
export const subscribeNewsletter = (email) => postJson('/api/newsletter/subscribe/', { email });

// Read a text or checkbox field from a form by its id
export const fieldValue = (form, id) => (form.elements.namedItem(id)?.value || '').trim();
export const fieldChecked = (form, id) => !!form.elements.namedItem(id)?.checked;

export const successText = (res) => {
  let text = `Thanks! Your request ${res.tracking_reference} has been received.`;
  if (res.priority_checkout) text += ' Online payment for priority checkout is not connected yet.';
  return text;
};
