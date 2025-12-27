import { MESSAGES } from './data.js';
import { go } from '../common/router.js';
import { loadState } from '../common/state.js';

export class Store {
  root;
  state;

  constructor(root) {
    this.root = root;
    this.state = loadState();
  }

  init() {
    this.guard();
    this.ui();
    this.events();
  }

  guard() {
    if (!this.state.auth.signedIn) {
      go('account');
    }
  }

  ui() {
    const bubble = this.root.querySelector('.bubble__text');
    if (bubble) {
      if (this.state.settings.motivational) {
        const i = Math.floor(Math.random() * MESSAGES.length);
        bubble.textContent = MESSAGES[i];
      } else {
        bubble.textContent = 'Welcome back';
      }
    }
  }

  events() {
    const btn = this.root.querySelector('.cta .btn');
    const radios = [...this.root.querySelectorAll('input.tile__input[name="mode"]')];

    for (const r of radios) {
      r.addEventListener('change', () => {
        if (btn) btn.disabled = false;
      });
    }

    if (btn) {
      btn.addEventListener('click', () => {
        const selected = this.root.querySelector('input.tile__input[name="mode"]:checked');
        if (!selected) return;
        const tile = selected.closest('.tile');
        const title = tile?.querySelector('.tile__title')?.textContent || 'Mode';
        window.alert(`Selected: ${title}`);
      });
    }

    const dock = this.root.querySelector('.dock');
    if (dock) {
      dock.addEventListener('click', (e) => {
        const b = e.target.closest('button.dock__btn');
        if (!b) return;

        const label = b.getAttribute('aria-label') || '';
        if (label === 'Profile') go('account');
        if (label === 'Bell') window.alert('No notifications yet');
        if (label === 'Dictionary') window.alert('Dictionary is coming soon');
      });
    }
  }
}
