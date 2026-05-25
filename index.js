require("dotenv").config({ path: ".env.local" });

const discord = require('discord.js');
const client = new discord.Client({
  intents: Object.values(discord.GatewayIntentBits)
});

const ROLE_ID = process.env.AUTHORIZED_ROLE_ID;

client.on(discord.Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // コマンドの登録
  const commands = [
    new discord.SlashCommandBuilder()
      .setName('test_string')
      .setDescription('test string command')
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
      .setName('test_user')
      .setDescription('test user command')
      .addUserOption(option => option
        .setName('option_name')
        .setDescription('option description')
        .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName('test_channel')
      .setDescription('test channel command')
      .addChannelOption(option => option
        .setName('option_name')
        .setDescription('option description')
        .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName('test')
      .setDescription('test command'),

    new discord.SlashCommandBuilder()
      .setName('verify')
      .setDescription('Display authentication panel')
  ];

  // await client.application.commands.set(commands); // グローバルコマンドは開発中に不向き
  
  // 開発用にギルドコマンドを登録する方法
  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID)

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

  if (command === 'test_string') {
    const arg = interaction.options.getString('option_name');
    await interaction.reply('you input: ' + arg);
  }

  if (command === 'test_num') {
    const arg = interaction.options.getNumber('option_name');
    await interaction.reply('you input number: ' + arg);
  }

  if (command === 'test_user') {
    const arg = interaction.options.getUser('option_name');
    await interaction.reply('you input user: ' + arg.toString());
  }

  if (command === 'test_channel') {
    const arg = interaction.options.getChannel('option_name');
    await interaction.reply('you input channel: ' + arg.toString());
  }

  if (command === 'test') {
    await interaction.reply('test command executed!');
  }

  if (command === 'verify') {
    const embed = new discord.EmbedBuilder()
      .setTitle('Verification')
      .setDescription('Click the button below to verify yourself and get access to the server!')

    const button = new discord.ButtonBuilder()
      .setCustomId('verify_button')
      .setLabel('Verify')
      .setStyle(discord.ButtonStyle.Primary);

    await interaction.reply({
      embeds: [embed],
      components: [new discord.ActionRowBuilder().addComponents(button)]
    })
  }
});

client.on(discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify_button') {
    
    if (!ROLE_ID) {
      await interaction.reply({
        content: 'Role ID is not set.',
        ephemeral: true
      })
      return;
    }

    if (!interacion.inGuild()) {
      await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true
      })
    }

    try {
      await interaction.member.roles.add(ROLE_ID);

      await interaction.reply({
        content: 'You have been verified and given access to the server!',
        ephemeral: true // この返信はユーザーにしか見えないようにする
      });
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: 'There was an error while trying to verify you. Please contact the server administrator.',
        ephemeral: true
      });
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);