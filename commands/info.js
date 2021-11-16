const { CommandInteraction, MessageEmbed, Message } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// 칭호, 길드, pvp, 영지
let gameInfo = [];

module.exports = {
  name: 'info',
  description: '사용자 정보 가져오기',
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    try {
      // 칭호, 길드, pvp, 영지 데이터 가져오기
      await getGameInfo();

      // 임베드 만들어주기
      const infoEmbed = new MessageEmbed().setColor('#0099ff').setTitle('해당 위치에 닉네임 가져올 예정').addFields(
        // map으로 변경예정
        { name: gameInfo[0].title, value: gameInfo[0].des },
        { name: gameInfo[1].title, value: gameInfo[1].des },
        { name: gameInfo[2].title, value: gameInfo[2].des },
        { name: gameInfo[3].title, value: gameInfo[3].des }
      );
      await interaction.reply({ embeds: [infoEmbed], ephemeral: false });
    } catch (error) {
      console.log(error);
    }
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

const getGameInfo = async () => {
  await getHtml().then((html) => {
    const $ = cheerio.load(html.data);
    const gameInfoList = $('div.game-info').children('div');

    gameInfoList.each(function (i, element) {
      // gameInfoList[i] = {
      //   title: $(this).find('span').first().text(),
      //   des: $(this).find('span').last().text()
      // };
      gameInfo[i] = { title: $(this).find('span').first().text(), des: $(this).find('span').last().text() };
    });
    console.log(gameInfo);
  });
  return gameInfo;
};
