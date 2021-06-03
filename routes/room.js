require("dotenv").config();

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

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
const Room = require("../models/Room");

// --- CREATE ---
router.post("/room/publish", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { title, description, price, lat, lng } = req.fields;

    const newRoom = new Room({
      title: title,
      description: description,
      price: price,
      location: {
        lat: lat,
        lng: lng,
      },
      photos: [],
      user: req.user,
    });

    await newRoom.save();

    user.rooms.push(newRoom._id);

    await user.save();

    res.json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- READ ---
router.get("/rooms", isAuthenticated, async (req, res) => {
  try {
    const rooms = await Room.find().select("photos title price location user");

    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/rooms/:id", isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findById({ _id: req.params.id }).populate({
      path: "user",
      select: "account",
    });

    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- UPDATE ---
router.put("/room/update/:id", isAuthenticated, async (req, res) => {
  try {
    const roomToUpdate = await Room.findById(req.params.id);

    if (!roomToUpdate) {
      res.status(400).json({ message: "Room not found" });
    } else {
      const roomOwner = await User.findById(roomToUpdate.user);

      if (roomOwner.token !== req.user.token) {
        res
          .status(400)
          .json({ message: "Sorry, but you can't update this offer" });
      } else {
        const { title, description, price, lat, lng } = req.fields;

        if (!title && !description && !price && !lat && !lng) {
          res
            .status(400)
            .json({ message: "Need at least one field to modify" });
        } else {
          if (title) {
            roomToUpdate.title = title;
          }
          if (description) {
            roomToUpdate.description = description;
          }
          if (price) {
            roomToUpdate.price = price;
          }
          if (lat) {
            roomToUpdate.location.lat = lat;
          }
          if (lng) {
            roomToUpdate.location.lng = lng;
          }

          await roomToUpdate.save();

          res.status(200).json(roomToUpdate);
        }
        //res.status(200).json("OK");
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/room/upload_picture/:id", isAuthenticated, async (req, res) => {
  try {
    const roomToUpdate = await Room.findById(req.params.id);
    const roomOwner = await User.findById(roomToUpdate.user);
    const picturesToUpload = Object.keys(req.files);

    if (roomOwner.token !== req.user.token) {
      res
        .status(400)
        .json({ message: "Sorry, but you can't update this offer" });
    } else {
      if (picturesToUpload.length === 0) {
        res
          .status(400)
          .json({ message: "Please, select at least one picture" });
      } else if (picturesToUpload.length + roomToUpdate.photos.length > 5) {
        res.status(400).json({ message: "Five pictures max per room" });
      } else {
        for (let i = 0; i < picturesToUpload.length; i++) {
          const result = await cloudinary.uploader.upload(
            req.files[picturesToUpload[i]].path,
            {
              folder: "airbnb/rooms/" + req.params.id,
            }
          );

          roomToUpdate.photos.push({
            url: result.url,
            picture_id: result.public_id.split("/").pop(),
          });
        }

        await roomToUpdate.save();

        res.json(roomToUpdate);
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// --- DELETE ---
router.delete("/room/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const roomToDelete = await Room.findById(req.params.id);

    if (!roomToDelete) {
      res.status(400).json({ message: "Room not found" });
    } else {
      const roomOwner = await User.findById(roomToDelete.user);

      if (roomOwner.token !== req.user.token) {
        res
          .status(400)
          .json({ message: "Sorry, but you can't delete this offer" });
      } else {
        await Room.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: "Room deleted" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
