const express=require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB=require("./config/db");
const path = require("path"); 

dotenv.config();
connectDB();
const app = express();
app.use(bodyParser.json());

//serve frontenf files 
app.use(express.static(path.join(__dirname, "Frontend")));
// Routes
app.use("/api/users", require("./routers/userRoutes"));

// Default route → load login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "login.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
