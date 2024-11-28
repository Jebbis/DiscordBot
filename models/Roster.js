const { Schema, model } = require("mongoose");

const RosterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
  },
});

module.exports = model("Roster", RosterSchema);
