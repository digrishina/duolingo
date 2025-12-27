import { getGoals, getOnboarding, saveGoal } from "./api.js";
import { getState, setState } from "../core/state.js";
import { showToast } from "../core/toast.js";

const ICONS = {
  travel: "/assets/travel.png",
  career: "/assets/career.png",
  education: "/assets/education.png",
  people: "/assets/people.png",
  fun: "/assets/fun.png",
  productive: "/assets/brain.png",
};

export class Store {
  constructor() {
    this.goals = [];
    this.filteredGoals = [];
    this.selectedGoal = null;

    this.form = null;
    this.cta = null;
    this.content = null;
  }

  async init() {
    this.form = document.querySelector("form.choices");
    this.cta = document.querySelector("footer .cta");
    this.content = document.querySelector(".content");

    if (!this.form || !this.cta || !this.content) return;

    this.cta.disabled = true;

    this.goals = await getGoals();
    this.filteredGoals = this.goals;

    const onboard = await getOnboarding().catch(() => ({ goal: null }));
    this.selectedGoal = onboard.goal ?? null;

    const st = getState();
    if (!this.selectedGoal && st.onboarding?.goal) {
      this.selectedGoal = st.onboarding.goal;
    }

    this._ensureSearch();
    this._renderGoals();
    this._applySelectedState();
    this._bindEvents();
  }

  _bindEvents() {
    this.form.addEventListener("change", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.name !== "goal") return;

      this.selectedGoal = t.value;
      setState({ onboarding: { goal: this.selectedGoal } });

      this.cta.disabled = false;
      this._setProgress(40);
    });

    this.cta.addEventListener("click", async () => {
      if (!this.selectedGoal) {
        showToast("Choose one option");
        return;
      }

      await saveGoal(this.selectedGoal);
      showToast("Saved");
      location.href = "./account.html";
    });

    const back = document.querySelector(".back");
    if (back) {
      back.addEventListener("click", (e) => {
        e.preventDefault();
        history.back();
      });
    }
  }

  _ensureSearch() {
    let input = this.content.querySelector('[data-role="goal-search"]');
    if (input) return;

    input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search";
    input.setAttribute("data-role", "goal-search");

    input.style.padding = "12px 14px";
    input.style.borderRadius = "14px";
    input.style.border = "1px solid #E6E7EA";
    input.style.fontFamily = "inherit";

    this.content.insertBefore(input, this.form);

    input.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      this.filteredGoals = !q
        ? this.goals
        : this.goals.filter(
            (g) =>
              g.title.toLowerCase().includes(q) ||
              g.id.toLowerCase().includes(q)
          );

      this._renderGoals();
      this._applySelectedState();
    });
  }

  _renderGoals() {
    this.form.innerHTML = "";

    for (const g of this.filteredGoals) {
      const label = document.createElement("label");
      label.className = "choice";

      label.innerHTML = `
        <input class="choice__input" type="radio" name="goal" value="${g.id}">
        <span class="choice__box">
          <span class="choice__icon" aria-hidden="true">
            <img src="${ICONS[g.id] ?? ""}" alt="" onerror="this.style.display='none'">
          </span>
          <span class="choice__text">${g.title}</span>
        </span>
      `;

      this.form.appendChild(label);
    }
  }

  _applySelectedState() {
    const radios = Array.from(this.form.querySelectorAll('input[name="goal"]'));
    const match = radios.find((r) => r.value === this.selectedGoal);

    if (match) {
      match.checked = true;
      this.cta.disabled = false;
      this._setProgress(40);
    } else {
      this.cta.disabled = true;
      this._setProgress(20);
    }
  }

  _setProgress(percent) {
    const bar = document.querySelector(".progress__bar");
    const wrap = document.querySelector(".progress");
    if (bar) bar.style.width = `${percent}%`;
    if (wrap) wrap.setAttribute("aria-valuenow", String(percent));
  }
}
