const { Schema, model } = require("mongoose");

const WowCharacterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  class: {
    type: String,
  },
});

module.exports = model("WowCharacter", WowCharacterSchema);
