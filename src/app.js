const express = require("express");

const { connectDB } = require("./config/database");
const app = express();
const bcrypt = require("bcrypt");
const { User } = require("./models/user");

// const { adminAuth, userAuth } = require("./middlewares/auth");
app.use(express.json()); //middleware to convert json to js object

app.post("/signup", async (req, res) => {
  //Creating a new instance of the user model from the data that I got from the API
  try {
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully to the DB!");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid credentials");
  }
});

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const users = await User.find({ emailId: email });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error finding the user : " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error finding the user : " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User successfully deleted");
  } catch (err) {
    res.status(400).send("Error finding the user : " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "password", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
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
