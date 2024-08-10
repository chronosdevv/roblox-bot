const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const Keys = require("../../Keys");

module.exports = {
  name: "config",
  description: "set up the bot for your game.",
  options: [],
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const guild = interaction.guild;
    const channel = interaction.channel;

    interaction.reply({
      content:
        "Please create an open cloud api token with the following permissions: [UserRestrictions, User, MessagingService]",
      ephemeral: true,
    });

    const filter = (m) => m.author.id === interaction.user.id;
    const collected = await channel.awaitMessages({
      filter,
      max: 1,
    });

    const msg = collected.first();
    const key = msg.content;

    msg.delete(1000);

    interaction.editReply({
      content:
        "Please make a new account on roblox and provide the cookie this will be required for a lot of features.",
      ephemeral: true,
    });

    const collected1 = await channel.awaitMessages({
      filter,
      max: 1,
    });

    const msg1 = collected1.first();
    const cookie = msg1.content;

    msg1.delete(1000);

    interaction.editReply({
      content: "Bot setup is all done!",
      ephemeral: true,
    });

    const _d = await Keys.findOne({ guildId: guild.id });

    if (_d) {
      _d.key = key;
      _d.cookie = cookie;
      await _d.save();
    } else {
      const newx = new Keys({
        guildId: guild.id,
        key: key,
        Cookie: cookie,
      });
      await newx.save();
    }
  },
};
