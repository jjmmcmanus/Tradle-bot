const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GAME_URL = process.env.GAME_URL || 'https://your-tradle-url.netlify.app';

const commands = [
  new SlashCommandBuilder()
    .setName('tradle')
    .setDescription('Play Tradle — Trading & TnB Wordle')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('tradle-help')
    .setDescription('How to play Tradle')
    .toJSON(),
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Slash commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Tradle bot online as ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'tradle') {
    await interaction.reply({
      embeds: [
        {
          title: '🟩 Tradle — Trading & TnB Wordle',
          description: `Guess the 5-letter trading word in 6 tries.\n\n**[▶ Play now](${GAME_URL})**`,
          color: 0x3B6D11,
          footer: { text: '🟩 correct spot  🟨 wrong spot  ⬛ not in word' },
        },
      ],
    });
  }

  if (interaction.commandName === 'tradle-help') {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        {
          title: 'How to play Tradle',
          description: [
            'Guess the **5-letter** trading or TnB word in **6 tries**.',
            '',
            '🟩 **Green** — right letter, right spot',
            '🟨 **Yellow** — right letter, wrong spot',
            '⬛ **Grey** — letter not in the word',
            '',
            `**[Play here](${GAME_URL})**`,
          ].join('\n'),
          color: 0x3B6D11,
        },
      ],
    });
  }
});

client.login(TOKEN);
