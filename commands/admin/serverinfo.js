// commands/misc/ping.js
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { devs } = require("../../config.json");

module.exports = {
  data: {
    name: "serverinfo",
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

    const { guild } = interaction;
    const serverInfoEmbed = new EmbedBuilder({
      author: { name: guild.name, icon_url: guild.iconURL({ size: 256 }) },
      fields: [
        {
          name: "Owner",
          value: (await guild.fetchOwner()).user.tag,
          inline: true,
        },
        {
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
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Voice Channels",
          value: guild.channels.cache.filter((c) => c.type === 2).toJSON()
            .length,
          inline: true,
        },
        {
          name: "Category Channels",
          value: guild.channels.cache.filter((c) => c.type === 4).toJSON()
            .length,
          inline: true,
        },
        { name: "Members", value: guild.memberCount, inline: true },
        { name: "Roles", value: guild.roles.cache.size, inline: true },
        { name: "Role list", value: guild.roles.cache.toJSON().join(", ") },
      ],

      footer: {
        text: `ID: ${
          guild.id
        } | Server Created: ${guild.createdAt.toDateString()}`,
      },
    });

    interaction.reply({ embeds: [serverInfoEmbed] });
  },

  // deleted: true, // Deletes the command from Discord (if you passed in a "testServer" property it'll delete from the guild and not globally)
};
