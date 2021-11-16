const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: 'info',
  description: '사용자 정보 가져오기',
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const gameInfo = getGameInfo();
    console.log(gameInfo);

    await interaction.reply({ content: 'ii', ephemeral: true });
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

const getGameInfo = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);
    const gameInfoList = $('div.game-info').children('div');
    let gameInfoData = [];
    gameInfoList.each(function (i, element) {
      gameInfoList[i] = {
        title: $(this).find('span').first().text(),
        des: $(this).find('span').last().text()
      };
      gameInfoData[i] = gameInfoList[i].title;
    });
    // embed 생성
    console.log(gameInfoList);
    return gameInfoList;
  });
};
