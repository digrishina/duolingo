import { el, qs } from "./dom.js";

export function showToast(message, { duration = 1200 } = {}) {
  const screen = qs(".screen");
  if (!screen) return;

  screen.style.position = screen.style.position || "relative";

  const toast = el("div", { class: "js-toast", role: "status" }, [
    el("div", { class: "js-toast__pill", text: message }),
  ]);

  injectToastStylesOnce();
  screen.append(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 220);
  }, duration);
}

let stylesInjected = false;

function injectToastStylesOnce() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = el("style", { html: `
    .js-toast{
      position:absolute;
      left:12px;
      right:12px;
      bottom:12px;
      display:flex;
      justify-content:center;
      pointer-events:none;
      opacity:0;
      transform:translateY(8px);
      transition:opacity .18s ease, transform .18s ease;
      z-index:50;
    }
    .js-toast.is-visible{
      opacity:1;
      transform:translateY(0);
    }
    .js-toast__pill{
      pointer-events:none;
      background:#2f3a46;
      color:#fff;
      padding:10px 14px;
      border-radius:14px;
      font-weight:700;
      box-shadow:0 6px 18px rgba(0,0,0,.18);
      max-width:100%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  `});
  document.head.append(style);
}
