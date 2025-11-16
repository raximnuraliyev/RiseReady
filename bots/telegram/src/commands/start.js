module.exports = {
  name: 'start',
  async execute(ctx) {
    const help = `Welcome to RiseReady Bot!\n\n` +
      `I can help you connect your RiseReady account and interact with your progress from Telegram. Below are the available commands and how they work:\n\n` +
      `/link <CODE> - Link your Telegram account to your RiseReady account.\n` +
      `  • How: On the website generate a 6-character link code (Profile -> Link Bot). Then run: /link ABC123\n\n` +
      `/stats - Show your study stats (sessions this week, current streak, badges).\n\n` +
      `/focus <minutes> - Log a focus session. Example: /focus 30\n` +
      `  • This calls the backend to create a focus session and returns updated streak information.\n\n` +
      `/checkin <mood> - Submit a wellbeing check-in. Example: /checkin good\n` +
      `  • Backend will record your mood and return average mood this week.\n\n` +
      `/badges - List your earned badges with unlock dates.\n\n` +
      `/internships [limit] - Show latest internships (optionally pass a limit, default 5).\n` +
      `/leaderboard - Show top users by focus sessions / points.\n\n` +
      `/settings - View your bot settings.\n` +
      `/settings setnotifications <on|off> - Toggle notifications.\n\n` +
      `Notes:\n` +
      `• When you run /link, the bot sends the code to the backend to verify and will reply "✅ Linked!" on success.\n` +
      `• All commands use your Telegram ID (no password required). Make sure you link the correct RiseReady account using the website-generated code.\n` +
      `• For help with the website flow, open your RiseReady profile and follow Bot Integration -> Telegram.\n\n` +
      `If you need anything else, reply here or visit https://riseready.app`;

    try {
      await ctx.reply(help)
    } catch (err) {
      try { await ctx.reply('Welcome! Use /help or /start to see available commands.') } catch (e) {}
    }
  }
}
