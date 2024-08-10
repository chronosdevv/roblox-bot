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
  name: "moderation",
  description: "moderate a user.",
  options: [
    {
      name: "ban",
      description: "Ban a user from the game.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "userid",
          description: "The userid to ban.",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "universeid",
          description: "The universe to get ban data for",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "reason",
          description: "The reason for the ban",
          type: ApplicationCommandOptionType.String,
        },

        {
          name: "time",
          description: "The time to ban the userid for",
          type: ApplicationCommandOptionType.String,
        },
      ],
    },

    {
      name: "getban",
      description: "Get a user's ban data",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "userid",
          description: "The userid to get ban data for",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "universeid",
          description: "The universe to get ban data for",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
      ],
    },

    {
      name: "kick",
      description: "Kick a user from the game.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "userid",
          description: "The userid to kick.",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "universeid",
          description: "The universe to kick the player from.",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },

        {
          name: "reason",
          description: "The reason for the kick",
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();

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

    switch (sub) {
      case "ban":
        const userId = interaction.options.getNumber("userid");
        const time = interaction.options.getString("time") || -1;
        const reason =
          interaction.options.getString("reason") || "No reason specified.";
        const universe = interaction.options.getNumber("universeid");

        const data = {
          UserId: userId,
          BanType: time === -1 ? "Permanent" : "Temporary",
          BanLength: time,
        };

        cached.push(data);

        const body = {
          gameJoinRestriction: {
            active: true,
            duration: time,
            privateReason: reason,
            displayReason: reason,
            excludeAltAccounts: false,
            inherited: true,
          },
        };

        axios
          .patch(
            `https://apis.roblox.com/cloud/v2/universes/${universe}/user-restrictions/${userId}`,
            body,
            {
              headers: {
                "x-api-key": apikey,
              },
            }
          )
          .then((response) => {
            const embed = new EmbedBuilder();
            embed.setDescription(`Banned **${userId}** from **${universe}**`);

            interaction.reply({ embeds: [embed] });
          });
        break;
      case "unban":
        const userId3 = interaction.options.getNumber("userid");
        const time1 = interaction.options.getString("time") || -1;
        const reason3 =
          interaction.options.getString("reason") || "No reason specified.";
        const universe3 = interaction.options.getNumber("universeid");

        const body2 = {
          gameJoinRestriction: {
            active: false,
          },
        };

        axios
          .patch(
            `https://apis.roblox.com/cloud/v2/universes/${universe3}/user-restrictions/${userId3}`,
            body,
            {
              headers: {
                "x-api-key": apikey,
              },
            }
          )
          .then((response) => {
            const embed = new EmbedBuilder();
            embed.setDescription(
              `Unbanned **${userId3}** from **${universe3}**`
            );

            interaction.reply({ embeds: [embed] });
          });
      case "getban":
        const userId1 = interaction.options.getNumber("userid");
        const banData = cached.find((ban) => ban.UserId === userId1);
        const universe1 = interaction.options.getNumber("universeid");

        if (banData) {
          interaction.reply(
            `${userId1 + " - " + banData.BanType + " - " + banData.BanLength}`
          );
        } else {
          axios
            .get(
              `https://apis.roblox.com/cloud/v2/universes/${universe1}/user-restrictions`,
              {
                headers: {
                  "x-api-key": apikey,
                },
              }
            )
            .then(async (response) => {
              let restrictions = response.data.userRestrictions;
              const ban = restrictions.find(
                (ban) => ban.user === `users/${userId1}`
              );

              if (!ban) {
                interaction.reply({
                  content: "User not found or not banned.",
                  ephemeral: true,
                });
                return;
              }
              let restriction = ban.gameJoinRestriction;

              let replyData;

              let keys = [];

              let active, duration, status;

              const user = await chronosblox.getPlayerInfo(userId1);

              Object.entries(restriction).forEach((x) => {
                keys[x[0]] = x[1];
              });

              replyData = `${user.username} : ${userId1}`;

              keys["active"]
                ? (active = " - Active")
                : (active = " - Not Active");

              keys["duration"] == -1
                ? keys[active]
                  ? (status = " - Permanent")
                  : (status = " - Was Permanent")
                : keys[active]
                ? (status = " - Temporary")
                : (status = " - Was Temporary");

              if (keys["duration"] != -1) {
                duration = " - " + keys["duration"];
              }

              const embed = new EmbedBuilder()
                .setTitle(user.name)
                .addFields(
                  { name: "Active: ", value: active, inline: false },
                  { name: "Status: ", value: status, inline: false }
                )
                .setFooter({ text: `${userId1}` });

              if (duration) {
                embed.addFields({
                  name: "Duration: ",
                  value: duration,
                  inline: false,
                });
              }

              interaction.reply({ embeds: [embed] });
            });
        }
      case "kick":
        const userId2 = interaction.options.getNumber("userid");
        const universe2 = interaction.options.getNumber("universeid");
        const reason1 =
          interaction.options.getString("reason") || "No reason specified";
        const topic = "botkickx";

        axios
          .post(
            `https://apis.roblox.com/messaging-service/v1/universes/${universe2}/topics/${topic}`,
            {
              message: { userId2, reason1 },
            },
            {
              headers: {
                "x-api-key": apikey,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const embed = new EmbedBuilder()
              .setDescription(`Kicked **${userId2}** from **${universe2}**`)
              .setTimestamp();

            interaction.reply({ embeds: [embed] });
          });
    }
  },
};
