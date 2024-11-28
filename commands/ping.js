// commands/misc/ping.js

module.exports = {
  data: {
    name: "ping",
    description: "Get ping",
  },

  run: ({ interaction, client, handler }) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },

  //deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
