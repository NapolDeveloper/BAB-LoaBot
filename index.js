const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});
const { token, guildId } = require('./config.json');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
client.commands = new Collection();
var data = [];
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  data.push({ name: command.name, description: command.description, options: command.options });
}

client.once('ready', async () => {
  console.log('[실행 성공]');
  // 길드를 지정해서 하면 커맨드가 바로 적용 되지만 모든 길드에서 사용하려면 약 1시간의 등록시간이 필요함
  await client.guilds.cache.get('659981758552342572')?.commands.set(data);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!client.commands.has(interaction.commandName)) return;
  const command = client.commands.get(interaction.commandName);
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('[*에러 발생*]');
  }
});

client.login(token);
