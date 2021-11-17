const { CommandInteraction, MessageEmbed, Message } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// 칭호, 길드, pvp, 영지
let gameInfo = [];

// 레벨, 닉네임, 서버
let userInfo = [];

module.exports = {
  name: 'info',
  description: '사용자 정보 가져오기',
  options: [
    {
      name: 'username',
      description: '해당 사용자 정보 가져오기',
      type: 'STRING',
      require: true
    }
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  async execute(interaction, args) {
    try {
      // [ { name: 'username', type: 'STRING', value: 'hello' } ] 해당 포맷이 args에 저장
      const args = interaction.options._hoistedOptions;
      const user = args.find((x) => x.name === 'username');
      const userName = user.value;

      // 칭호, 길드, pvp, 영지 데이터 가져오기
      await getGameProfile(username);
      await getGameInfo(userName);

      // 임베드 만들어주기
      const infoEmbed = new MessageEmbed()
        .setColor('#0099ff')
        // 가독성 좋게 변경해야함 --
        .setTitle(`${gameInfo[0].title} ${gameInfo[0].nickName} ${gameInfo[0].server}`)
        .addFields(
          // map으로 변경예정 --
          { name: gameInfo[0].title, value: gameInfo[0].des },
          { name: gameInfo[1].title, value: gameInfo[1].des },
          { name: gameInfo[2].title, value: gameInfo[2].des },
          { name: gameInfo[3].title, value: gameInfo[3].des }
        );
      await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  }
};

const getHtml = async (username) => {
  try {
    return await axios.get(`https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(username)}`);
  } catch (error) {
    console.error(error);
  }
};

// 아래 함수들 동일한 부분 묶어주기 --
const getGameInfo = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);
    const gameInfoList = $('div.game-info').children('div');

    gameInfoList.each(function (i, element) {
      gameInfo[i] = { title: $(this).find('span').first().text(), des: $(this).find('span').last().text() };
    });
    console.log(gameInfo);
  });
  return gameInfo;
};

const getGameProfile = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);
    const userInfoList = $('div.profile-character-info').children('span');

    userInfoList.each(function (i, element) {
      userInfo[i] = {
        lv: $(this).find('.profile-character-info__lv > span').text(),
        nickName: $(this).find('.profile-character-info__name > span').text(),
        server: $(this).find('.profile-character-info__server > span').text()
      };
    });
    console.log(`userInfo입니다 ${userInfo}`);
  });
  return userInfo;
};
