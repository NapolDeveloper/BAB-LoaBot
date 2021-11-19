const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
  name: '명령어',
  description: '봇 명령어 리스트',

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const infoEmbed = new MessageEmbed()
      .setColor('#0099ff')
      // 가독성 좋게 변경해야함 --
      .setTitle('명령어 리스트')
      .addFields(
        { name: '정보', value: '```/정보```', inline: true },
        { name: '정보', value: '```/정보```', inline: true },
        { name: '정보', value: '```/정보```', inline: true }
      );

    await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
  }
};
