const { CommandInteraction } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'pong 답변',
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.reply('pong');
  }
};
