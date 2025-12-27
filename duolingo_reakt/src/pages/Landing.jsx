import { useNavigate } from "react-router-dom";
import "../styles/landing.css";


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="device">
      <div className="screen">
        <header className="brand" aria-label="duolingo">
          <span className="brand__type">duolingo</span>
        </header>

        <main className="content" role="main">
          <figure className="art" aria-hidden="true">
          </figure>

          <h1 className="title">
            The free, fun, and<br />
            effective way to learn a<br />
            language!
          </h1>
        </main>

        <nav className="actions" aria-label="actions">
          <a
            className="btn btn--primary"
            href="#get-started"
            onClick={(e) => {
              e.preventDefault();
              navigate("/onboarding");
            }}
          >
            GET STARTED
          </a>
          <a
            className="btn btn--secondary"
            href="#signin"
            onClick={(e) => {
              e.preventDefault();
              navigate("/account");
            }}
          >
            I ALREADY HAVE AN ACCOUNT
          </a>
        </nav>
      </div>
    </div>
  );
}
