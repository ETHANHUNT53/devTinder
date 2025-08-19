const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/hello", (req, res) => {
  res.send("Hello Hello!");
});

app.use("/test", (req, res) => {
  res.send("Hello Test!");
});
