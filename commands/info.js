const { CommandInteraction } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'info',
  description: '사용자 정보 가져오기',
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    console.log(getHtml());
    await interaction.reply({ content: 'hello', ephemeral: true });
  }
};

const getHtml = async () => {
  try {
    return await axios.get(
      'https://lostark.game.onstove.com/Profile/Character/%ED%9E%90%EB%9F%AC%EB%82%98%ED%8F%AC%EB%A7%81'
    );
  } catch (error) {
    console.error(error);
  }
};
