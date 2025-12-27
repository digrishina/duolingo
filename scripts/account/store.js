import { go, wireBackButton } from '../common/router.js';
import { loadState, updateState, resetState } from '../common/state.js';
import { ensureMessageBox, showMessage, hideMessage, setProgress } from '../common/ui.js';

export class Store {
  root;
  state;
  box;

  constructor(root) {
    this.root = root;
    this.state = loadState();
    this.box = null;
  }

  init() {
    wireBackButton('onboarding');
    setProgress(100);
    this.box = ensureMessageBox(this.root.querySelector('main.content') || this.root.body);
    this.fillFromState();
    this.bindEvents();
    this.syncButtonText();
  }

  getInputs() {
    const inputs = [...this.root.querySelectorAll('.group .input')];
    const name = inputs.find((x) => x.type === 'text') || inputs[0];
    const username = inputs.filter((x) => x.type === 'text')[1] || inputs[1];
    const email = inputs.find((x) => x.type === 'email') || inputs[2];
    return { name, username, email };
  }

  fillFromState() {
    const { name, username, email } = this.getInputs();
    if (name) name.value = this.state.profile.name || '';
    if (username) username.value = this.state.profile.username || '';
    if (email) email.value = this.state.profile.email || '';

    const switches = [...this.root.querySelectorAll('.group--switches .switch-row')];
    const map = [
      { key: 'sound', idx: 0 },
      { key: 'animations', idx: 1 },
      { key: 'motivational', idx: 2 },
      { key: 'listening', idx: 3 }
    ];

    for (const m of map) {
      const row = switches[m.idx];
      if (!row) continue;
      const input = row.querySelector('input[type="checkbox"]');
      if (!input) continue;
      input.checked = !!this.state.settings[m.key];
    }
  }

  syncButtonText() {
    const btn = this.root.querySelector('.cta-wrap .btn');
    if (!btn) return;
    btn.textContent = this.state.auth.signedIn ? 'SAVE' : 'SIGN IN';
  }

  validateProfile(profile) {
    const missing = [];
    if (!profile.name.trim()) missing.push('Name');
    if (!profile.username.trim()) missing.push('Username');
    if (!profile.email.trim()) missing.push('Email');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim());
    if (profile.email.trim() && !emailOk) return { ok: false, message: 'Email looks incorrect' };
    if (missing.length) return { ok: false, message: `Empty fields: ${missing.join(', ')}` };
    return { ok: true, message: 'Thank you' };
  }

  bindEvents() {
    const btn = this.root.querySelector('.cta-wrap .btn');
    const { name, username, email } = this.getInputs();

    const logout = this.root.querySelector('.links .link--muted');
    const del = this.root.querySelector('.links .link--danger');

    const switches = [...this.root.querySelectorAll('.group--switches .switch-row')];

    const onAnyInput = () => {
      if (this.box) hideMessage(this.box);
    };

    if (name) name.addEventListener('input', onAnyInput);
    if (username) username.addEventListener('input', onAnyInput);
    if (email) email.addEventListener('input', onAnyInput);

    for (const row of switches) {
      const input = row.querySelector('input[type="checkbox"]');
      if (!input) continue;
      input.addEventListener('change', () => {
        const label = row.querySelector('.switch-row__label')?.textContent || '';
        const key =
          label.includes('Sound') ? 'sound' :
          label.includes('Animations') ? 'animations' :
          label.includes('Motivational') ? 'motivational' :
          'listening';

        this.state = updateState({ settings: { [key]: input.checked } });
      });
    }

    if (btn) {
      btn.addEventListener('click', () => {
        const profile = {
          name: name?.value || '',
          username: username?.value || '',
          email: email?.value || ''
        };

        const check = this.validateProfile(profile);
        if (this.box) showMessage(this.box, check.message, check.ok ? 'ok' : 'warn');
        if (!check.ok) return;

        this.state = updateState({ profile, auth: { signedIn: true } });
        this.syncButtonText();

        setTimeout(() => go('dashboard'), 600);
      });
    }

    if (logout) {
      logout.addEventListener('click', (e) => {
        e.preventDefault();
        this.state = updateState({ auth: { signedIn: false } });
        this.syncButtonText();
        if (this.box) showMessage(this.box, 'Logged out', 'info');
        go('landing');
      });
    }

    if (del) {
      del.addEventListener('click', (e) => {
        e.preventDefault();
        const ok = window.confirm('Delete account?');
        if (!ok) return;
        resetState();
        go('landing');
      });
    }
  }
}
