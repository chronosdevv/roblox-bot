const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const Keys = require("../../Keys");
const getApiKey = require("../../API_KEY");
const getCookie = require("../../COOKIE");
const chronosblox = require("chronosblox.js");
let apikey, cookie;

module.exports = {
  name: "topic",
  description: "publish a messaging service topic from discord to your game.",
  options: [
    {
      name: "universeid",
      description: "The universe to send topic to",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },

    {
      name: "topic",
      description: "The first topic to send to the messaging service",
      type: ApplicationCommandOptionType.String,
      required: true,
    },

    {
      name: "data1",
      description: "The first data sent to the messaging service",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "data2",
      description: "The second data sent to the messaging service",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "data3",
      description: "The third data sent to the messaging service",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "data4",
      description: "The fourth data sent to the messaging service",
      type: ApplicationCommandOptionType.String,
    },

    {
      name: "data5",
      description: "The fifth data sent to the messaging service",
      type: ApplicationCommandOptionType.String,
    },
  ],
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
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

    const guild = interaction.guild;
    const universeId = interaction.options.getNumber("universeid");
    const topic = interaction.options.getString("topic");
    const settings = interaction.options._hoistedOptions;
    let size = 0;
    settings.forEach((key) => {
      size++;
    });

    const embed = new EmbedBuilder();
    let s = {};

    if (size === 1) {
      embed.setDescription("Please provide at least one variable to send");
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await settings.forEach((key, index) => {
      if (key.name.includes("data")) {
        console.log(key.value);
        s[parseInt(index) - 2] = key.value;
      }
    });

    console.log(s);

    s = JSON.stringify(s);

    try {
      const response = await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${universeId}/topics/${topic}`,
        {
          message: s,
        },
        {
          headers: {
            "x-api-key": apikey,
          },
        }
      );
    } catch (e) {
      console.log(e);
      embed.setDesription(
        "An error occurred while trying to send the topic. Please check your API key and try again.\n " +
          e
      );
      interaction.reply({ embeds: [embed] });
    }
  },
};
