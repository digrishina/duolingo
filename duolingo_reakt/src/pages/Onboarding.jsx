import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";
import { loadState, updateState } from "../app/state";

import maskot from "../assets/maskot.png";
import travelImg from "../assets/travel.png";
import careerImg from "../assets/career.png";
import educationImg from "../assets/education.png";
import peopleImg from "../assets/people.png";
import funImg from "../assets/fun.png";
import brainImg from "../assets/brain.png";

const GOALS = [
  { value: "travel", label: "Prepare for travel", icon: travelImg },
  { value: "career", label: "Boost my career", icon: careerImg },
  { value: "education", label: "Support my education", icon: educationImg },
  { value: "people", label: "Connect with people", icon: peopleImg },
  { value: "fun", label: "Just for fun", icon: funImg },
  { value: "productive", label: "Spend time productively", icon: brainImg },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => loadState().onboarding.goal || "");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const bar = document.querySelector(".progress__bar");
    const progressEl = document.querySelector(".progress");
    if (bar && progressEl) {
      bar.style.width = "20%";
      progressEl.setAttribute("aria-valuenow", "20");
    }
  }, []);

  function showToast(text) {
    setToast(text);
    setTimeout(() => setToast(""), 900);
  }

  function onChoose(value) {
    setSelected(value);
    updateState({ onboarding: { goal: value } });
    showToast(`Selected: ${GOALS.find((g) => g.value === value)?.label || value}`);
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

          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20">
            <span className="progress__bar" style={{ width: "20%" }} />
          </div>

          <span className="appbar__spacer" aria-hidden="true"></span>
        </header>

        <main className="content" role="main">
          <div className="prompt">
            <img className="prompt__mascot" src={maskot} alt="maskot" />
            <h1 className="prompt__title">Why are you learning a language?</h1>
          </div>

          <form className="choices">
            {GOALS.map((g) => (
              <label
                className="choice"
                key={g.value}
                style={{
                  outline: selected === g.value ? "2px solid rgba(88, 134, 255, .7)" : "",
                  outlineOffset: "2px",
                  borderRadius: "16px",
                }}
              >
                <input
                  className="choice__input"
                  type="radio"
                  name="goal"
                  value={g.value}
                  checked={selected === g.value}
                  onChange={() => onChoose(g.value)}
                />

                <span className="choice__box">
                  <span className="choice__icon" aria-hidden="true">
                    <img src={g.icon} alt={g.value} />
                  </span>
                  <span className="choice__text">{g.label}</span>
                </span>
              </label>
            ))}
          </form>

          {toast && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "18px",
                transform: "translateX(-50%)",
                padding: "10px 12px",
                borderRadius: "14px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                background: "rgba(0,0,0,0.85)",
                color: "white",
                zIndex: 9999,
                maxWidth: "calc(100vw - 40px)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              {toast}
            </div>
          )}
        </main>

        <footer className="bottombar">
          <button className="cta" type="button" disabled={!selected} onClick={() => navigate("/account")}>
            CONTINUE
          </button>
        </footer>
      </div>
    </div>
  );
}
