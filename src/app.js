const express = require("express");

const { connectDB } = require("./config/database");
const app = express();

const { User } = require("./models/user");

// const { adminAuth, userAuth } = require("./middlewares/auth");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Shaurya",
    lastName: "Jaiswal",
    emailId: "shaurya@jaiswal.com",
    password: "shaurya@123",
    age: 23,
    gender: "Male",
  };

  const user = new User(userObj);
  try {
    await user.save();
    res.send("User added successfully to the DB!");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(2000, () => {
      console.log("Server is running on PORT 2000");
    });
  })
  .catch((err) => {
    console.log("Database connection cannot be established!");
  });
// app.use("/admin", adminAuth);

// app.get("/user", userAuth, (req, res) => {
//   res.send("All data sent");
// });

// app.get("/user/login", (req, res) => {
//   res.send("User logged in successfully");
// });

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All data sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("deleted user");
// });
