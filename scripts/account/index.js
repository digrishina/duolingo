import { qs, qsa } from "../core/dom.js";
import { getState, setState, resetState } from "../core/state.js";
import { showToast } from "../core/toast.js";

const inputs = qsa(".group .input");
const btn = qs(".cta-wrap .btn");
const switches = qsa(".group--switches .switch__input");
const logout = qs(".link--muted");
const del = qs(".link--danger");
const back = qs(".back");

const [nameInput, usernameInput, emailInput] = inputs;
const voiceBtns = qsa(".voice-btn");
const [nameVoiceBtn, usernameVoiceBtn, emailVoiceBtn] = voiceBtns;

const toastVoiceError = (code) => {
  if (code === "not_supported") {
    showToast("Voice input is not supported");
    return;
  }
  if (code === "not-allowed" || code === "service-not-allowed") {
    showToast("Allow microphone access");
    return;
  }
  if (code === "no-speech") {
    showToast("No speech detected");
    return;
  }
  showToast("Voice input error");
};

if (nameVoiceBtn && nameInput) {
  initSpeechRecognition(nameVoiceBtn, nameInput, { lang: "ru-RU", onError: toastVoiceError });
}
if (usernameVoiceBtn && usernameInput) {
  initSpeechRecognition(usernameVoiceBtn, usernameInput, { lang: "ru-RU", onError: toastVoiceError });
}
if (emailVoiceBtn && emailInput) {
  initSpeechRecognition(emailVoiceBtn, emailInput, { lang: "ru-RU", onError: toastVoiceError });
}



function initSpeechRecognition(trigger, target, { lang = "ru-RU", onError } = {}) {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    const onStart = () => {
      trigger.classList.add("recording");
      trigger.disabled = true;
    };

    const onEnd = () => {
      trigger.classList.remove("recording");
      trigger.disabled = false;
    };

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      recognition.start();
      onStart();
    });

    recognition.addEventListener("result", (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      target.value = transcript;

      target.dispatchEvent(new Event("input", { bubbles: true }));

      onEnd();
    });

    recognition.addEventListener("error", (event) => {
      if (typeof onError === "function") onError(event.error);
      onEnd();
    });

    recognition.addEventListener("end", onEnd);
  } else {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof onError === "function") onError("not_supported");
    });
  }
}


function readForm() {
  return {
    name: nameInput?.value?.trim() ?? "",
    username: usernameInput?.value?.trim() ?? "",
    email: emailInput?.value?.trim() ?? "",
  };
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function syncFromState() {
  const st = getState();

  if (nameInput) nameInput.value = st.user?.name ?? "";
  if (usernameInput) usernameInput.value = st.user?.username ?? "";
  if (emailInput) emailInput.value = st.user?.email ?? "";

  const s = st.settings || {};
  const map = [
    ["soundEffects", 0],
    ["animations", 1],
    ["motivationalMessages", 2],
    ["listeningExercises", 3],
  ];

  map.forEach(([key, idx]) => {
    const sw = switches[idx];
    if (!sw) return;
    sw.checked = Boolean(s[key]);
  });
}

syncFromState();

inputs.forEach((inp) => {
  inp?.addEventListener("input", () => {
    const { name, username, email } = readForm();
    setState({ user: { name, username, email } });
  });
});

switches.forEach((sw, idx) => {
  sw?.addEventListener("change", () => {
    const keys = ["soundEffects", "animations", "motivationalMessages", "listeningExercises"];
    const key = keys[idx];
    if (!key) return;
    setState({ settings: { [key]: sw.checked } });
    showToast("Saved");
  });
});

if (btn) {
  btn.addEventListener("click", () => {
    const { name, username, email } = readForm();

    if (!name || !username || !email) {
      showToast("Fill all fields");
      return;
    }
    if (!isEmailValid(email)) {
      showToast("Invalid email");
      return;
    }

    setState({ user: { name, username, email, signedIn: true } });
    showToast("Signed in");
    location.href = "./dashboard.html";
  });
}

if (logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    const st = getState();
    setState({ user: { ...st.user, signedIn: false } });
    showToast("Logged out");
    location.href = "./landing.html";
  });
}

if (del) {
  del.addEventListener("click", (e) => {
    e.preventDefault();
    resetState();
    showToast("Account deleted");
    location.href = "./landing.html";
  });
}

if (back) {
  back.addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });
}
