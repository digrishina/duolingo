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
    this.ui();
    this.actions();
  }

  ui() {
    const a = this.root.querySelector('.actions');
    if (!a) return;

    const buttons = [...a.querySelectorAll('a.btn')];
    const getStarted = buttons.find((x) => (x.getAttribute('href') || '').includes('get-started'));
    const signIn = buttons.find((x) => (x.getAttribute('href') || '').includes('signin'));

    if (getStarted) getStarted.dataset.nav = 'onboarding';
    if (signIn) signIn.dataset.nav = 'account';
  }

  actions() {
    const a = this.root.querySelector('.actions');
    if (!a) return;

    a.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const page = link.dataset.nav;
      if (!page) return;
      e.preventDefault();
      go(page);
    });
  }
}
