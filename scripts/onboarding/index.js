import { qs, qsa } from "../core/dom.js";
import { setState, getState } from "../core/state.js";
import { showToast } from "../core/toast.js";

const form = qs("form.choices");
const cta = qs("footer .cta");
const radios = qsa('input[type="radio"][name="goal"]');

if (cta) cta.disabled = true;

const st = getState();
if (st.onboarding?.goal) {
  const r = radios.find(x => x.value === st.onboarding.goal);
  if (r) {
    r.checked = true;
    if (cta) cta.disabled = false;
  }
}

if (form) {
  form.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== "goal") return;

    setState({ onboarding: { goal: target.value } });
    if (cta) cta.disabled = false;
  });
}

if (cta) {
  cta.addEventListener("click", () => {
    const picked = radios.find(r => r.checked)?.value ?? null;
    if (!picked) {
      showToast("Choose one option");
      return;
    }
    showToast("Saved");
    location.href = "./account.html";
  });
}

const back = qs(".back");
if (back) {
  back.addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });
}
