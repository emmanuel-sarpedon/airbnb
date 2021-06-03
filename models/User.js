const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  email: { type: String, unique: true, required: true },

  account: {
    username: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String },
    avatar: Object,
  },
  rooms: Array,
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  token: { type: String, required: true },
});

module.exports = User;
