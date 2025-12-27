import { qs, qsa } from "../core/dom.js";
import { getState, setState } from "../core/state.js";
import { showToast } from "../core/toast.js";

const bubbleText = qs(".bubble__text");
const tiles = qsa('.tile__input[name="mode"]');
const ctaBtn = qs(".cta .btn");
const dockBtns = qsa(".dock__btn");

function applyBubble() {
  const st = getState();
  const goal = st.onboarding?.goal;
  const name = st.user?.name || "friend";
  const mode = st.dashboard?.mode;

  const goalMap = {
    travel: "travel",
    career: "career",
    education: "study",
    people: "connect",
    fun: "have fun",
    productive: "be productive",
  };

  const g = goal ? (goalMap[goal] || goal) : null;

  let text = `Let’s start your Learning`;
  if (g) text = `Hi, ${name}! Let’s learn for ${g}`;
  if (mode) text = `Selected: ${mode}. Ready, ${name}?`;

  if (bubbleText) bubbleText.textContent = text;
}

applyBubble();

if (ctaBtn) ctaBtn.disabled = true;

tiles.forEach((t) => {
  t.addEventListener("change", () => {
    const picked = tiles.find(x => x.checked)?.closest(".tile")?.classList;
    let mode = null;

    if (picked?.contains("tile--lessons")) mode = "Lessons";
    if (picked?.contains("tile--quiz")) mode = "Quiz";
    if (picked?.contains("tile--translate")) mode = "Translate";
    if (picked?.contains("tile--library")) mode = "Library";

    setState({ dashboard: { mode } });
    if (ctaBtn) ctaBtn.disabled = false;
    applyBubble();
  });
});

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    const st = getState();
    if (!st.dashboard?.mode) {
      showToast("Pick a mode");
      return;
    }
    showToast("Continue");
  });
}

dockBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.getAttribute("aria-label") || "Action";

    if (label === "Profile") {
      location.href = "./account.html";
      return;
    }

    showToast(label);
  });
});
