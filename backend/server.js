const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/internships", require("./routes/internship"));
app.use("/api/applications", require("./routes/application"));
app.use("/uploads", express.static("uploads"));

/* CONNECT TO MONGODB HERE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
