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
      .addStringOption(option => option
        .setName('option_name') // optionNameだと動かない. 小文字のスネークケースでないといけない.
        .setDescription('option description')
        .setRequired(true) // 引数の入力が必須か否か
      ),
    new discord.SlashCommandBuilder()
      .setName('test_num')
      .setDescription('test number command')
      .addNumberOption(option => option
        .setName('option_name')
        .setDescription('option description')
        .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName('test2')
      .setDescription('test2 command')
  ];

  // await client.application.commands.set(commands); // グローバルコマンドは開発中に不向き
  
  // 開発用にギルドコマンドを登録する方法
  guild = await client.guilds.cache.get(process.env.DISCORD_GUILD_ID)

  if (!guild) {
    console.log('Guild not found');
    return;
  }

  await guild.commands.set(commands);
  console.log("Guild commands registered!");
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
    const arg = interaction.options.getString('option_name');
    await interaction.reply('you input: ' + arg);
  }

  if (command === 'test_num') {
    const arg = interaction.options.getNumber('option_name');
    await interaction.reply('you input number: ' + arg);
  }

  if (command === 'test2') {
    await interaction.reply('test2 command executed!');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);