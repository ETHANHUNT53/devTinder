const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("All data sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("deleted user");
});
