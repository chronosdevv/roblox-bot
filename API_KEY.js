const KeysSchema = require("./Keys.js");

module.exports = async function (i) {
  const guildId = i.guild.id;

  // Check if the guild has a saved key
  const savedKey = await KeysSchema.findOne({ guildId });
  if (!savedKey) {
    return null;
  } else {
    return savedKey.key;
  }
};
