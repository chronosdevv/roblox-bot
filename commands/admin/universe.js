const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const getApiKey = require("../../API_KEY");
const getCookie = require("../../COOKIE");
const chronosblox = require("chronosblox.js");
let cached = [];
let apikey, cookie;

module.exports = {
  name: "universe",
  description: "edit your game.",
  options: [
    {
      name: "setsettings",
      description: "set the game's universe settings",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "universeid",
          description: "The universe to set settings for",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "gname",
          description: "set the game's name",
          type: ApplicationCommandOptionType.String,
        },

        {
          name: "description",
          description: "set the game's description",
          type: ApplicationCommandOptionType.String,
        },

        {
          name: "genre",
          description: "set the game's genre",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "All",
              value: "All",
            },

            {
              name: "Adventure",
              value: "Adventure",
            },

            {
              name: "RPG",
              value: "RPG",
            },

            {
              name: "FPS",
              value: "FPS",
            },

            {
              name: "Tutorial",
              value: "Tutorial",
            },

            {
              name: "War",
              value: "War",
            },

            {
              name: "Fantasy",
              value: "Fantasy",
            },

            {
              name: "Sports",
              value: "Sports",
            },

            {
              name: "Wildwest",
              value: "Wildwest",
            },

            {
              name: "SciFi",
              value: "SciFi",
            },

            {
              name: "Pirate",
              value: "Pirate",
            },

            {
              name: "Funny",
              value: "Funny",
            },

            {
              name: "Scary",
              value: "Scary",
            },

            {
              name: "TownAndCity",
              value: "TownAndCity",
            },

            {
              name: "Ninja",
              value: "Ninja",
            },
          ],
        },

        {
          name: "price",
          description: "set the game's price",
          type: ApplicationCommandOptionType.Number,
        },

        {
          name: "forsale",
          description: "set whether the game is for sale or not",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "studioapiaccess",
          description: "set studio API access.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "thirdpartypurchases",
          description: "set whether third-party purchases are allowed.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "thirdpartyteleports",
          description: "set whether third-party teleports are allowed.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "optinregions",
          description: "set whether to opt-in regions for the game.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "China",
              value: "China",
            },
            {
              name: "Unknown",
              value: "Unknown",
            },
          ],
        },

        {
          name: "playabledevices",
          description: "set the game's playable devices.",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "PC",
              value: "Computer",
            },

            {
              name: "Phone",
              value: "Phone",
            },

            {
              name: "Console",
              value: "Console",
            },

            {
              name: "Tablet",
              value: "Tablet",
            },

            {
              name: "Mobile and Tablet",
              value: "Mobile, Tablet",
            },

            {
              name: "PC and Phone",
              value: "Computer, Phone",
            },

            {
              name: "PC and Console",
              value: "Computer, Console",
            },

            {
              name: "PC, Phone and Console",
              value: "Computer, Phone, Console",
            },

            {
              name: "Phone and Console",
              value: "Phone, Console",
            },

            {
              name: "Phone, Tablet and Console",
              value: "Phone, Tablet, Console",
            },

            {
              name: "PC, Phone and Tablet",
              value: "Computer, Phone, Tablet",
            },

            {
              name: "All",
              value: "Phone, Tablet ,Console, Computer",
            },
          ],
        },

        {
          name: "friendsonly",
          description:
            "set whether only friends with the bot account are allowed to play the game.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "avatartype",
          description: "set the game's avatar type.",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "R6",
              value: "MorphToR6",
            },

            {
              name: "R15",
              value: "MorphToR15",
            },

            {
              name: "PlayerChoice",
              value: "PlayerChoice",
            },
          ],
        },

        {
          name: "privateservers",
          description: "set whether private servers are allowed.",
          type: ApplicationCommandOptionType.Boolean,
          choices: [
            {
              name: "True",
              value: true,
            },

            {
              name: "False",
              value: false,
            },
          ],
        },

        {
          name: "privateserverprice",
          description: "set the price of private servers.",
          type: ApplicationCommandOptionType.Number,
        },
      ],
    },

    {
      name: "setaccess",
      description: "edit your game access settings",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "universeid",
          description: "The universe to set access access for",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "access",
          description: "edit the game access settings",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "public",
              value: "Public",
            },

            {
              name: "private",
              value: "Private",
            },
          ],
          required: true,
        },
      ],
    },
  ],
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();

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

    let array = [
      { name: "privateserverprice", value: "privateServerPrice" },
      { name: "privateservers", value: "allowPrivateServers" },
      { name: "avatartype", value: "universeAvatarType" },
      { name: "friendsonly", value: "isFriendsOnly" },
      { name: "playabledevices", value: "playableDevices" },
      { name: "optinregions", value: "optInRegions" },
      { name: "thirdpartypurchases", value: "IsThirdPartyPurchaseAllowed" },
      { name: "thirdpartyteleports", value: "IsThirdPartyTeleportAllowed" },
      { name: "studioapiaccess", value: "studioAccessToApisAllowed" },
      { name: "description", value: "description" },
      { name: "genre", value: "genre" },
      { name: "price", value: "price" },
      { name: "forsale", value: "isForSale" },
      { name: "gname", value: "name" },
    ];

    const embed = new EmbedBuilder();

    if (subcommand === "setaccess") {
      const access = interaction.options.getString("access");
      const universeId = interaction.options.getNumber("universeid");

      chronosblox
        .updateUniverseAccess(universeId, access == "Public")
        .then((response) => {
          embed.setDescription(
            `Updated game access settings for universe **${universeId}** to **${access}**`
          );
          interaction.reply({
            embeds: [embed],
          });
        })
        .catch((error) => {
          embed.setDescription(
            `Error updating game access settings: \n${error.message} \n Please make a support ticket in the discord server if this error persists.`
          );
          interaction.reply({
            embeds: [embed],
          });
        });
    } else if (subcommand === "setsettings") {
      const universeId = interaction.options.getNumber("universeid");
      const settings = interaction.options._hoistedOptions;
      let size = 0;
      settings.forEach((key) => {
        size++;
      });

      if (size === 1) {
        embed.setDescription("Please provide at least one setting to update");
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      if (
        settings.find((se) => se.name === "isForSale") &&
        !settings.find((se) => se.name === "price")
      ) {
        embed.setDescription("Please provide price to update for sale setting");
        interaction.reply({
          embeds: [embed],
        });
        return;
      } else if (settings.find((se) => se.name === "price")) {
        const price = parseFloat(
          settings.find((se) => se.name === "price").value
        );
        if (price < 25) {
          embed.setDescription("The minimum price is 25.");
          interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }
      }

      let s = [];
      await settings.forEach((setting) => {
        array.forEach((x) => {
          if (x.name === setting.name) {
            if (
              setting.name === "thirdpartypurchases" ||
              setting.name === "thirdpartyteleports"
            ) {
              if (s["permissions"]) {
                s["permissions"][x.value] = true;
              } else {
                s["permissions"] = {};
                s["permissions"][x.value] = true;
              }
            } else if (setting.name === "playabledevices") {
              s[x.value] = setting.value.split(",").map((device) => {
                return `${device.trim()}`;
              });
            } else {
              s[x.value] = setting.value;
            }
          }
        });
      });

      chronosblox
        .updateUniverse(universeId, { ...s })
        .then((response) => {
          embed.setDescription(
            `Updated game settings for universe **${universeId}**:\n` +
              s.map(([key, value]) => `${key}: ${value}`).join("\n")
          );
          interaction.reply({
            embeds: [embed],
          });
        })
        .catch((err) => {
          embed.setDescription(
            `Error updating game settings: \n${err.message} \nPlease make a support ticket in the discord server if this error persists.`
          );
          interaction.reply({
            embeds: [embed],
          });
        });
    }
  },
};
