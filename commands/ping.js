const { CommandInteraction, MessageEmbed } = require('discord.js');

// inside a command, event listener, etc.
const exampleEmbed = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Some title')
  .setURL('https://discord.js.org/')
  .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
  .setDescription('Some description here')
  .setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true }
  )
  .addField('Inline field title', 'Some value here', true)
  .setImage('https://i.imgur.com/AfFp7pu.png')
  .setTimestamp()
  .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
module.exports = {
  name: 'ping',
  description: 'pong 답변',
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    // ephemeral -> 본인만 보이는 메시지
    await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
  }
};
