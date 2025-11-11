const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('badges').setDescription("List your RiseReady badges"),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    await interaction.deferReply();
    try {
  const res = await axios.get(`${BACKEND_URL}/api/bots/discord/badges`, { params: { discordId, discordTag } });
  const badges = res.data || [];
      if (!badges.length) return interaction.editReply({ content: 'You have no badges yet.' });
      const lines = badges.map(b => `• ${b.name}${b.unlockedAt ? ` — ${new Date(b.unlockedAt).toLocaleDateString()}` : ''}`);
      return interaction.editReply({ content: `Your badges:\n${lines.join('\n')}` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch badges';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
