require("dotenv/config");
const { testServer } = require("./config.json");
const { Client, IntentsBitField } = require("discord.js");
const { CommandHandler } = require("djs-commander");
const mongoose = require("mongoose");
const path = require("path");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, "commands"),
  eventsPath: path.join(__dirname, "events"),
  //testServer: testServer, // To register guild-based commands (if not provided commands will be registered globally)
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
})();
