/*
- 원정대 레벨 가져와지는데 데이터 넘기면 사라지는 이슈

*/

const { CommandInteraction, MessageEmbed, Message } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// 칭호, 길드, pvp, 영지
let gameInfo = [];

// 레벨, 닉네임, 서버
let userInfo = {};

// 원정대레벨, 전투레벨
let userLevel = {};

// 장착레벨, 달성레벨
let itemLevel = {};

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

  async execute(interaction) {
    try {
      // [ { name: 'username', type: 'STRING', value: 'hello' } ] 해당 포맷이 args에 저장
      const args = interaction.options._hoistedOptions;
      const user = args.find((x) => x.name === 'username');
      const userName = user.value;

      // 칭호, 길드, pvp, 영지 데이터 가져오기
      await getGameProfile(userName);

      // 레벨, 닉네임, 서버 데이터 가져오기
      await getGameInfo(userName);

      // 원정대레벨, 전투레벨
      await getLevel(userName);

      // 아이템 레벨 가져오기
      await getItemLevel(userName);

      console.log('데이터 가져오는중...');
      // 임베드 만들어주기
      const infoEmbed = new MessageEmbed()
        .setColor('#0099ff')
        // 가독성 좋게 변경해야함 --
        .setTitle(`${userInfo.lv} ${userInfo.nickName} ${userInfo.server}`)
        .setURL(`https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(userName)}`)
        .addFields(
          { name: '아이템레벨', value: itemLevel.itemLevelData },
          { name: gameInfo[0].title, value: gameInfo[0].des, inline: true },
          { name: gameInfo[1].title, value: gameInfo[1].des, inline: true },
          { name: gameInfo[2].title, value: gameInfo[2].des, inline: true },
          { name: gameInfo[3].title, value: gameInfo[3].des, inline: true }
        );
      await interaction.reply({ embeds: [infoEmbed], ephemeral: false });
      console.log('데이터를 가져왔습니다');
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

// 칭호, 길드, pvp, 영지이름 가져오기
const getGameInfo = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);
    const gameInfoList = $('div.game-info').children('div');

    gameInfoList.each(function (i, element) {
      gameInfo[i] = { title: $(this).find('span').first().text(), des: $(this).find('span').last().text() };
    });
  });
  return gameInfo;
};

// 전투레벨, 닉네임, 서버 가져오기
const getGameProfile = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);
    const userInfoList = $('div.profile-character-info');

    userInfoList.each(function () {
      const lv = $(this).find('span.profile-character-info__lv').text();
      const nickName = $(this).find('span.profile-character-info__name').text();
      const server = $(this).find('span.profile-character-info__server').text();
      // console.log(`*${lv}*`);

      userInfo = { lv, nickName, server };
    });
  });
  return userInfo;
};

// 원정대레벨, 전투레벨 가져오기 -- 원정대레벨 데이터가 안넘어가는 현상 있음
const getLevel = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);
    const levelInfoList = $('div.level-info').children();

    levelInfoList.each(function () {
      // const expeditionLevel = $(this).find('div.level-info__expedition > span:nth-child(2)').text();
      // const battleLevel = $(this).find('div.level-info__item > span:nth-child(2)').text();
    });
  });
  return userLevel;
};

// 아이템레벨 가져오기 -- 아이템레벨 안넘겨짐
const getItemLevel = async (username) => {
  await getHtml(username).then((html) => {
    const $ = cheerio.load(html.data);

    const itemLevelList = $('div.level-info2__expedition');
    itemLevelList.each(function () {
      const itemLevelData = $(this).find('span').text();
      itemLevel = { itemLevelData };
    });
  });
  return itemLevel;
};

/* 캐릭터 리스트, 갯수 가져오는 코드
const userInfoList = $('div.profile-character-info');
const test = $(this).find('span').children().text();
*/
