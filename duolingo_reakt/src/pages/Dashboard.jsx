import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { loadState } from "../app/state";

import maskot from "../assets/maskot.png";

import lessonsImg from "../assets/lessons.png";
import quizImg from "../assets/quiz.png";
import translateImg from "../assets/translate.png";
import libraryImg from "../assets/library.png";

import menu1 from "../assets/menu1.png";
import menu2 from "../assets/menu2.png";
import menu3 from "../assets/menu3.png";
import menu4 from "../assets/menu4.png";
import menu5 from "../assets/menu5.png";
import menu6 from "../assets/menu6.png";

const MESSAGES = [
  "Let’s start your Learning",
  "Small steps every day!",
  "You are doing great!",
  "Keep the streak alive!",
];

const TILES = [
  { key: "Lessons", className: "lessons", img: lessonsImg },
  { key: "Quiz", className: "quiz", img: quizImg },
  { key: "Translate", className: "translate", img: translateImg },
  { key: "Library", className: "library", img: libraryImg },
];

const DOCK = [
  { label: "Streak", img: menu1 },
  { label: "Dictionary", img: menu2 },
  { label: "Profile", img: menu3 },
  { label: "Shield", img: menu4 },
  { label: "Shop", img: menu5 },
  { label: "Bell", img: menu6 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [state] = useState(() => loadState());

  useEffect(() => {
    if (!state.auth.signedIn) navigate("/account", { replace: true });
  }, [state.auth.signedIn, navigate]);

  const message = useMemo(() => {
    if (!state.settings.motivational) return "Welcome back";
    return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  }, [state.settings.motivational]);

  const [selectedMode, setSelectedMode] = useState("");
  const canContinue = !!selectedMode;

  function onDock(label) {
    if (label === "Profile") navigate("/account");
    if (label === "Bell") window.alert("No notifications yet");
    if (label === "Dictionary") window.alert("Dictionary is coming soon");
  }

  function onContinue() {
    if (!selectedMode) return;
    window.alert(`Selected: ${selectedMode}`);
  }

  return (
    <div className="device">
      <div className="screen">
        <section className="intro">
          <img className="intro__mascot" src={maskot} alt="maskot" />
          <div className="bubble" role="status">
            <p className="bubble__text">{message}</p>
          </div>
        </section>

        <main className="grid">
          {TILES.map((t) => (
            <label className={`tile tile--${t.className}`} key={t.key}>
              <input
                className="tile__input"
                type="radio"
                name="mode"
                checked={selectedMode === t.key}
                onChange={() => setSelectedMode(t.key)}
              />
              <div className="tile__box">
                <div className="tile__icon">
                  <img src={t.img} alt={t.key.toLowerCase()} />
                </div>
                <div className="tile__title">{t.key}</div>
              </div>
            </label>
          ))}
        </main>

        <div className="cta">
          <button className="btn btn--primary" type="button" disabled={!canContinue} onClick={onContinue}>
            CONTINUE
          </button>
        </div>

        <nav className="dock" aria-label="quick actions">
          {DOCK.map((d) => (
            <button
              key={d.label}
              className="dock__btn"
              type="button"
              aria-label={d.label}
              onClick={() => onDock(d.label)}
            >
              <img className="dock__icon" src={d.img} alt={d.label} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
