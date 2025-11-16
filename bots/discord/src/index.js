try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional in environments where env vars are provided by the host.
  console.warn('[bot] dotenv not available; skipping .env loading — ensure env vars are set otherwise');
}
const fs = require('fs');
const path = require('path');
// Try to require optional dependencies and provide a helpful error if they're missing
const missingDeps = []
function tryRequire(name) {
  try {
    return require(name)
  } catch (err) {
    missingDeps.push(name)
    return null
  }
}

const express = tryRequire('express')
const bodyParser = tryRequire('body-parser')
const axios = tryRequire('axios')
const discordJs = tryRequire('discord.js')

if (missingDeps.length) {
  console.error('[bot] Missing dependencies:', missingDeps.join(', '))
  console.error('[bot] Please install dependencies for the bot. From project root run:')
  console.error("  npm run bootstrap")
  console.error('Or install only bot deps:')
  console.error("  cd bots/discord && npm install")
  // Exit with code 1 so running orchestrators notice failure
  process.exit(1)
}

const { Client, Collection, GatewayIntentBits, Partials } = discordJs

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const PORT = parseInt(process.env.PORT, 10) || 3001;

if (!DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN not set. Create a .env file based on .env.example');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.userCache = new Map(); // discordId -> userId cache

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Optionally auto-register slash commands at startup when CLIENT_ID is provided
// This saves running the separate deploy script during development.
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID
const RestModule = tryRequire('@discordjs/rest')
const DiscordApiTypes = tryRequire('discord-api-types/v10')
const Routes = DiscordApiTypes && DiscordApiTypes.Routes
if (CLIENT_ID && RestModule && Routes) {
  ;(async () => {
    try {
      const rest = new RestModule.REST({ version: '10' }).setToken(DISCORD_TOKEN)
      const commandData = Array.from(client.commands.values()).filter(c => c.data).map(c => c.data.toJSON())
      if (GUILD_ID) {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandData })
        console.log('Registered commands to guild', GUILD_ID)
      } else {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commandData })
        console.log('Registered commands globally')
      }
    } catch (err) {
      console.warn('Failed to auto-register commands:', err && err.message)
    }
  })()
}

client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client, { axios, BACKEND_URL });
  } catch (err) {
    console.error('Command execution error', err);
    if (interaction.replied || interaction.deferred) {
      interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
    } else {
      interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
  }
});

// Simple webhook receiver so backend can push notifications to Discord users
const app = express();
app.use(bodyParser.json());

app.post('/api/notifications/send', async (req, res) => {
  const payload = req.body || {};
  const { userId, platform, discordId, title, message, link } = payload;
  if (platform !== 'discord') return res.status(400).json({ error: 'platform must be discord' });

  const targetDiscordId = discordId || null;
  if (!targetDiscordId) return res.status(400).json({ error: 'discordId required' });

  try {
    const user = await client.users.fetch(targetDiscordId).catch(() => null);
    if (!user) return res.status(404).json({ error: 'Discord user not found' });
    const content = `${title ? `**${title}**\n` : ''}${message || ''}${link ? `\n${link}` : ''}`;
    await user.send({ content });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Failed to send notification', err);
    return res.status(500).json({ error: 'failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});

client.on('error', (err) => {
  console.error('Discord client error:', err)
})

client.on('shardError', (err) => {
  console.error('Discord shard error:', err)
})

client.login(DISCORD_TOKEN).then(() => {
  console.log('client.login resolved')
}).catch((err) => {
  console.error('Discord login failed:', err)
  // exit so process managers (or dev scripts) know it failed
  process.exit(1)
})
