// commands/misc/ping.js
const { PermissionFlagsBits } = require("discord.js");
const WowCharacter = require("../../models/WowCharacter");
const { devs } = require("../../config.json");

module.exports = {
  data: {
    name: "remove-player-from-roster",
    description: "Remove a player from raid roster",
    options: [
      {
        name: "player-name",
        description: "The players name.",
        type: 3,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
  },

  run: async ({ interaction, client, handler }) => {
    if (!devs.includes(interaction.member.id)) {
      interaction.reply({
        content: "Only officers can run this command",
        ephemeral: true,
      });
      return;
    }

    const playerName = interaction.options.get("player-name").value;

    // Get Player from the database
    const query = {
      name: playerName,
    };

    try {
      // Check if Player does not exists in database
      const wowcharacter = await WowCharacter.findOne(query);

      if (!wowcharacter) {
        interaction.reply(`No player with name: "${playerName}" found.`);
        return;
      } else {
        // Remove Player from Database if found
        await WowCharacter.findOneAndDelete(query);

        interaction.reply(
          `Player "${playerName}" has been removed from roster.`
        );
      }
    } catch (error) {
      console.log(`Error adding player: ${error}`);
    }
  },

  //deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
