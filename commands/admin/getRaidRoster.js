// commands/misc/ping.js
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const WowCharacter = require("../../models/WowCharacter");
const { devs } = require("../../config.json");

module.exports = {
  data: {
    name: "list-raid-roster",
    description: "list the current raid roster",
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

    const tankQuery = { role: "Tank" };
    const healerQuery = { role: "Healer" };
    const meleeDpsQuery = { role: "Melee Dps" };
    const rangedDpsQuery = { role: "Ranged Dps" };

    try {
      // Get all records from database
      const tanks = await WowCharacter.find(tankQuery);
      const healers = await WowCharacter.find(healerQuery);
      const meleedps = await WowCharacter.find(meleeDpsQuery);
      const rangeddps = await WowCharacter.find(rangedDpsQuery);

      const tankNames = tanks
        .map((tank) => `${tank.name} - ${tank.class || "TBD"}`)
        .sort((a, b) => {
          const classA = a.split(" - ")[1];
          const classB = b.split(" - ")[1];
          return classA.localeCompare(classB); // Sort alphabetically by class
        })
        .join("\n");

      const healerNames = healers
        .map((healer) => `${healer.name} - ${healer.class || "TBD"}`)
        .sort((a, b) => {
          const classA = a.split(" - ")[1];
          const classB = b.split(" - ")[1];
          return classA.localeCompare(classB); // Sort alphabetically by class
        })
        .join("\n");

      const meleedpsNames = meleedps
        .map((dps) => `${dps.name} - ${dps.class || "TBD"}`)
        .sort((a, b) => {
          const classA = a.split(" - ")[1];
          const classB = b.split(" - ")[1];
          return classA.localeCompare(classB); // Sort alphabetically by class
        })
        .join("\n");

      const rangeddpsNames = rangeddps
        .map((dps) => `${dps.name} - ${dps.class || "TBD"}`)
        .sort((a, b) => {
          const classA = a.split(" - ")[1];
          const classB = b.split(" - ")[1];
          return classA.localeCompare(classB); // Sort alphabetically by class
        })
        .join("\n");

      if (!tanks && !healers && !meleedps && !rangeddps) {
        interaction.reply(`No players added to roster.`);
        return;
      } else {
        const rosterInfoEmbed = new EmbedBuilder({
          author: {
            name: `Raid roster`,
          },
          description: "Meiän miehet :D",
          fields: [
            {
              name: "Tanks",
              value: tankNames,
              inline: true,
            },

            {
              name: "Melee Dps",
              value: meleedpsNames,
              inline: true,
            },
            {
              name: "Ranged Dps",
              value: rangeddpsNames,
              inline: true,
            },
            {
              name: "Healers",
              value: healerNames,
              inline: true,
            },
          ],

          footer: {
            text: `ID: | Server Created: `,
          },
        });
        interaction.reply({ embeds: [rosterInfoEmbed] });
      }
    } catch (error) {
      console.log(`Error adding player: ${error}`);
    }
  },

  //deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
