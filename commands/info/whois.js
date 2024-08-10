const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const getApiKey = require("../../API_KEY");
const getCookie = require("../../COOKIE");
const chronosblox = require("chronosblox.js");
let apikey, cookie;

module.exports = {
  name: "whois",
  description: "find out more about a user.",
  options: [
    {
      name: "userid",
      description: "The userid to look up.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const userId = interaction.options.getNumber("userid");

    apikey = await getApiKey(interaction);
    cookie = await getCookie(interaction);

    if (apikey === null || cookie === null) {
      interaction.reply({
        content: "Bot is not setup. please use /config to set up the bot",
      });
      return;
    }

    await chronosblox.setAPIKey(apikey);
    await chronosblox.setCookie(cookie);

    const user = await chronosblox.getPlayerInfo(userId);
    let names = JSON.stringify(user.oldNames);

    if (names === "[]") {
      names = "None";
    }

    const embed = new EmbedBuilder()
      .setTitle("User Information")
      .setColor(0x808080)
      .setThumbnail(user.ProfilePictureUrl)
      .addFields(
        { name: "Username", value: `${user.username}` },
        { name: "Display Name", value: `${user.displayName}` },
        { name: "Joined At", value: `${user.joinDate.toUTCString()}` },
        {
          name: "Account Age",
          value: `${new Date().getFullYear() - user.joinDate.getFullYear()}`,
        },
        { name: "Description", value: `${user.blurb}` },
        { name: "Friend Count", value: `${user.friendCount}` },
        { name: "Banned on Roblox", value: `${user.isBanned}` },
        { name: "Old Names", value: `${names}` }
      )
      .setFooter({ text: `${userId}` });

    interaction.reply({ embeds: [embed] });
  },
};
