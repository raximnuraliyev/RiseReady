const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logout')
    .setDescription('Logout from your RiseReady account'),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const discordId = interaction.user.id;
    await interaction.deferReply({ ephemeral: true });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/bots/discord/logout`, { discordId });
      const data = res.data || {};
      if (data.error) {
        return interaction.editReply({ content: `❌ ${data.error}` });
      }
      // Remove from cache
      if (client.userCache && client.userCache.has(discordId)) {
        client.userCache.delete(discordId);
      }
      return interaction.editReply({ content: `✅ Successfully logged out. Your RiseReady account has been unlinked from Discord.` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to logout';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
