const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// javascript file system module
const fs = require('fs');

// client 인스턴스 생성
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// commands 폴더에 있는 파일 중 .js로 끝나는 파일들을 필터링하여 새로운 배열 생성
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// 클라이언트가 준비되었을 때 한 번 실행
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with your client's token
client.login(token);
