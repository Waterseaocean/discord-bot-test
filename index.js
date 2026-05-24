require("dotenv").config({ path: ".env.local" });

const discord = require('discord.js');
const client = new discord.Client({
  intents: Object.values(discord.GatewayIntentBits)
});

client.on(discord.Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // コマンドの登録
  const commands = [
    new discord.SlashCommandBuilder()
      .setName('test')
      .setDescription('test command')
  ];

  await client.application.commands.set(commands);
});

client.on(discord.Events.MessageCreate, async (message) => {
  if (message.content === 'Hi') {
    await message.reply('Hello!');
  }
})

// コマンドの実行時の挙動
client.on(discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === 'test') {
    await interaction.reply('finished');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);