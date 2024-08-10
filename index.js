require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

mongoose.connect(process.env.mongo);

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isChatInputCommand()) return;

  const getLocalCommands = require("./getLocalCommands");

  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "Not enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
});

client.once("ready", async function () {
  console.log("ready");
  const areCommandsDifferent = require("./areCommandsDifferent");
  const getLocalCommands = require("./getLocalCommands");

  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await client.application.commands;

    await applicationCommands.fetch();

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
        }
      } else {
        if (localCommand.deleted) {
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log("registered" + " " + name);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
});

client.login(process.env.token);
