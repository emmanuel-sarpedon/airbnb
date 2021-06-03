require("dotenv").config();

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, name, description, password } = req.fields;

    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400).json({
        error: "This email already has an account",
      });
    } else if (!email || !username || !name || !description || !password) {
      res.status(400).json({
        error: "Missing parameters",
      });
    } else {
      const salt = uid2(64);
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(64);

      const newUser = new User({
        email: email,
        account: {
          username: username,
          name: name,
          description: description,
          avatar: null,
        },
        hash: hash,
        salt: salt,
        token: token,
      });

      await newUser.save();

      res.status(200).json({
        _id: newUser._id,
        token: newUser.token,
        email: newUser.email,
        username: newUser.account.username,
        description: newUser.account.description,
        name: newUser.account.name,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;

    const user = await User.findOne({ email: email });

    if (user) {
      const hash = SHA256(password + user.salt).toString(encBase64);

      if (hash === user.hash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          email: user.email,
          username: user.account.username,
          description: user.account.description,
          name: user.account.name,
        });
      } else {
        res.status(400).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/user/upload_picture/:id", isAuthenticated, async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.params.id);
    if (userToUpdate.token !== req.user.token) {
      res
        .status(400)
        .json({ message: "Sorry, but you can't update this profile" });
    } else if (Object.keys(req.files).length === 0) {
      res.status(400).json({
        message: "Please, select a picture",
      });
    } else {
      const result = await cloudinary.uploader.upload(req.files.picture.path, {
        folder: "/airbnb/users/" + userToUpdate._id,
        public_id: userToUpdate._id,
      });

      userToUpdate.account.avatar = result;

      await userToUpdate.save();

      const userUpdated = await User.findById(req.params.id).select(
        "account.avatar.url account.avatar.picture_id account.username account.description account.name email rooms"
      );

      res.status(200).json(userUpdated);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/user/delete_picture/:id", isAuthenticated, async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.params.id);
    if (userToUpdate.token !== req.user.token) {
      res
        .status(400)
        .json({ message: "Sorry, but you can't update this profile" });
    } else {
      await cloudinary.api.delete_resources_by_prefix(
        "airbnb/users/" + req.user._id
      );

      await cloudinary.api.delete_folder("airbnb/users/" + req.user._id);

      userToUpdate.account.avatar = null;

      await userToUpdate.save();

      const userUpdated = await User.findById(req.params.id).select(
        "account email rooms"
      );

      res.status(200).json(userUpdated);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
