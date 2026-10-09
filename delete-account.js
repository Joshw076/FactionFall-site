const panel = document.querySelector('#account-deletion');
const status = document.querySelector('#deletion-status');
const verify = document.querySelector('#verify-account');
const confirm = document.querySelector('#confirm-deletion');
const google = document.querySelector('#google-verify');
const api = panel.dataset.api.replace(/\/$/, '');
let credentials = null, polling = null, generation = 0, busy = false;
const message = text => { status.textContent = text; };
async function request(path, options = {}) {
  const response = await fetch(`${api}/api/auth${path}`, { ...options,
    credentials: 'omit', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Verification failed. Please try again.');
  return data;
}
function reset() {
  generation++; clearTimeout(polling); credentials = null;
  verify.reset(); confirm.reset(); confirm.hidden = true;
  verify.hidden = google.hidden = false; busy = false;
}
function verified(data, password, email) {
  credentials = { accessToken: data.accessToken, googleIdToken: data.googleIdToken, password };
  verify.reset(); verify.hidden = google.hidden = true; confirm.hidden = false;
  document.querySelector('#verified-account').textContent = email ? `Verified account: ${email}` : 'Your Google account is verified.';
  message('Ownership verified. Read the warning before confirming deletion.');
  document.querySelector('#delete-confirmation').focus();
}
if (!api) message('Account deletion is not available yet: the website’s server connection is awaiting configuration.');
else { verify.hidden = google.hidden = false; message('Sign in with the account you want to permanently delete.'); }
verify.addEventListener('submit', async event => {
  event.preventDefault(); if (busy) return; busy = true;
  const attempt = ++generation;
  const email = document.querySelector('#account-email').value;
  const password = document.querySelector('#account-password').value;
  message('Verifying account…');
  try {
    const data = await request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (attempt === generation) verified(data, password, email);
  } catch (error) { if (attempt === generation) message(error.message); }
  finally { if (attempt === generation) busy = false; }
});
google.addEventListener('click', async () => {
  if (busy) return; busy = true;
  const attempt = ++generation;
  const popup = window.open('about:blank', '_blank', 'popup,width=500,height=650');
  if (!popup) { busy = false; message('Allow popups for Google verification.'); return; }
  popup.opener = null;
  try {
    const data = await request('/google/start?purpose=deletion');
    if (attempt !== generation) { popup.close(); return; }
    popup.location.replace(data.authUrl);
    const expires = Date.now() + data.expiresIn * 1000;
    message('Complete Google sign-in in the new window.');
    const poll = async () => {
      if (attempt !== generation) return;
      try {
        if (Date.now() >= expires) throw new Error('Verification expired. Please try again.');
        const result = await request(`/google/status/${encodeURIComponent(data.requestId)}`);
        if (attempt !== generation) return;
        if (result.status === 'complete') { busy = false; verified(result, undefined, result.verifiedEmail); return; }
        if (popup.closed) throw new Error('Google verification was cancelled.');
        polling = setTimeout(poll, 2000);
      } catch (error) { if (attempt === generation) { busy = false; message(error.message); } }
    };
    polling = setTimeout(poll, 2000);
  } catch (error) { popup.close(); busy = false; message(error.message); }
});
confirm.addEventListener('submit', async event => {
  event.preventDefault(); if (busy || !credentials) return; busy = true;
  const buttons = confirm.querySelectorAll('button'); buttons.forEach(b => { b.disabled = true; });
  message('Deleting your account…');
  try {
    const result = await request('/account', { method: 'DELETE',
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
      body: JSON.stringify({ confirmation: document.querySelector('#delete-confirmation').value,
        password: credentials.password, googleIdToken: credentials.googleIdToken }) });
    reset(); verify.hidden = google.hidden = true; message(result.message);
  } catch (error) {
    reset(); message(`${error.message} If the connection was interrupted, deletion may have completed. Verify again before retrying.`);
  } finally { busy = false; buttons.forEach(b => { b.disabled = false; }); }
});
document.querySelector('#cancel-deletion').addEventListener('click', () => { reset(); message('Deletion cancelled. Your account has not been deleted.'); });
window.addEventListener('pagehide', () => { credentials = null; clearTimeout(polling); generation++; });
