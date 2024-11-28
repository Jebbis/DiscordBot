// commands/misc/ping.js
const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const WowCharacter = require("../../models/WowCharacter");
const { devs } = require("../../config.json");

module.exports = {
  data: {
    name: "add-player-to-roster",
    description: "add new player to roster",
    options: [
      {
        name: "player-name",
        description: "The players name.",
        type: 3,
        required: true,
      },
      {
        name: "player-role",
        description: "The player's role.",
        type: 3,
        choices: [
          { name: "Tank", value: "Tank" },
          { name: "Healer", value: "Healer" },
          { name: "Ranged Dps", value: "Ranged Dps" },
          { name: "Melee Dps", value: "Melee Dps" },
        ],
        required: true,
      },
      {
        name: "player-class",
        description: "The players class name.",
        type: 3,
        choices: [
          { name: "DK", value: "DK" },
          { name: "DH", value: "DH" },
          { name: "Druid", value: "Druid" },
          { name: "Evoker", value: "Evoker" },
          { name: "Hunter", value: "Hunter" },
          { name: "Mage", value: "Mage" },
          { name: "Monk", value: "Monk" },
          { name: "Paladin", value: "Paladin" },
          { name: "Priest", value: "Priest" },
          { name: "Rogue", value: "Rogue" },
          { name: "Shaman", value: "Shaman" },
          { name: "Warlock", value: "Warlock" },
          { name: "Warrior", value: "Warrior" },
        ],
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
    const playerRole = interaction.options.get("player-role").value;
    const playerClass = interaction.options.get("player-class").value;

    // Get Player from the database
    const query = {
      name: playerName,
    };

    try {
      // Check if Player exists in database
      const wowcharacter = await WowCharacter.findOne(query);
      if (wowcharacter) {
        interaction.reply(
          `Player "${wowcharacter.name}" has been already added.`
        );
        return;
      } else {
        // Add Player to Database if not found
        const newCharacter = new WowCharacter({
          name: playerName,
          role: playerRole,
          class: playerClass,
        });

        await newCharacter.save();
        interaction.reply(
          `Player "${playerName}" has been added to roster with role: "${playerRole}" and class "${playerClass}"..`
        );
      }
    } catch (error) {
      console.log(`Error adding player: ${error}`);
    }
  },

  //deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
