export function getScreenRoot() {
  const screen = document.querySelector(".screen");
  if (!screen) return document.body;
  const pos = getComputedStyle(screen).position;
  if (pos === "static") screen.style.position = "relative";
  return screen;
}

export function toast(message) {
  const root = getScreenRoot();

  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.textContent = message;

  el.style.position = "absolute";
  el.style.left = "14px";
  el.style.right = "14px";
  el.style.bottom = "14px";
  el.style.padding = "12px 14px";
  el.style.borderRadius = "14px";
  el.style.background = "#2f3a46";
  el.style.color = "#fff";
  el.style.fontWeight = "700";
  el.style.textAlign = "center";
  el.style.boxShadow = "0 4px 0 rgba(0,0,0,.12)";
  el.style.zIndex = "50";
  el.style.opacity = "0";
  el.style.transform = "translateY(8px)";
  el.style.transition = "opacity .18s ease, transform .18s ease";
  el.style.pointerEvents = "none";

  root.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });

  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    window.setTimeout(() => el.remove(), 220);
  }, 1200);
}

export function confirmModal({ title = "Are you sure?", text = "", okText = "OK", cancelText = "Cancel" }) {
  const root = getScreenRoot();

  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,.35)";
  overlay.style.zIndex = "60";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "16px";

  const card = document.createElement("div");
  card.style.width = "100%";
  card.style.maxWidth = "320px";
  card.style.background = "#fff";
  card.style.borderRadius = "16px";
  card.style.boxShadow = "0 12px 42px rgba(0,0,0,.18)";
  card.style.border = "1px solid #E6E7EA";
  card.style.padding = "14px";

  const h = document.createElement("div");
  h.textContent = title;
  h.style.fontWeight = "800";
  h.style.fontSize = "16px";
  h.style.margin = "2px 2px 8px";

  const p = document.createElement("div");
  p.textContent = text;
  p.style.color = "#45474c";
  p.style.fontWeight = "600";
  p.style.fontSize = "13px";
  p.style.lineHeight = "1.35";
  p.style.margin = "0 2px 12px";

  const actions = document.createElement("div");
  actions.style.display = "grid";
  actions.style.gridTemplateColumns = "1fr 1fr";
  actions.style.gap = "10px";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = cancelText;
  cancel.style.border = "2px solid #E5E7EB";
  cancel.style.background = "#fff";
  cancel.style.color = "#1CB0F6";
  cancel.style.borderRadius = "14px";
  cancel.style.height = "44px";
  cancel.style.fontWeight = "800";
  cancel.style.cursor = "pointer";

  const ok = document.createElement("button");
  ok.type = "button";
  ok.textContent = okText;
  ok.style.border = "none";
  ok.style.background = "#58CC02";
  ok.style.color = "#fff";
  ok.style.borderRadius = "14px";
  ok.style.height = "44px";
  ok.style.fontWeight = "800";
  ok.style.cursor = "pointer";
  ok.style.boxShadow = "0 4px 0 #53B305";

  actions.append(cancel, ok);
  card.append(h, p, actions);
  overlay.append(card);
  root.appendChild(overlay);

  return new Promise((resolve) => {
    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    cancel.addEventListener("click", () => close(false));
    ok.addEventListener("click", () => close(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });
  });
}

export function setProgress(percent) {
  const bar = document.querySelector(".progress__bar");
  const wrap = document.querySelector(".progress");
  if (!bar) return;

  const p = Math.max(0, Math.min(100, percent));
  bar.style.width = `${p}%`;
  if (wrap) wrap.setAttribute("aria-valuenow", String(p));
}
