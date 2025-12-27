import { showToast } from "../core/toast.js";
import { getState } from "../core/state.js";

const btnStart = document.querySelector('.actions .btn--primary');
const btnHave = document.querySelector('.actions .btn--secondary');

if (btnStart) {
  btnStart.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "./onboarding.html";
  });
}

if (btnHave) {
  btnHave.addEventListener("click", (e) => {
    e.preventDefault();
    const st = getState();
    if (st.user?.signedIn) location.href = "./dashboard.html";
    else {
      showToast("Please sign in first");
      location.href = "./account.html";
    }
  });
}
