// commands/misc/ping.js
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { devs } = require("../../config.json");

module.exports = {
  data: {
    name: "post-raid-roster",
    description: "Get information of this serer",
    permissionsRequired: [PermissionFlagsBits.Administrator],
  },

  run: async ({ interaction, client, handler }) => {
    if (!devs.includes(interaction.member.id)) {
      interaction.reply({
        content: "Only devs can run this command",
        ephemeral: true,
      });
      return;
    }

    const tableExample = `
Name    | Ul | Bl | Si | Ra | Br | Si | Ne | Qu | Q2
--------|----|----|----|----|----|----|----|----|----|
LASSE   | -- | IN | -- | IN | -- | -- | IN | IN | -- | 4
JOLO    | IN | IN | IN | -- | IN | -- | -- | IN | IN | 6
TIMBA   | IN | -- | -- | -- | IN | -- | -- | IN | -- | 3
NINA    | IN | IN | IN | IN | -- | IN | -- | IN | -- | 6
ATTO    | IN | -- | IN | IN | IN | -- | -- | IN | IN | 6
LENA    | IN | IN | IN | -- | -- | IN | IN | IN | IN | 7
KOI     | IN | IN | -- | IN | -- | -- | IN | -- | IN | 5
NOVE    | -- | -- | IN | -- | -- | -- | -- | IN | -- | 2
FREYA   | -- | -- | IN | IN | -- | IN | IN | -- | IN | 5
MILO    | -- | -- | -- | IN | -- | IN | -- | IN | IN | 4
ARIA    | IN | -- | -- | IN | IN | IN | IN | -- | -- | 5
EZRA    | -- | IN | IN | -- | IN | IN | -- | IN | IN | 6
ZARA    | -- | -- | IN | -- | IN | IN | IN | IN | -- | 5
MAX     | -- | -- | IN | IN | IN | -- | IN | -- | -- | 4
IVY     | -- | IN | -- | -- | IN | IN | IN | IN | IN | 6
Name    | Ul | Bl | Si | Ra | Br | Si | Ne | Qu | Q2
--------|----|----|----|----|----|----|----|----|----|
LASSE   | -- | IN | -- | IN | -- | -- | IN | IN | -- | 4
JOLO    | IN | IN | IN | -- | IN | -- | -- | IN | IN | 6
TIMBA   | IN | -- | -- | -- | IN | -- | -- | IN | -- | 3
NINA    | IN | IN | IN | IN | -- | IN | -- | IN | -- | 6
ATTO    | IN | -- | IN | IN | IN | -- | -- | IN | IN | 6
LENA    | IN | IN | IN | -- | -- | IN | IN | IN | IN | 7
KOI     | IN | IN | -- | IN | -- | -- | IN | -- | IN | 5
NOVE    | -- | -- | IN | -- | -- | -- | -- | IN | -- | 2
FREYA   | -- | -- | IN | IN | -- | IN | IN | -- | IN | 5
MILO    | -- | -- | -- | IN | -- | IN | -- | IN | IN | 4
ARIA    | IN | -- | -- | IN | IN | IN | IN | -- | -- | 5
EZRA    | -- | IN | IN | -- | IN | IN | -- | IN | IN | 6
ZARA    | -- | -- | IN | -- | IN | IN | IN | IN | -- | 5
MAX     | -- | -- | IN | IN | IN | -- | IN | -- | -- | 4
IVY     | -- | IN | -- | -- | IN | IN | IN | IN | IN | 6
`;

    //These has to be 2 character long
    const bossPrefix = [
      "Name",
      "Ul",
      "Bl",
      "Si",
      "Ra",
      "Br",
      "Si",
      "Ne",
      "Qu",
      "Q2",
    ];
    const namesTanks = ["cOOKie", "Alfa"];
    const namesHealers = ["OTTO", "YAME", "LUNA", "KAI", "NOVA"];
    const namesDps = [
      "LASSE",
      "JOLO",
      "TIMBA",
      "NINA",
      "ATTO",
      "LENA",
      "KOI",
      "NOVE",
      "FREYA",
      "MILO",
      "ARIA",
      "EZRA",
      "ZARA",
      "MAX",
      "IVY",
      "OTTO",
      "YAME",
      "LUNA",
    ];

    // Randomly decide "IN" or "--"
    function getRandomStatus() {
      const statuses = ["IN", "--"];
      return statuses[Math.floor(Math.random() * statuses.length)];
    }

    // Generate the table
    function generateTable(bossPrefix, roles) {
      let table = "";

      function generateSeparator() {
        let table = "";
        for (let i = 1; i < headerRow.length + 2; i++) {
          if (i === 9 || (i > 9 && (i - 9) % 5 === 0)) {
            table += "|";
          } else {
            table += "-";
          }
        }
        table += " -" + "\n";
        return table;
      }

      // Create header row
      const headerRow =
        ["Name".padEnd(7, " "), ...bossPrefix.slice(1)].join(" | ") + "\n";
      table += headerRow;

      //Create seperator
      table += generateSeparator();

      // Generate rows for each role
      roles.forEach((names) => {
        names.forEach((name, index) => {
          // Ensure name is exactly 8 characters
          const paddedName = name.padEnd(7, " ");
          const row = [paddedName];
          for (let i = 1; i < bossPrefix.length; i++) {
            row.push(getRandomStatus());
          }
          // count have many bosses player is playing
          const countOccurrences = row.reduce(
            (a, v) => (v === "IN" ? a + 1 : a),
            0
          );
          // push tanks to the table
          table += row.join(" | ") + " | " + countOccurrences + "\n";
        });
        table += generateSeparator();
      });

      // Add Total row
      const totalRow = [
        "Total".padEnd(7, " "),
        ...Array(bossPrefix.length - 1).fill("20"),
      ];
      table += totalRow.join(" | ");

      // Add backticks at the start and end
      return `\`\`\`\n${table}\n\`\`\``;
    }

    // Generate the table
    const tableTanks = generateTable(bossPrefix, [
      namesTanks,
      namesHealers,
      namesDps,
    ]);

    // Generate the discord message
    const { guild } = interaction;
    const serverInfoEmbed = new EmbedBuilder({
      author: {
        name: `Raid roster for next raid`,
        icon_url: guild.iconURL({ size: 256 }),
      },
      description: tableTanks,
      fields: [
        {
          name: "Owner",
          value: (await guild.fetchOwner()).user.tag,
          inline: true,
        },
        /* {
          name: "Text ChannelsText ChannelsText Channels",
          value: `${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          } \n${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          }\n${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          }\n${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          }\n${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          }\n${
            guild.channels.cache.filter((c) => c.type === 0).toJSON().length
          }`,
          inline: true,
        }, */
        { name: "\u200B", value: "\u200B" },
      ],

      footer: {
        text: `ID: ${
          guild.id
        } | Server Created: ${guild.createdAt.toDateString()}`,
      },
    });

    interaction.reply({ embeds: [serverInfoEmbed] });
  },

  //deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
