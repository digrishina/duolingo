import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const goals = [
  { id: "travel", title: "Prepare for travel" },
  { id: "career", title: "Boost my career" },
  { id: "education", title: "Support my education" },
  { id: "people", title: "Connect with people" },
  { id: "fun", title: "Just for fun" },
  { id: "productive", title: "Spend time productively" },
];

let onboarding = { goal: null };

app.get("/api/goals", (req, res) => res.json(goals));
app.get("/api/onboarding", (req, res) => res.json(onboarding));

app.put("/api/onboarding/goal", (req, res) => {
  const { goal } = req.body || {};
  const exists = goals.some((g) => g.id === goal);
  if (!exists) return res.status(400).json({ message: "Unknown goal" });

  onboarding.goal = goal;
  res.json(onboarding);
});

app.listen(3001, () => {
  console.log("API on http://localhost:3001");
});
