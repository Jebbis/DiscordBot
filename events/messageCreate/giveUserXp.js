const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Player = require("../../models/Player");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message, client) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(5, 55);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const player = await Player.findOne(query);

    if (player) {
      player.xp += xpToGive;

      if (player.xp > calculateLevelXp(player.level)) {
        player.xp = 0;
        player.level += 1;

        /*         message.channel.send(
          `${message.member} you have leveled up to **level ${player.level}**.`
        ); */
      }

      await player.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }

    // if (!level)
    else {
      const newPlayer = new Player({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newPlayer.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
