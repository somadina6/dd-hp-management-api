const express = require("express");
const characterRoutes = require("./routes/characterRoutes");

const app = express();

app.use(express.json());

app.use("/character", characterRoutes);

function handle404(req, res, next) {
  res.status(404).json({ error: "Resource not found" });
}
app.use(handle404);

module.exports = app;
