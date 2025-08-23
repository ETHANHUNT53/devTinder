const express = require("express");

const { connectDB } = require("./config/database");
const app = express();

const { User } = require("./models/user");

// const { adminAuth, userAuth } = require("./middlewares/auth");
app.use(express.json()); //middleware to convert json to js object

app.post("/signup", async (req, res) => {
  //Creating a new instance of the user model from the data that I got from the API
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully to the DB!");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
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
