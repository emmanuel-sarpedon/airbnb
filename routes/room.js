const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");
const Room = require("../models/Room");

// --- CREATE ---
router.post("/room/publish", isAuthenticated, async (req, res) => {
  try {
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
