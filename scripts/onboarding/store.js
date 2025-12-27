// ./scripts/onboarding/store.js
import { GOALS } from './data.js';

export class Store {
  root;
  state;

  constructor(root) {
    this.root = root;
    this.state = {
      selectedGoal: null
    };
  }

  init() {
    this.toastEl = this.ensureToast(); // динамическое создание DOM
    this.restoreFromStorage();
    this.bindGoalChange();
    this.bindContinue();
    this.syncUI();
  }

  // --- Storage ---
  restoreFromStorage() {
    try {
      const raw = localStorage.getItem('onboarding_goal');
      if (raw) this.state.selectedGoal = raw;
    } catch {
      // молча — чтобы не было ошибок в консоли
    }
  }

  saveToStorage() {
    try {
      if (this.state.selectedGoal) {
        localStorage.setItem('onboarding_goal', this.state.selectedGoal);
      }
    } catch {
      // молча
    }
  }

  // --- UI helpers ---
  ensureToast() {
    let el = this.root.querySelector('[data-toast="1"]');
    if (el) return el;

    el = this.root.createElement('div');
    el.dataset.toast = '1';

    // fixed — НЕ ломает верстку (не участвует в потоке)
    el.style.position = 'absolute';
    el.style.left = '50%';
    el.style.bottom = '18px';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 12px';
    el.style.borderRadius = '14px';
    el.style.fontFamily = 'Inter, system-ui, sans-serif';
    el.style.fontSize = '14px';
    el.style.fontWeight = '600';
    el.style.background = 'rgba(0,0,0,0.85)';
    el.style.color = 'white';
    el.style.zIndex = '9999';
    el.style.display = 'none';
    el.style.pointerEvents = 'none';
    el.style.maxWidth = 'calc(100vw - 40px)';
    el.style.textAlign = 'center';

    const screen = this.root.querySelector('.screen') || this.root.body;
screen.appendChild(el);
    return el;
  }

  showToast(text) {
    if (!this.toastEl) return;
    this.toastEl.textContent = text;
    this.toastEl.style.display = 'block';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.style.display = 'none';
    }, 900);
  }

  getContinueButton() {
    return this.root.querySelector('.bottombar .cta');
  }

  getGoalInputs() {
    return [...this.root.querySelectorAll('input.choice__input[name="goal"]')];
  }

  goalLabel(value) {
    return GOALS.find((g) => g.value === value)?.label || value;
  }

  syncUI() {
    const btn = this.getContinueButton();
    if (btn) btn.disabled = !this.state.selectedGoal;

    // восстановить radio + легкая подсветка выбранной карточки (не меняет layout)
    for (const input of this.getGoalInputs()) {
      input.checked = input.value === this.state.selectedGoal;

      const label = input.closest('label.choice');
      if (label) {
        // только outline — не "толкает" элементы
        label.style.outline = input.checked ? '2px solid rgba(88, 134, 255, .7)' : '';
        label.style.outlineOffset = '2px';
        label.style.borderRadius = '16px';
      }
    }
  }

  // --- Events ---
  bindGoalChange() {
    const form = this.root.querySelector('form.choices');
    if (!form) return;

    form.addEventListener('change', (e) => {
      const input = e.target?.closest?.('input.choice__input[name="goal"]');
      if (!input) return;

      this.state.selectedGoal = input.value;
      this.saveToStorage();            // данные сохраняются
      this.syncUI();                   // изменение DOM
      this.showToast(`Selected: ${this.goalLabel(input.value)}`); // динамический DOM
    });
  }

  bindContinue() {
    const button = this.getContinueButton();
    if (!button) return;

    // Кнопка остаётся type="button" — формы не отправляем
    button.addEventListener('click', (event) => {
      event.preventDefault();

      if (!this.state.selectedGoal) {
        this.showToast('Choose one option');
        return;
      }

      // переход без ломания parcel
      window.location.href = './account.html';
    });
  }
}
