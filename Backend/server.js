// server.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Parse JSON bodies (use this instead of bodyParser)
app.use(express.json());

//  Serve frontend assets
app.use("/static", express.static(path.join(__dirname, "Frontend/static")));


//  API routes
app.use("/api/users", require("./routers/userRoutes"));
app.use("/api", require("./routers/profRoutes"));

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "register.html"));
});
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});
app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "dashboard.html"));
});
app.get("/myProgress.html", (req, res) =>
  res.sendFile(path.join(__dirname, "Frontend", "myProgress.html"))
);
app.get("/myExercise.html", (req, res) =>
  res.sendFile(path.join(__dirname, "Frontend", "myExercise.html"))
);
app.get("/todayPlan.html", (req, res) =>
  res.sendFile(path.join(__dirname, "Frontend", "todayPlan.html"))
);
// (optional) simple error logger to see real error texts
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
