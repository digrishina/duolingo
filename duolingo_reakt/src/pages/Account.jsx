import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/account.css";
import { loadState, updateState, resetState } from "../app/state.js";


function validateProfile(profile) {
  const missing = [];
  if (!profile.name.trim()) missing.push("Name");
  if (!profile.username.trim()) missing.push("Username");
  if (!profile.email.trim()) missing.push("Email");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim());
  if (profile.email.trim() && !emailOk) {
    return { ok: false, message: "Email looks incorrect" };
  }
  if (missing.length) {
    return { ok: false, message: `Empty fields: ${missing.join(", ")}` };
  }
  return { ok: true, message: "Saved successfully" };
}

export default function Account() {
  const navigate = useNavigate();

  const initial = useMemo(() => loadState(), []);
  const [state, setState] = useState(initial);

  const [profile, setProfile] = useState(initial.profile);
  const [settings, setSettings] = useState(initial.settings);
  const [message, setMessage] = useState(null);

 
  useEffect(() => {
    const bar = document.querySelector(".progress__bar");
    const progress = document.querySelector(".progress");
    if (bar && progress) {
      bar.style.width = "100%";
      progress.setAttribute("aria-valuenow", "100");
    }
  }, []);

  const buttonText = state.auth.signedIn ? "SAVE" : "SIGN IN";

  function onProfileChange(field, value) {
    setMessage(null);
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function onToggle(key, checked) {
    const nextSettings = { ...settings, [key]: checked };
    setSettings(nextSettings);
    const next = updateState({ settings: { [key]: checked } });
    setState(next);
  }

  function onSubmit() {
    const check = validateProfile(profile);
    setMessage({ text: check.message, kind: check.ok ? "ok" : "warn" });
    if (!check.ok) return;

    const next = updateState({
      profile,
      auth: { signedIn: true },
    });
    setState(next);

    setTimeout(() => navigate("/dashboard"), 600);
  }

  function onLogout(e) {
    e.preventDefault();
    const next = updateState({ auth: { signedIn: false } });
    setState(next);
    setMessage({ text: "Logged out", kind: "info" });
    navigate("/");
  }

  function onDelete(e) {
    e.preventDefault();
    const ok = window.confirm("Delete account?");
    if (!ok) return;
    resetState();
    navigate("/");
  }

  return (
    <div className="device">
      <div className="screen">
        <header className="appbar">
          <button className="back" aria-label="Go back" onClick={() => navigate(-1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="100"
          >
            <span className="progress__bar" style={{ width: "100%" }} />
          </div>

          <span className="appbar__spacer" aria-hidden="true" />
        </header>

        <main className="content" role="main">
          <h1 className="title">Account</h1>

          {message && (
            <div
              style={{
                margin: "10px 4px 0",
                padding: "12px 14px",
                borderRadius: "16px",
                fontWeight: 800,
                border: "1px solid rgba(0,0,0,.08)",
                background:
                  message.kind === "ok"
                    ? "#EAF9E3"
                    : message.kind === "warn"
                    ? "#FFF4D6"
                    : message.kind === "danger"
                    ? "#FFE3E3"
                    : "#EEF7FF",
                color:
                  message.kind === "ok"
                    ? "#256B1B"
                    : message.kind === "warn"
                    ? "#7A4B00"
                    : message.kind === "danger"
                    ? "#7A0000"
                    : "#0A3A66",
              }}
            >
              {message.text}
            </div>
          )}

          <div className="group">
            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="input"
                type="text"
                value={profile.name}
                onChange={(e) => onProfileChange("name", e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field__label">Username</span>
              <input
                className="input"
                type="text"
                value={profile.username}
                onChange={(e) => onProfileChange("username", e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="input"
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange("email", e.target.value)}
              />
            </label>
          </div>

          <div className="cta-wrap">
            <button className="btn btn--primary" type="button" onClick={onSubmit}>
              {buttonText}
            </button>
          </div>

          <div className="group group--switches">
            <label className="switch-row">
              <span className="switch-row__label">Sound effects</span>
              <input
                className="switch__input"
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => onToggle("sound", e.target.checked)}
              />
              <span className="switch" aria-hidden="true" />
            </label>

            <label className="switch-row">
              <span className="switch-row__label">Animations</span>
              <input
                className="switch__input"
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => onToggle("animations", e.target.checked)}
              />
              <span className="switch" aria-hidden="true" />
            </label>

            <label className="switch-row">
              <span className="switch-row__label">Motivational messages</span>
              <input
                className="switch__input"
                type="checkbox"
                checked={settings.motivational}
                onChange={(e) => onToggle("motivational", e.target.checked)}
              />
              <span className="switch" aria-hidden="true" />
            </label>

            <label className="switch-row">
              <span className="switch-row__label">Listening exercises</span>
              <input
                className="switch__input"
                type="checkbox"
                checked={settings.listening}
                onChange={(e) => onToggle("listening", e.target.checked)}
              />
              <span className="switch" aria-hidden="true" />
            </label>
          </div>

          <nav className="links">
            <a className="link link--muted" href="#" onClick={onLogout}>
              LOGOUT
            </a>
            <a className="link link--danger" href="#" onClick={onDelete}>
              DELETE MY ACCOUNT
            </a>
          </nav>
        </main>
      </div>
    </div>
  );
}
