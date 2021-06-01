const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const userRoutes = require("./routes/user.js");
const roomRoutes = require("./routes/room");

const app = express();
app.use(formidable());
app.use(userRoutes);
app.use(roomRoutes);

app.all("*", (req, res) => {
  res.status(400).json({ error: "Page not found" });
  console.log("/!\\ Unknown route");
});

app.listen(process.env.PORT, () => {
  console.log("Server Has Started. Listening Port " + process.env.PORT);
});
