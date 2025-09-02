const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Edit not allowed!");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const user = req.user;
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Enter correct password!");
    }
    if (!newPassword) {
      throw new Error("Enter new password!");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter a strong password");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password changed successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {});
module.exports = profileRouter;
