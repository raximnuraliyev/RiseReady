# RiseReady Discord Bot

This is a small Discord bot scaffold for RiseReady. It implements slash commands and exposes a simple webhook endpoint so the RiseReady backend can push notifications to Discord users.

Important: Do NOT commit your real bot token. Use `.env` (and keep it out of git).

Files added
- `src/index.js` - main bot + webhook receiver
- `src/deploy-commands.js` - register slash commands (guild or global)
- `src/commands/*` - command handlers (link, stats, focus, checkin, badges, internships, leaderboard, settings)

Environment variables

Create a `.env` file in this folder (copy from `.env.example`) and set:

- `DISCORD_TOKEN` - your bot token
- `CLIENT_ID` - Discord Application client id (for deploying commands)
- `GUILD_ID` - optional (for testing commands in a guild only)
- `BACKEND_URL` - URL to your RiseReady backend (e.g. `http://localhost:3000`)
- `PORT` - port for webhook listener (default 3001)

Install & run

1. From this folder install dependencies:

```powershell
cd bots/discord
npm install
```

2. Register commands (guild-scoped while testing is faster):

```powershell
# ensure CLIENT_ID, GUILD_ID and DISCORD_TOKEN are in .env
npm run deploy-commands
```

3. Start bot

```powershell
npm start
```

How it integrates

- `/link <code>` calls POST `/api/bots/discord/link` with `{ discordId, linkCode }`.
- Other commands call the backend endpoints described in the project spec; the bot will send `discordId` in requests so the backend can map to a user.
- The webhook endpoint `POST /api/notifications/send` expects `{ userId, platform: 'discord', discordId, title, message, link }` and will DM the user.

Notes & assumptions

- For simplicity the command implementations send `discordId` to the backend; the backend should accept `discordId` and resolve the user. If your backend strictly requires `userId`, either return `userId` in the `/api/bots/discord/link` response (the bot will cache it) or provide a resolve endpoint.
- This scaffold uses an in-memory cache (Map) for `discordId -> userId`. It's not persistent across restarts. For production, use Redis or database.
- Keep your `DISCORD_TOKEN` secret. Use environment variables or a secret manager in production.

Next steps

- Wire the backend endpoints to accept `discordId` where needed.
- Add tests, permission checks, and rate-limiting.
- Add richer embeds and localization as needed.
