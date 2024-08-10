const { model, Schema } = require("mongoose");

const Keys = new Schema({
  guildId: {
    type: String,
    required: true,
  },

  key: {
    type: String,
    required: false,
  },

  Cookie: {
    type: String,
    required: false,
  },
});

module.exports = model("Keysxxxx", Keys);
